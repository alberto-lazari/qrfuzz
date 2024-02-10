/**
 * Code translated from https://github.com/spritz-group/QRFuzz/blob/d2ff11/tools/QRCodeGenerator/qr_builder.py
 */

import { AppId } from "./apps";

type Builder = (payload: Uint8Array) => Uint8Array;

type T = {
  standard: Builder;
} & Partial<Record<AppId, Builder>>;

const concat = (...arr: (Uint8Array | string)[]): Uint8Array =>
  Buffer.concat(
    arr.map((v) => {
      if (typeof v === "string") {
        return new TextEncoder().encode(v);
      } else {
        return v;
      }
    })
  );

export const generators: T = {
  standard: (
    payload // This is for standard tests
  ) => payload,

  wallpop: (payload) => payload,

  posteid: (payload) =>
    concat(
      "https://secureholder.mobile.poste.it/jod-secure-holder/qrcodeResolver/",
      payload
    ),

  satispay: (payload) => payload,
  // concat("https://www.satispay.com/app/pay/shops/", payload, "?amount=1")

  tiktok: (payload) => payload, // concat("https://vm.tiktok.com/", payload)

  telegram: (payload) => concat("tg://login?token=", payload),

  zoom: (payload) => payload, // The QR code simply contain the meeting's invitation URL

  qrbarcodereader: (payload) => payload,

  io: (payload) => payload,

  shein: (payload) =>
    concat("https://shein.onelink.me/", payload, "?af_force_deeplink=true"),

  ridemovi: (payload) =>
    // example of correct payload: http://ridemovi.com/?bn=IB12A00232&p=1
    concat("http://ridemovi.com/?bn=", payload, "&p=1"),

  instagram: (payload) => payload, // concat("http://instagram.com/", payload, "?utm_source=qr")

  instagram260: (payload) =>
    concat("http://instagram.com/", payload, "?utm_source=qr"),

  whatsapp: (payload) =>
    // TODO: encode payload? reverse eng. needed here - F
    payload,

  snapchat: (payload) => payload, // FIXME: proprietary QR code (?) - F

  paypal: (payload) =>
    concat(
      "https://www.paypal.com/qrcodes/managed/",
      payload,
      "?utm_source=consweb_more"
    ),

  twitter: (payload) => payload, // concat("https://twitter.com/", payload)

  discord: (payload) => concat("https://discord.gg/", payload),

  ebay: (payload) => concat("https://ebay.com/str/", payload),

  postepay: (payload) => payload, // concat("https://ppayapp.mobile.poste.it/jod-mobile-server/qrcs/bp/access/v1/?clusterID=1&tranId=", payload)

  bancoposta: (payload) => payload, // concat("https://ppayapp.mobile.poste.it/jod-mobile-server/qrcs/bp/access/v1/?clusterID=1&tranId=", payload)

  ucbrowser: (payload) => payload,

  broadlink: (payload) => payload,

  chrome: (payload) => payload,

  facebook: (payload) => concat("https://facebook.com/qr?id=", payload),

  messages: (payload) =>
    concat("https://support.google.com/messages/?p=web_computer//?c=", payload),

  // TODO
  //  verificac19: (payload) => ...,

  line: (payload) => payload, // concat("https://line.me/R/ti/g/", payload)
};

export const get_generator = (app: string) => {
  const generator = generators[app as AppId];
  if (generator !== undefined) {
    return generator;
  } else {
    return generators.standard;
  }
};

export default generators;
