import { resolve } from "path";
import { AppId } from "./apps";

const INSPECTORS_DIRNAME = "inspectors";

export type Inspector = {
  app_name: string;
  app_package: string;
  app_activity: string;
  goToScan(driver: WebdriverIO.Browser): Promise<void>;
  getResultView(
    driver: WebdriverIO.Browser
  ): Promise<{ error: "no such element" }>;
  goBackToScan(driver: WebdriverIO.Browser): Promise<void>;
};

export type InspectorModule = {
  Inspector: { prototype: Inspector };
};

export const get_inspector = async (app: AppId) => {
  const module = (await import(
    resolve(__dirname, INSPECTORS_DIRNAME, app)
  )) as InspectorModule;
  return module.Inspector;
};
