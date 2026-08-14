const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadsDir = path.join(__dirname, "../../uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Disk storage configurations
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate secure unique filenames (e.g. leaf_17182939102.png)
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `leaf_${uniqueSuffix}${ext}`);
  }
});

// File filter check for allowed mime types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const matchExt = allowedTypes.test(ext);
  const matchMime = allowedTypes.test(mime);

  if (matchExt && matchMime) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, PNG, and WEBP image uploads are allowed."));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 Megabytes
  },
  fileFilter: fileFilter
});

module.exports = upload;
