import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import router from "./routers/index.router.js";

const allowedOrigins = [
  "https://cgt-teleperformance.fr", // Domaine du site Next.js
  "http://localhost:3000", // URL utilisée par React Native en développement
  "http://localhost:8081", // URL react Native
];

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/images", express.static(path.join(__dirname, "../images")));

app.use(router);

export default app;
