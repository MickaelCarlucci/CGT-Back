import * as pdfDatamapper from "../datamappers/pdf.datamapper.js";
import path from "path";
import fs from "fs/promises";

export default {
  upload: async (request, response) => {
    const center_id = request.body.center_id;
    const section_id = request.body.section_id;

    if (!request.file) {
      return response.status(400).json({ error: "aucun fichier téléchargé" });
    }
    let title = request.file.originalname;
    if (!Buffer.from(title, "utf8").toString("utf8") === title) {
      console.warn("⚠️ Titre mal encodé, tentative de correction...");
      title = Buffer.from(title, "latin1").toString("utf8");
    }

    title = title.normalize("NFC").replace(/[^\w\s\-.]/gi, "");

    const pdf_url = `/uploads/${request.file.filename}`;

    const uploadedFilePath = path.join(
      "/var/www/uploads",
      request.file.filename
    );
    try {
      await fs.chmod(uploadedFilePath, 0o755);
    } catch (error) {
      console.error(
        "❌ Erreur lors de la modification des permissions :",
        error
      );
    }

    const newPdf = await pdfDatamapper.create(
      title,
      pdf_url,
      section_id,
      center_id
    );
    if (!newPdf) {
      return response.status(500).json({
        error: "Le fichier n'a pas pu être ajouté à la base de données",
      });
    }

    return response
      .status(201)
      .json({ message: "Fichier téléchargé avec succès", fichier: newPdf });
  },

  download: async (request, response) => {
    const { filename } = request.params;
    const filePath = path.join("/var/www/uploads", filename);

    response.download(filePath, (error) => {
      if (error) {
        response
          .status(500)
          .json({ error: "Erreur lors du téléchargement du fichier" });
      }
    });
  },

  deletePdf: async (request, response) => {
    try {
      const { fileId } = request.params;
      const pdf = await pdfDatamapper.findById(fileId);

      if (!pdf) {
        return response
          .status(404)
          .json({ error: "Le fichier n'a pas été trouvé." });
      }

      const filePath = path.join(
        "/var/www/uploads",
        pdf.pdf_url.split("/").pop()
      );

      await fs.unlink(filePath);

      await pdfDatamapper.deleteFile(fileId);

      return response
        .status(200)
        .json({ message: "Fichier supprimé avec succès" });
    } catch (err) {
      console.error(err);
      return response
        .status(500)
        .json({ error: "Erreur lors de la suppression du fichier" });
    }
  },

  getAll: async (request, response) => {
    const pdfs = await pdfDatamapper.findAll();
    if (!pdfs) {
      return response.status(500).json({
        error: "Une erreur est survenue lors de la récupération des fichiers.",
      });
    }
    return response.status(200).send(pdfs);
  },

  getLastTract: async (request, response) => {
    const pdf = await pdfDatamapper.findLastTract();
    if (!pdf) {
      return response.status(500).json({
        error: "Une erreur est survenue lors de la récupération du fichier.",
      });
    }
    return response.status(200).send(pdf);
  },

  getDocumentsBySection: async (request, response) => {
    const sectionId = request.params.sectionId;
    const documents = await pdfDatamapper.findAllPdfBySection(sectionId);
    if (!documents) {
      return response.status(500).json({
        error: "Une erreur est survenue lors du chargement des documents",
      });
    }
    return response.status(200).send(documents);
  },
};
