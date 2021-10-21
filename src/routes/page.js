const express = require("express");
const {
  addPage,
  getPages,
  deletePages,
} = require("../controller/page");
const {
  requireSignin,
  adminMiddleware,
  superAdminMiddleware,
} = require("../common-middleware");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/page/create",
  requireSignin,
  adminMiddleware,
  upload.single("pageImage"),
  addPage
);
router.get("/page/getpage", getPages);

router.post(
  "/page/delete",
  requireSignin,
  adminMiddleware,
  deletePages
);

module.exports = router;
