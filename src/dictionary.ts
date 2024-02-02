import { opendir } from "fs/promises";
import path from "path";

const DICTS_DIR = path.resolve(__dirname, "dicts/");

export const list_dicts = async () => {
  const dir = await opendir(DICTS_DIR);
  const ret: string[] = [];
  if (dir !== undefined) {
    for await (const file of dir) {
      if (file.isFile()) {
        const fullname = file.name;
        const base = path.basename(fullname, path.extname(fullname));
        ret.push(base);
      }
    }
  }
  return ret;
};
