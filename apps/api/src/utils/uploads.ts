import fs from 'fs';
import path from 'path';
import multer from 'multer';

export const uploadDir = path.join(process.cwd(), 'data', 'uploads');

export function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
}

ensureUploadDir();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.bin';
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]+/g, '_');
    const ts = Date.now();
    cb(null, `${base}_${ts}${ext}`);
  },
});

export const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
