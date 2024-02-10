import path from "path";
import fs from "fs";
import { get_inspector } from "./inspector";

// Default variables
const app = process.argv[2] ?? "";
let port = 4723;
let dpath = "./data-tests";
let device = "TestDevice";
let dstart = 0;
const dtimeout = 10000; // 10 seconds
const ifiles: string[] = [];

// Main argument checker function

function checkArguments() {
  // console.info(
  //   "[Usage:] node index.js <app_inspector> [optional: <data_path> <appium_port> <appium_device_udid> <starting_from>]"
  // );

  const argPath = process.argv[3];
  const argPort = process.argv[4];
  const argDevice = process.argv[5];
  const argStartFrom = process.argv[6];

  if (argPath === undefined)
    console.warn(`[QRCodeFuzzer] Defaulting to path ${dpath}`);
  else {
    dpath = argPath;

    if (dpath.endsWith("/")) {
      dpath = dpath.slice(0, -1);
    }
    console.info(`[QRCodeFuzzer] Using path: ${dpath}`);
  }

  if (!fs.existsSync(dpath)) {
    console.error("[QRCodeFuzzer] Directory path does not exists");
    process.exit(1);
  }

  if (argPort === undefined)
    console.warn(`[QRCodeFuzzer] Defaulting to port ${port}`);
  else {
    port = parseInt(argPort);
    if (isNaN(port)) {
      console.error("[QRCodeFuzzer] Wrong port number, not a number");
      process.exit(1);
    } else {
      console.info(`[QRCodeFuzzer] Using port: ${port}`);
    }
  }

  if (argDevice === undefined)
    console.warn(`[QRCodeFuzzer] Defaulting to device name: ${device}`);
  else {
    device = argDevice;
    console.info(`[QRCodeFuzzer] Using device name: ${device}`);
  }

  if (argStartFrom === undefined)
    console.warn(`[QRCodeFuzzer] Default start from ${dstart}`);
  else {
    dstart = parseInt(argStartFrom);
    if (isNaN(dstart)) {
      console.error("[QRCodeFuzzer] Wrong start, not a number");
      process.exit(1);
    } else {
      console.info(`[QRCodeFuzzer] Starting from: ${dstart}`);
    }
  }
}

// This function includes the correct app inspector
// depending on the parameter passed in the function

async function getAppInspector() {
  console.log("[QRCodeFuzzer] Checking inspector validity...");

  fs.readdirSync(path.join(__dirname, "./inspectors")).forEach(function (file) {
    ifiles.push(path.parse(file).name);
  });

  if (app === undefined || !ifiles.includes(app)) {
    console.log(
      "[QRCodeFuzzer] Wrong inspector passed! Please pass a filename from ./inspectors folder. Available options: "
    );
    console.log(ifiles);
    process.exit(1);
  }

  console.log("[QRCodeFuzzer] OK, starting Appium...");

  return get_inspector(app);
}

const getApp = () => app;
const getPath = () => dpath;
const getPort = () => port;
const getDevice = () => device;
const getStartFrom = () => dstart;
const getDriverTimeout = () => dtimeout;

const _getAppInspector = getAppInspector;
export { _getAppInspector as getAppInspector };
const _checkArguments = checkArguments;
export { _checkArguments as checkArguments };
export const app_name = getApp;
export const data_path = getPath;
export const fuzz_port = getPort;
export const fuzz_device = getDevice;
export const fuzz_start = getStartFrom;
export const wdio_timeout = getDriverTimeout;
