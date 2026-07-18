"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionManager = exports.Session = void 0;
class Session {
    id;
    history = [];
    currentBlueprint = null;
    lastVector = null;
    constructor(id) {
        this.id = id;
    }
    addMessage(role, content) {
        this.history.push({ role, content });
    }
    getContextVector() {
        // A simplified way to merge context over time. 
        // In a real NLP AGI, we'd do attention mechanism.
        return this.lastVector || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
}
exports.Session = Session;
class SessionManager {
    static sessions = new Map();
    static getSession(userId) {
        if (!this.sessions.has(userId)) {
            this.sessions.set(userId, new Session(userId));
        }
        return this.sessions.get(userId);
    }
    static clearSession(userId) {
        this.sessions.delete(userId);
    }
}
exports.SessionManager = SessionManager;
