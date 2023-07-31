import { Router } from 'express';
import ChatModel from '../DAO/mongoManager/models/message.model.js';

const router = Router();

router.get('/', (req, res) => {
  res.render('chat', {});
});

router.post('/send-message', async (req, res) => {
  const data = req.body;
  try {
    const savedMessage = await ChatModel.create(data);
    console.log('Message saved:', savedMessage);
    res.send(savedMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).send('Error saving message');
  }
});

export default router;
