// =============================== import modules ================================
import multer from "multer"
import dotenv from "dotenv";
dotenv.config();
// ============================= Upload File (System) =============================
export const uploadFile = () => multer({ storage: multer.memoryStorage() });


