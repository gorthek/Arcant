import { Router, Request, Response } from 'express';

const router = Router();
const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3000';

router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { serverId, prompt, template, options } = req.body;
    
    if (!serverId || !prompt) {
      return res.status(400).json({ error: 'serverId and prompt are required' });
    }

    // On envoie la requête au serveur Bot local qui a accès à Discord.js
    const botRes = await fetch(`${BOT_API_URL}/build-server`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverId, prompt, template, options }),
    });

    if (!botRes.ok) {
      throw new Error('Failed to reach Bot internal API');
    }

    return res.status(200).json({ message: 'Server generation started' });
  } catch (error) {
    console.error('[API] /server/generate error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
