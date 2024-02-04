/* NOTE: to extend the program:
 * - add here the app id
 * - add an optional data builder in src/data_builder.ts
 * - add a driver in // TODO
 */

const apps = [
  "wallpop",
  "posteid",
  "satispay",
  "tiktok",
  "telegram",
  "zoom",
  "qrbarcodereader",
  "io",
  "shein",
  "ridemovi",
  "instagram",
  "instagram260",
  "whatsapp",
  "snapchat",
  "paypal",
  "twitter",
  "discord",
  "ebay",
  "postepay",
  "bancoposta",
  "ucbrowser",
  "broadlink",
  "chrome",
  "facebook",
  "messages",
  "verificac19",
  "line",
] as const;

export type AppId = (typeof apps)[number];

export default apps;
