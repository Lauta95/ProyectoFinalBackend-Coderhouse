import mongoose from "mongoose";

const chatsCollection = "messages";

const chatSchema = new mongoose.Schema({
  user: String,
  message: String,
  hour: String,
});

const ChatModel = mongoose.model(chatsCollection, chatSchema);

export default ChatModel;