import { Router, Request, Response } from 'express';
import { CustomBot } from '@arcant/database';
import axios from 'axios';

const router = Router();

// L'URL interne du bot (Render permet la communication via le nom de service interne ou localhost en mode dev)
const BOT_SERVICE_URL = process.env.BOT_SERVICE_URL || 'http://localhost:3000';

router.post('/deploy', async (req: Request, res: Response): Promise<void> => {
  try {
    const { ownerId, serverId, botName, botToken, systemPrompt, features } = req.body;

    if (!ownerId || !botName || !botToken) {
      res.status(400).json({ error: 'Missing required fields (ownerId, botName, botToken)' });
      return;
    }

    // Upsert the custom bot in DB
    const bot = await CustomBot.findOneAndUpdate(
      { botToken }, 
      {
        ownerId,
        serverId,
        botName,
        systemPrompt,
        features: features || [],
        isActive: true,
      },
      { new: true, upsert: true }
    );

    // Notify the Bot service to spawn it
    try {
      await axios.post(`${BOT_SERVICE_URL}/spawn-bot`, {
        botId: bot._id.toString()
      });
      res.status(200).json({ message: 'Bot deployed successfully', bot });
    } catch (botError) {
      console.error('[API] Failed to notify bot service:', botError);
      res.status(500).json({ error: 'Bot saved in DB, but failed to start process. Is the Bot service running?', details: botError });
    }
  } catch (error) {
    console.error('[API] Deploy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
