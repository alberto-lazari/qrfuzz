import { exec } from "child_process";
import { appendFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { _appIns } from ".";
import * as loader from "./loader";
const _qrcodelogs_file = "qrcodes-logs.log";
const _screen_path = "screen/";

export const log = async (data_path: string, message: string) => {
  await appendFile(resolve(data_path, _qrcodelogs_file), message).catch((err) =>
    console.warn("[QRCodeFuzzer] SAVE_SCREENSHOT error: " + JSON.stringify(err))
  );
};

export async function saveLogcat(
  data_path: string,
  name: string,
  driver: WebdriverIO.Browser
) {
  const logs = (await driver.getLogs("logcat")) as { message: string }[];
  const appIns = await _appIns;

  // execute child process searching for pid : `adb shell pidof apppackage`
  exec("adb shell pidof " + appIns.app_package, function (_error, stdOut) {
    const pid = Number(stdOut);
    let logcat = "";

    if (Number.isNaN(pid)) {
      // if pid not found: seach by name|package
      logcat = (logs as { message: string }[])
        .filter(
          (entry) =>
            entry.message.toLowerCase().includes(appIns.app_name) ||
            entry.message.toLowerCase().includes(appIns.app_package)
        )
        .map((entry) => entry.message)
        .join("\n");
    } else {
      // search for pid
      logcat = logs
        .filter((entry) => entry.message.toLowerCase().includes(pid.toString()))
        .map((entry) => entry.message)
        .join("\n");
    }

    appendFile(resolve(data_path, "logs", name), logcat).catch((err) => {
      console.log("[QRCodeFuzzer] " + JSON.stringify(err));
    });
  });
}

export async function saveScreenshot(
  name: string,
  driver: WebdriverIO.Browser
) {
  const image = await driver.takeScreenshot();
  await Promise.all([
    await writeFile(resolve(_screen_path, name), image, "base64").catch((err) =>
      console.warn(
        "[QRCodeFuzzer] SAVE_SCREENSHOT error: " + JSON.stringify(err)
      )
    ),
    log(loader.data_path(), "OK"),
  ]);
}
