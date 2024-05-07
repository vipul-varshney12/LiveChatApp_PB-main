const expressAsyncHandler = require("express-async-handler");
const Message = require("../modals/messageModel");
const User = require("../modals/userModel");
const Chat = require("../modals/chatModel");

const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name email")
      .populate("reciever")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    var message = await Message.create(newMessage);

    console.log(message);
    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await message.populate("reciever");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


//const Message = require("../modals/messageModel");

const deleteChat = expressAsyncHandler(async (req, res) => {
  const chatId = req.params.chatId;

  if (!chatId) {
    console.log("Invalid chatId passed into request");
    return res.sendStatus(400);
  }

  try {
    // Find the chat and delete it
    const chat = await Chat.findByIdAndRemove(chatId);

    if (!chat) {
      console.log("Chat not found");
      return res.status(404).send({ message: "Chat not found" });
    }

    // Delete all messages associated with the chat
    await Message.deleteMany({ chat: chatId });
    
    res.json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const deleteSingleChat = expressAsyncHandler(async (req, res) => {
  const chatId = req.params.chatId;

  if (!chatId) {
    console.log("Invalid chatId passed into request");
    return res.sendStatus(400);
  }

  try {
    // Find the chat and delete it
    const chat = await Chat.findByIdAndRemove(chatId);

    if (!chat) {
      console.log("Chat not found");
      return res.status(404).send({ message: "Chat not found" });
    }

    // Delete all messages associated with the chat
    await Message.deleteMany({ chat: chatId });

    res.json({ message: "Single chat deleted successfully" });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage ,deleteChat,deleteSingleChat};
