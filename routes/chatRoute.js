const express = require('express').Router;
const {
   findUserChats,
   findChat,
   createChat,
} = require('../services/chat-service');
const authMiddleware = require('../middlewares/auth-middleware');
const { createMessage, getMessages } = require('../services/message-service');
const router = new express();

router.use(authMiddleware);

router.post('/', createChat);
router.get('/:userId', findUserChats);
router.get('/find/:firstId/:secondId', findChat);

router.post('/message', createMessage);
router.get('/message/:chatId', getMessages);

module.exports = router;
