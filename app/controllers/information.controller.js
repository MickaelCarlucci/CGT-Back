import * as infoDatamapper from "../datamappers/information.datamapper.js";
import sanitizeHtml from "sanitize-html";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  newInformation: async (request, response) => {
    const { userId } = request.params;
    const { title, contain, sectionId } = request.body;
    const imageUrl = request.file ? `/images/${request.file.filename}` : null;

    const sanitizedTitle = sanitizeHtml(title, {
      allowedTags: [],
      allowedAttributes: {},
    });

    const sanitizedContain = sanitizeHtml(contain, {
      allowedTags: [
        "b",
        "i",
        "strong",
        "em",
        "u",
        "a",
        "p",
        "h1",
        "h2",
        "h3",
        "ul",
        "li",
        "ol",
        "span",
      ],
      allowedAttributes: {
        a: ["href", "target"],
        span: ["style"],
      },
      allowedStyles: {
        "*": {
          color: [
            /^#(0x)?[0-9a-f]+$/i,
            /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/i,
            /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*(0|1|0?\.\d+)\)$/i,
            /^hsl\(\d+,\s*[\d.]+%,\s*[\d.]+%\)$/i,
          ],
        },
      },
    });

    const information = await infoDatamapper.create(
      sanitizedTitle,
      sanitizedContain,
      imageUrl,
      userId,
      sectionId
    );
    if (!information) {
      return response
        .status(500)
        .json({ error: "La nouvelle news n'a pas pu être enregistré" });
    }
    return response.status(200).send(information);
  },

  getOneNews: async (request, response) => {
    const { newsId } = request.params;

    const news = await infoDatamapper.findById(newsId);
    if (!news) {
      return response
        .status(500)
        .json({ error: "Impossible de récupérer la news" });
    }
    return response.status(200).send(news);
  },

  updateTitleNews: async (request, response) => {
    const { newsId } = request.params;
    const { newTitle } = request.body;

    const updatedTitle = await infoDatamapper.updateTitle(newTitle, newsId);
    if (!updatedTitle) {
      return response.status(500).json({
        error: "Une erreur s'est produite pendant la modification du titre",
      });
    }
    return response.status(200).send(updatedTitle);
  },

  updateContainNews: async (request, response) => {
    const { newsId } = request.params;
    const { newContain } = request.body;

    const updatedContain = await infoDatamapper.updateContain(
      newContain,
      newsId
    );
    if (!updatedContain) {
      return response.status(500).json({
        error: "Une erreur s'est produite pendant la modification du contenu",
      });
    }
    return response.status(200).send(updatedContain);
  },

  recentInformation: async (__, response) => {
    const information = await infoDatamapper.lastNews();
    if (!information) {
      return response
        .status(500)
        .json({ error: "Les trois dernières n'ont pas pu être trouvé" });
    }
    return response.status(200).send(information);
  },

  LastNews: async (request, response) => {
    const information = await infoDatamapper.TenLastNews();
    if (!information) {
      return response
        .status(500)
        .json({ error: "les news n'ont pas pu être trouvé" });
    }
    return response.status(200).send(information);
  },

  LastDidYouKnow: async (request, response) => {
    const information = await infoDatamapper.TenLastDidYouKnow();
    if (!information) {
      return response
        .status(500)
        .json({ error: "les 'le saviez-vous' n'ont pas pu être trouvé" });
    }
    return response.status(200).send(information);
  },

  deleteInformation: async (request, response) => {
    try {
      const { newsId } = request.params;

      const information = await infoDatamapper.findById(newsId);
      if (!information) {
        return response.status(404).json({ error: "News introuvable" });
      }

      if (information.image_url) {
        const imagePath = path.join(
          __dirname,
          "..",
          "..",
          information.image_url
        );

        try {
          await fs.unlink(imagePath);
        } catch (error) {
          console.error("❌ Erreur lors de la suppression de l'image :", error);
        }
      }

      const deletedInformation = await infoDatamapper.DeleteNews(newsId);

      return response.status(200).send(deletedInformation);
    } catch (error) {
      console.error("🔥 Erreur interne dans deleteInformation :", error);
      return response.status(500).json({ error: "Erreur interne du serveur" });
    }
  },
};
