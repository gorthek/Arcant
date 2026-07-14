const fs = require('fs');

async function testDiscordApi() {
  try {
    const envContent = fs.readFileSync('./apps/web/.env.local', 'utf8');
    const clientId = "1521523509589704714";
    const clientSecret = "74yh6dUQGh45TWhVYKjh9zLVRQf1B2Zf";

    console.log('Testing Discord Client Credentials...');
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('scope', 'identify');

    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    const tokenRes = await fetch('https://discord.com/api/v10/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`
      },
      body: params
    });

    const tokenData = await tokenRes.json();
    console.log('Token response:', tokenData);

    const ids = ['1061340110219640905', '724000427590418453', '1320747774891003965'];
    
    if (tokenData.access_token) {
      for (const id of ids) {
        const userRes = await fetch(`https://discord.com/api/v10/users/${id}`, {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`
          }
        });
        console.log(id, 'Bearer status:', userRes.status, await userRes.json());
      }
    }
  } catch(e) {
    console.error('Error:', e);
  }
}

testDiscordApi();
