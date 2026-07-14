const mongoose = require('mongoose');

async function checkDb() {
  try {
    const mongoUri = "mongodb+srv://Vercel-Admin-Arcantdb:2nIy4yEvti2ov6K1@arcantdb.fvubsbt.mongodb.net/?retryWrites=true&w=majority";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB!");

    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));

    // Check users collection
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log("Users in DB:", users.map(u => ({ id: u.discordId || u._id || u.id, name: u.name || u.username, image: u.image || u.avatar })));

    // Check custombots collection
    const bots = await mongoose.connection.db.collection('custombots').find({}).toArray();
    console.log("CustomBots in DB count:", bots.length);
    if (bots.length > 0) {
      console.log("Sample bot token present:", !!bots[0].botToken);
    }

    await mongoose.disconnect();
  } catch (e) {
    console.error("DB Error:", e);
  }
}

checkDb();
