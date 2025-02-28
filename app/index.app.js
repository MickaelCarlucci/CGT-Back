import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import router from "./routers/index.router.js";

const allowedOrigins = [
  "https://cgt-tp.fr",
  "https://app-cgt-teleperformance.firebaseapp.com",
  "https://app-cgt-teleperformance.web.app",
];

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsPath = "/var/www/uploads";

import fs from "fs";
if (!fs.existsSync(uploadsPath)) {
  console.error("❌ ERREUR : Le dossier uploads n'existe pas !");
}

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Non autorisé par les règles CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Autorise les cookies et l'auth Firebase
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://app-cgt-teleperformance.firebaseapp.com, https://app-cgt-teleperformance.web.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Si Firebase Auth utilise des cookies
  next();
});

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
