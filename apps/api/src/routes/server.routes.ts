import { Router, Request, Response } from 'express';

const router = Router();
const BOT_API_URL = process.env.BOT_API_URL || 'http://localhost:3000';

// 1. Demander à l'IA de générer le brouillon JSON
router.post('/generate-preview', async (req: Request, res: Response) => {
  try {
    const { prompt, templateUrl, options } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
    }

    const botRes = await fetch(`${BOT_API_URL}/generate-preview`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, templateUrl, options }),
    });

    if (!botRes.ok) {
      throw new Error('Failed to reach Bot internal API');
    }

    const data = await botRes.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('[API] /server/generate-preview error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Envoyer le JSON final pour création/synchronisation sur Discord
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const { serverId, structure, options } = req.body;
    
    if (!serverId || !structure) {
      return res.status(400).json({ error: 'serverId and structure are required' });
    }

    const botRes = await fetch(`${BOT_API_URL}/sync-server`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serverId, structure, options }),
    });

    if (!botRes.ok) {
      throw new Error('Failed to reach Bot internal API');
    }

    const data = await botRes.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('[API] /server/sync error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Lire l'état actuel du serveur Discord (pour l'éditeur visuel)
router.get('/:id/structure', async (req: Request, res: Response) => {
  try {
    const serverId = req.params.id;
    
    if (!serverId) {
      return res.status(400).json({ error: 'serverId is required' });
    }

    const botRes = await fetch(`${BOT_API_URL}/server-structure/${serverId}`);

    if (!botRes.ok) {
      throw new Error('Failed to reach Bot internal API');
    }

    const data = await botRes.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('[API] /server/:id/structure error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
