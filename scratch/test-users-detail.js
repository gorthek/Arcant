const mongoose = require('mongoose');

async function checkUsers() {
  try {
    const mongoUri = "mongodb+srv://Vercel-Admin-Arcantdb:2nIy4yEvti2ov6K1@arcantdb.fvubsbt.mongodb.net/?retryWrites=true&w=majority";
    await mongoose.connect(mongoUri);

    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log("Full User documents:", JSON.stringify(users, null, 2));

    await mongoose.disconnect();
  } catch (e) {
    console.error("DB Error:", e);
  }
}

checkUsers();
