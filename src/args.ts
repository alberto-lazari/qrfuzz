import { parseArgs } from "util";

export default (): ArgsType => {
  const { positionals } = parseArgs({
    strict: true,
    allowPositionals: true,
  });

  if (positionals.length == 0) {
    throw new Error("Please provide a command, none given");
  }
  if (positionals.length > 1) {
    throw new Error("At most one command can be passed");
  }

  switch (positionals[0]) {
    case "list-dicts":
      return { command: "list-dicts" };
      break;

    default:
      throw new Error(`Command ${positionals[0]} unknown`);
  }
};

export type ArgsType = {
  command: "list-dicts";
};
