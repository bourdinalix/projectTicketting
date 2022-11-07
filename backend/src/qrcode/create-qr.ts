import QRCode from "qrcode";

const generateQR = async (qrInfo: string) => {
  try {
    const qrCode = await QRCode.toDataURL(`${qrInfo}${Date.now()}`);
    if (!qrCode) return;
    return qrCode;
  } catch (err) {
    console.log(err);
  }
};

export default generateQR;
