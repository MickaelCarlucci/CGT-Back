import express from "express";
import cors from "cors";
import { fileURLToPath } from 'url';
import path from "path";
import router from "./routers/index.router.js"

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
  origin: "*",
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(router);

export default app;