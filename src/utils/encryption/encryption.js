import crypto from "crypto-js";
import dotenv from "dotenv";
dotenv.config();
export const encryptPhone = ({ cipherText, secret = process.env.PHONE_ENCRYPTION_KEY }) => {
  return crypto.AES.encrypt(cipherText, secret).toString();
};

// export const decryptPhone = ({ cipherText, secret = process.env.PHONE_ENCRYPTION_KEY }) => {
//   return crypto.AES.decrypt(cipherText, secret).toString(crypto.enc.Utf8);
// };
  
export const decryptPhone = ({ cipherText, secret = process.env.PHONE_ENCRYPTION_KEY }) => {
  if (!cipherText) return "";
  try {
    const decrypted = crypto.AES.decrypt(cipherText, secret).toString(crypto.enc.Utf8);
    // لو فك التشفير رجع نص فارغ، يبقى القيمة مش مشفرة أصلاً — نرجعها زي ما هي
    return decrypted || cipherText;
  } catch {
    // لو حصل خطأ، نرجع القيمة الأصلية (ممكن تكون رقم عادي مش مشفر)
    return cipherText;
  }
};