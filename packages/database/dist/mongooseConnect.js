"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = dbConnect;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGO_URL || process.env.STORAGE_URL || process.env.MONGO_MONGODB_URI;
// Global cache to prevent multiple connections in Next.js development
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!MONGODB_URI) {
        throw new Error('Veuillez définir la variable d\'environnement MONGO_URI, MONGODB_URI ou STORAGE_URL.');
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose_1.default.connect(MONGODB_URI, opts).then((mongoose) => {
            console.log("[MongoDB] Connected successfully.");
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    }
    catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
