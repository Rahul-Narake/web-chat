import express from 'express';
import {
  addNewMemebersToGroup,
  createNewGroupChat,
  createNewGroupChatWithPic,
  createNormalChat,
  getAllConversations,
  getConversation,
  getMessages,
  sendMessage,
  updateConversationName,
  updateConversationProfile,
} from '../controllers/conversation.controller';
import protectRoute from '../middelwares/protectRoute';
import upload from '../middelwares/multer';
const router = express.Router();

router.post('/groupchat', protectRoute, createNewGroupChat);
router.post(
  '/groupwithpic',
  protectRoute,
  upload.single('profile'),
  createNewGroupChatWithPic
);
router.post('/normalchat', protectRoute, createNormalChat);
router.get('/', protectRoute, getAllConversations);
router.post('/send', protectRoute, sendMessage);
router.get('/con', protectRoute, getConversation);
router.get('/messages/:conversationId', protectRoute, getMessages);
router.put('/add-members', protectRoute, addNewMemebersToGroup);
router.put('/changeName', protectRoute, updateConversationName);
router.post(
  '/change-group-profile',
  protectRoute,
  upload.single('profile'),
  updateConversationProfile
);
export default router;
