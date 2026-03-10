import multer from "multer";
import path from "path";
import fs from "fs";

const JD_DIR = path.join(process.cwd(), "uploads", "jd");

const jdStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(JD_DIR, { recursive: true });
    cb(null, JD_DIR);
  },
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${(file.originalname || "file").replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    cb(null, safeName);
  },
});

export const uploadJd = multer({
  storage: jdStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).single("jd");
