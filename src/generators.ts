/**
 * Code translated from https://github.com/spritz-group/QRFuzz/blob/d2ff11/tools/QRCodeGenerator/qr_builder.py
 */

import { AppId } from "./apps";
import { ExpandRecursively } from "./utils";

type Builder = (payload: string) => string;

type T = {
  standard: Builder;
} & Partial<Record<AppId, Builder>>;

export const generators: ExpandRecursively<T> = {
  standard: (
    payload: string, // This is for standard tests
  ) => payload,

  wallpop: (payload: string) => payload,

  posteid: (payload: string) =>
    "https://secureholder.mobile.poste.it/jod-secure-holder/qrcodeResolver/" +
    payload,

  satispay: (payload: string) => payload,
  //  "https://www.satispay.com/app/pay/shops/" + payload + "?amount=1"

  tiktok: (payload: string) => payload, // "https://vm.tiktok.com/" + payload

  telegram: (payload: string) => "tg://login?token=" + payload,

  zoom: (payload: string) => payload, // The QR code simply contain the meeting's invitation URL

  qrbarcodereader: (payload: string) => payload,

  io: (payload: string) => payload,

  shein: (payload: string) =>
    "https://shein.onelink.me/" + payload + "?af_force_deeplink=true",

  ridemovi: (payload: string) =>
    // example of correct payload: http://ridemovi.com/?bn=IB12A00232&p=1
    "http://ridemovi.com/?bn=" + payload + "&p=1",

  instagram: (payload: string) => payload, // "http://instagram.com/" + payload + "?utm_source=qr"

  instagram260: (payload: string) =>
    "http://instagram.com/" + payload + "?utm_source=qr",

  whatsapp: (payload: string) =>
    // TODO: encode payload? reverse eng. needed here - F
    payload,

  snapchat: (payload: string) => payload, // FIXME: proprietary QR code (?) - F

  paypal: (payload: string) =>
    "https://www.paypal.com/qrcodes/managed/" +
    payload +
    "?utm_source=consweb_more",

  twitter: (payload: string) => payload, // "https://twitter.com/" + payload

  discord: (payload: string) => "https://discord.gg/" + payload,

  ebay: (payload: string) => "https://ebay.com/str/" + payload,

  postepay: (payload: string) => payload, // "https://ppayapp.mobile.poste.it/jod-mobile-server/qrcs/bp/access/v1/?clusterID=1&tranId=" + payload

  bancoposta: (payload: string) => payload, // "https://ppayapp.mobile.poste.it/jod-mobile-server/qrcs/bp/access/v1/?clusterID=1&tranId=" + payload

  ucbrowser: (payload: string) => payload,

  broadlink: (payload: string) => payload,

  chrome: (payload: string) => payload,

  facebook: (payload: string) => "https://facebook.com/qr?id=" + payload,

  messages: (payload: string) =>
    "https://support.google.com/messages/?p=web_computer//?c=" + payload,

  // TODO
  //  verificac19: (payload: string) => ...,

  line: (payload: string) => payload, // "https://line.me/R/ti/g/"+payload
};

export default generators;
