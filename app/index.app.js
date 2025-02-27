import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import router from "./routers/index.router.js";

const allowedOrigins = [
  "https://cgt-tp.fr", // Domaine du site Next.js
];

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Définit le chemin ABSOLU du dossier uploads
const uploadsPath = "/var/www/uploads";
console.log("📂 Nouveau chemin absolu des fichiers : ", uploadsPath);

import fs from "fs";
if (!fs.existsSync(uploadsPath)) {
  console.error("❌ ERREUR : Le dossier uploads n'existe pas !");
} else {
  console.log("✅ Le dossier uploads existe bien.");
}

app.use(
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
);

/*app.use(
  cors({
    origin: "*",
  })
);*/

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
  },
  express.static(uploadsPath)
);
app.use("/images", express.static(path.join(__dirname, "../images")));

app.use(router);

export default app;
