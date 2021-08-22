const path = require("path");

const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads"));
  },
  filename: function (req, file, cb) {
    const uuid = uuidv4();
    const uniqueSuffix = uuid + "-" + Math.round(Math.random() * 1e9);
    const finalName =
      file.fieldname + "-" + uniqueSuffix + "." + file.mimetype.split("/")[1];
    req.finalName = finalName;
    cb(null, finalName);
  },
});

module.exports = multer({ storage: storage });
