import { opendir, readFile } from "fs/promises";
import path from "path";

const DICTS_DIR = path.resolve(__dirname, "dicts/");

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

    memo = list;
  }
  return memo;
};

export type DictsIterStatus = {
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
    [[], 0],
  );
  return payloads;
};

const dicts_iterator = async (
  files: string[],
  dict_start = 0,
  line_start = 0,
): Promise<DictsIterator> => {
  const dicts = await Promise.all(files.map(read_lines));
  let dict_idx = dict_start;
  let line_idx = line_start;

  return (): ReturnType<DictsIterator> => {
    let dict = dicts[dict_idx];

    if (dict === undefined) {
      // there are no more lines
      return [null, { files, dict_idx, line_idx }];
    }

    let line = dict[line_idx];

    if (line !== undefined) {
      // next line is in the same dict
      line_idx++;
      return [line, { files, dict_idx, line_idx }];
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

    return [line ?? null, { files, dict_idx, line_idx }];
  };
};

export default dicts_iterator;
