const _wdio = import("webdriverio");
import * as loader from "./loader";
import * as qr_writer from "./qr_code";
import {
  dicts_iterator,
  list_dicts,
  saveState,
  DictsIterStatus,
} from "./dictionary.js";
import { log, saveLogcat, saveScreenshot } from "./logger";
import sleep from "./sleep";
import { exec } from "child_process";

loader.checkArguments();
const app_id = loader.app_name();
const _appIns = loader.getAppInspector();

const _opts = _appIns.then((appIns) => ({
  path: "/wd/hub",
  port: loader.fuzz_port(), // 4723,
  capabilities: {
    platformName: "Android",
    "appium:appPackage": appIns.app_package,
    "appium:appActivity": appIns.app_activity,
    "appium:automationName": "UiAutomator2",
    "appium:autoGrantPermissions": "true",
    // "appium:noReset": "true"
  },
}));

const tmp_qr = "/tmp/qr_code.png";

// Main loop
// Curious developer, start from here :)

const main = async () => {
  const data_path = loader.data_path();
  const wdio_timeout = loader.wdio_timeout();

  let driver = await startDriver(wdio_timeout);
  const appIns = await _appIns;

  await goToAppScanPage(driver);

  // by default fuzz all
  const files = (await list_dicts()).map((dict) => dict.fullname);
  const qr_iter = await dicts_iterator(app_id, files);

  // Perform QR Checking
  let qr_payload: Uint8Array | null;
  let qr_status: DictsIterStatus;
  while ((([qr_payload, qr_status] = qr_iter()), qr_payload != null)) {
    await sleep(2000);
    await qr_writer.write(Buffer.from(qr_payload), tmp_qr);
    exec(`../util/stream ${tmp_qr}`);
    await sleep(3000);

    const dict = qr_status.files[qr_status.dict_idx];
    const line_idx = qr_status.line_idx;
    const name = `${dict}-${line_idx}`;

    console.log(`> QR code under analysis: file: ${dict}, line: ${line_idx}`);

    driver = await checkAppRunningAndRestart(driver, wdio_timeout);

    // Hook to result view
    const result_view = await appIns.getResultView(driver);

    // Result view error check
    if (result_view?.error == "no such element") {
      const msg = `[index.ts] Unable to read QR Code: file: ${dict}, line: ${line_idx}`;
      console.log(msg);

      log(data_path, msg);
      await Promise.all([
        saveLogcat(appIns, data_path, name + ".log", driver),
        saveScreenshot(data_path, name + ".png", driver),
      ]);
    } else {
      // Await for the script before taking a screenshot
      await sleep(200);
      const msg = `[index.ts] Read QR Code: file: ${dict}, line: ${line_idx}`;
      console.log(msg);

      log(data_path, msg);
      await Promise.all([
        saveLogcat(appIns, data_path, name + ".log", driver),
        saveScreenshot(data_path, name + ".png", driver),
      ]);

      try {
        await appIns.goBackToScan(driver);
      } catch (error) {
        driver = await startDriver(10000);
        await goToAppScanPage(driver);
      }
    }

    await saveState(qr_status);
  }

  await driver.deleteSession();
};

// Start and set the config for the WebdriverIO
async function startDriver(timeout = 10000) {
  const wdio = await _wdio;
  const opts = await _opts;
  //@ts-expect-error ...
  const driver = await wdio.remote(opts);
  // Wait before crashing if not finding an element
  await driver.setTimeout({ implicit: timeout });
  return driver;
}

async function goToAppScanPage(driver: WebdriverIO.Browser) {
  const appIns = await _appIns;
  const data_path = loader.data_path();
  try {
    await appIns.goToScan(driver);
  } catch (error) {
    const msg = `[index.ts] Unable to go to the scan page (error: ${error as string})`;
    console.log(msg);
    log(data_path, msg);
    await goToAppScanPage(driver);
  }
}

async function checkAppRunningAndRestart(
  driver: WebdriverIO.Browser,
  timeout = 10000
) {
  const appState = await driver.queryAppState((await _appIns).app_package);

  if (appState != 4) {
    // 4= running in foreground
    console.log(
      "[QRCodeFuzzer] Process unexpectedly closed. Trying to restore..."
    );
    driver = await startDriver(timeout);
    await goToAppScanPage(driver);
  }
  return driver;
}

main().catch(console.error);
