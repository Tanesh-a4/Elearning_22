import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { 
  getUserConversations, 
  getConversationMessages, 
  sendMessage,
  getContactsList
} from '../controllers/chat.js';

const router = express.Router();

router.get('/conversations', isAuth, getUserConversations);
router.get('/conversations/:conversationId/messages', isAuth, getConversationMessages);
router.post('/messages', isAuth, sendMessage);
router.get('/contacts', isAuth, getContactsList);

export default router;