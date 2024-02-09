import { opendir, readFile, writeFile } from "fs/promises";
import path, { resolve } from "path";
import { AppId } from "./apps";
import { data_path } from "./loader";

const DICTS_DIR = path.resolve(__dirname, "dicts/");
const STATE_FILE = "fuzzer_state.json";

type DictFile = {
  name: string;
  fullname: string;
};

let memo: DictFile[] | null = null;

export const list_dicts = async (refresh = false): Promise<DictFile[]> => {
  if (refresh || memo === null) {
    const list: DictFile[] = [];

    const dir = await opendir(DICTS_DIR);
    for await (const file of dir) {
      if (file.isFile()) {
        const fullname = file.name;
        const base = path.basename(fullname, path.extname(fullname));
        list.push({ fullname, name: base });
      }
    }

    memo = list.sort();
  }
  return memo;
};

export type DictsIterStatus = {
  app: string;
  files: string[];
  dict_idx: number;
  line_idx: number;
};

export type DictsIterator = () => [Uint8Array | null, DictsIterStatus];

const read_lines = async (file: string): Promise<Uint8Array[]> => {
  const buffer = await readFile(path.resolve(DICTS_DIR, file));
  // split buffer on LF and CR
  const [payloads] = buffer.reduce<[Uint8Array[], number]>(
    ([payloads, line_start], b, idx, buf) => {
      if ([0x0a /*LF*/, 0x0d /*CR*/].includes(b) || idx == buf.length - 1) {
        // this check prevents the insertion of empty arrays
        if (line_start < idx) {
          payloads.push(buf.slice(line_start, idx));
        }
        return [payloads, idx + 1];
      }
      return [payloads, line_start];
    },
    [[], 0]
  );
  return payloads;
};

export const getState = async (
  app: AppId,
  files: string[]
): Promise<DictsIterStatus | null> => {
  const status: DictsIterStatus | null = await readFile(
    resolve(data_path(), STATE_FILE),
    "utf-8"
  )
    .then((content) => {
      try {
        const state = JSON.parse(content) as DictsIterStatus;
        return state;
      } catch (error) {
        // JSON.parse failed
        const msg = `Parse of file ${STATE_FILE} failed.`;
        throw msg;
      }
    })
    .catch((err: { code: string }) => {
      if (err.code === "ENOENT") {
        console.log(`File ${STATE_FILE} not found.`);
        return null;
      }
      throw err;
    });

  if (status === null) {
    console.log(`App ${app} does not have a saved status in ${STATE_FILE}.`);
    return null;
  } else if (
    status.app === app &&
    Array.isArray(status.files) &&
    status.files.every((f) => typeof f === "string") &&
    typeof status.dict_idx === "number" &&
    Number.isInteger(status.dict_idx) &&
    typeof status.line_idx === "number" &&
    Number.isInteger(status.line_idx)
  ) {
    if (
      status.files.length !== files.length ||
      status.files.some((v, i) => v !== files[i])
    )
      throw `Available dicts for ${app} have changed from\n\t${status.files.toString()}to\n\t${files.toString()}`;
    else
      return {
        app,
        files,
        dict_idx: Number(status.dict_idx),
        line_idx: Number(status.line_idx),
      };
  } else {
    throw `File ${STATE_FILE} is malformed.`;
  }
};

export const saveState = async (status: DictsIterStatus) => {
  await writeFile(resolve(data_path(), STATE_FILE), JSON.stringify(status));
};

export const dicts_iterator = async (app: string, files: string[]) => {
  const _dicts = Promise.all(files.map(read_lines));
  const status = await getState(app as AppId, files).catch((err) => {
    throw `Error reading ${STATE_FILE}:\n\t${err}`;
  });
  const dicts = await _dicts;
  if (status !== null) {
    console.log(
      `${app}: iterating on ${files.toString()} from file n° ${status.dict_idx}, line n° ${status.line_idx}`
    );
    return _dicts_iterator(app, files, dicts, status.dict_idx, status.line_idx);
  }
  console.log(`${app}: iterating on ${files.toString()} from the beginning`);
  return _dicts_iterator(app, files, dicts);
};

const _dicts_iterator = (
  app: string,
  files: string[],
  dicts: Uint8Array[][],
  dict_start = 0,
  line_start = 0
): DictsIterator => {
  let dict_idx = dict_start;
  let line_idx = line_start;

  return (): ReturnType<DictsIterator> => {
    let dict = dicts[dict_idx];

    if (dict === undefined) {
      // there are no more lines
      return [null, { app, files, dict_idx, line_idx }];
    }

    let line = dict[line_idx];

    if (line !== undefined) {
      // next line is in the same dict
      line_idx++;
      return [line, { app, files, dict_idx, line_idx }];
    }

    // use the first line of the next dict with at least one line
    dict_idx++;
    line_idx = 0;

    /** invariants at the beginning of each iteration:
     *  - dict := ┬ dicts[dict_idx] if dict_idx < dicts.length,
     *            └ undefined       otherwise
     *  - line := ┬ dict[line_idx]  if dict !== undefined && line_idx < dict.length
     *            └ undefined       otherwise
     */
    while (
      (dict = dicts[dict_idx]) !== undefined &&
      (line = dict[line_idx]) === undefined
    ) {
      dict_idx++;
    }

    if (dict !== undefined) {
      // implies line !== undefined because of while exit condition
      line_idx++;
    }

    return [line ?? null, { app, files, dict_idx, line_idx }];
  };
};

export default dicts_iterator;
