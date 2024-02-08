import { exec } from "child_process";
import { appendFile, writeFile } from "fs/promises";
import { resolve } from "path";
import { Inspector } from "./inspector";

const _qrcodelogs_file = "qrcodes-logs.log";
const _screen_path = "screen/";

export const log = (data_path: string, message: string) => {
  if (!message.endsWith("\n")) {
    message += "\n";
  }
  appendFile(resolve(data_path, _qrcodelogs_file), message).catch((err) =>
    console.warn(`[logger.ts] log error: ${JSON.stringify(err)}`)
  );
};

export const saveLogcat = async (
  appIns: Inspector,
  data_path: string,
  name: string,
  driver: WebdriverIO.Browser
) => {
  const logs = (await driver.getLogs("logcat")) as { message: string }[];
  // execute child process searching for pid : `adb shell pidof apppackage`
  exec(`adb shell pidof ${appIns.app_package}`, function (_error, stdOut) {
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
      console.log(`[QRCodeFuzzer] ${JSON.stringify(err)}`);
    });
  });
};

export const saveScreenshot = async (
  data_path: string,
  name: string,
  driver: WebdriverIO.Browser
) => {
  const image = await driver.takeScreenshot();
  await Promise.all([
    await writeFile(resolve(_screen_path, name), image, "base64").catch((err) =>
      console.warn(`[logger.ts] saveScreenshot error: ${JSON.stringify(err)}`)
    ),
    log(data_path, "OK"),
  ]);
};
