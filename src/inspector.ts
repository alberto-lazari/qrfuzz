import { resolve } from "path";
import { log } from "./logger";
import { data_path } from "./loader";

const INSPECTORS_DIRNAME = "inspectors";

export type Inspector = {
  app_name: string;
  app_package: string;
  app_activity: string;
  goToScan(driver: WebdriverIO.Browser): Promise<void>;
  getResultView(
    driver: WebdriverIO.Browser
  ): Promise<
    { error: "no such element" } | { error: undefined; ELEMENT: string }
  >;
  goBackToScan(driver: WebdriverIO.Browser): Promise<void>;
};

type InspectorModule = {
  Inspector: new () => Inspector;
};

export const get_inspector = async (app: string) => {
  const module = (await import(
    resolve(__dirname, INSPECTORS_DIRNAME, app)
  )) as InspectorModule;
  const inspector = new module.Inspector();
  console.debug(inspector);
  log(data_path(), `Inspector ${app} loaded`);
  return inspector;
};
