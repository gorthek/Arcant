"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("@arcant/database");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({ message: 'API is running successfully on Render!' });
});
const bot_routes_1 = __importDefault(require("./routes/bot.routes"));
const server_routes_1 = __importDefault(require("./routes/server.routes"));
const template_routes_1 = __importDefault(require("./routes/template.routes"));
const owner_routes_1 = __importDefault(require("./routes/owner.routes"));
app.use('/api/bots', bot_routes_1.default);
app.use('/api/server', server_routes_1.default);
app.use('/api/templates', template_routes_1.default);
app.use('/api/owner', owner_routes_1.default);
(0, database_1.dbConnect)().then(() => {
    app.listen(port, () => {
        console.log(`[API] Server is listening on port ${port}`);
    });
}).catch(console.error);
//# sourceMappingURL=index.js.map