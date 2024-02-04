import * as QRCodeGenerator from "./dictionary";
import argParse from "./args";

const list_dicts = () =>
  QRCodeGenerator.list_dicts().then((list): void => {
    list.sort().forEach(({ name }) => console.log(name));
  });

const main = async () => {
  const args = argParse();
  if (args) {
    switch (args.command) {
      case "list-dicts":
        await list_dicts();
        break;
    }
  }
};

if (require.main === module) {
  main().catch((err) => console.error((err as Error).message));
}
