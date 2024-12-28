const express = require("express");
const {
  allMessages,
  sendMessage,
  deleteChat,
  deleteSingleChat,
} = require("../controllers/messageControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
router.route("/:chatId").delete(protect, deleteChat);
router.route("/:chatId").delete(protect, deleteSingleChat);

module.exports = router;
