const express = require("express");
const {
  allMessages,
  sendMessage,
  deleteChat,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
router.route("/:chatId").delete(protect, deleteChat);

module.exports = router;
