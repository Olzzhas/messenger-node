const messageModel = require('../models/message-model');

const createMessage = async (req, res) => {
   const { chatId, senderId, text, file_title, file_url } = req.body;

   const message = new messageModel({
      chatId,
      senderId,
      text,
      file_title,
      file_url,
   });

   try {
      const response = await message.save();

      res.status(200).json(response);
   } catch (error) {
      console.log(error);
      res.status(500).json(error);
   }
};

const getMessages = async (req, res) => {
   const { chatId } = req.params;
   try {
      const messages = await messageModel.find({ chatId });
      res.status(200).json(messages);
   } catch (error) {
      console.log(error);
      res.status(500).json(error);
   }
};

const getAllMessages = async (req, res, next) => {
   try {
      const allMessages = await messageModel.find();
      return res.json(allMessages);
   } catch (error) {
      next();
   }
};

module.exports = { createMessage, getMessages, getAllMessages };
