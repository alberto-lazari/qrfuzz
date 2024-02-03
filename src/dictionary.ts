import { opendir } from "fs/promises";
import path from "path";

const DICTS_DIR = path.resolve(__dirname, "dicts/");

let memo: string[] | null = null;

export const list_dicts = async (refresh = false): Promise<string[]> => {
  if (refresh || memo === null) {
    const list: string[] = [];

    const dir = await opendir(DICTS_DIR);
    for await (const file of dir) {
      if (file.isFile()) {
        const fullname = file.name;
        const base = path.basename(fullname, path.extname(fullname));
        list.push(base);
      }
    }

    memo = list;
  }
  return memo;
};
