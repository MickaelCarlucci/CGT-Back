import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import router from "./routers/index.router.js";

const allowedOrigins = [
  "https://cgt-teleperformance.fr", // Domaine du site Next.js
  "http://localhost:3000", // URL utilisée par React Native en développement
  "http://localhost:8081", // URL react Native
];

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, "../uploads");
console.log("📂 Chemin absolu utilisé pour /uploads :", uploadPath);

/*app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Autoriser cette origine
      } else {
        callback(new Error("Non autorisé par les règles CORS")); // Bloquer cette origine
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // Méthodes HTTP autorisées
    credentials: true, // Autoriser les cookies ou les credentials
  })
);*/

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(
  "/uploads",
  (req, res, next) => {
    const filePath = path.join("/root/CGT-Back/uploads", req.path);
    console.log("🔍 Tentative d'accès au fichier :", filePath);
    if (!fs.existsSync(filePath)) {
      console.error("⚠️ Fichier introuvable :", filePath);
    }
    next();
  },
  express.static("/root/CGT-Back/uploads")
);
app.use("/images", express.static(path.join(__dirname, "../images")));

app.use(router);

export default app;
