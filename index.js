import { createServer } from "node:http";
import "./app/helpers/env.load.js";
import expressApp from "./app/index.app.js";

const httpServer = createServer(expressApp);
const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {});
