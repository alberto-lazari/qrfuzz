import QRCode, { QRCodeSegment } from "qrcode";

export const write = async (payload: string, output: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const segs: QRCodeSegment[] = [{ data, mode: "byte" }];
  return QRCode.toFile(output, segs, {
    errorCorrectionLevel: "L",
    scale: 10,
    margin: 4,
    color: { dark: "#000000ff", light: "#ffffffff" },
  });
};
