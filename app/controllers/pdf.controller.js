import * as pdfDatamapper from "../datamappers/pdf.datamapper.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

export default {

    upload: async (request, response) => {
        const center_id = request.body.center_id;
        const section_id = request.body.section_id;

        if (!request.file) {
            return response.status(400).json({error: "aucun fichier téléchargé"})
        }
        const title = request.file.originalname;
        //construit automatiquement l'url pour la bdd
        const pdf_url = `/uploads/${request.file.filename}`;


        

        const newPdf = await pdfDatamapper.create(
            title,
            pdf_url,
            section_id,
            center_id
        )
        if (!newPdf) {
            return response.status(500).json({error: "Le fichier n'a pas pu être uploadé dans la base de donnée"})
        }
        return response.status(201).json({message: "Fichier téléchargé avec succès", fichier: newPdf})        
    },

    download: async (request, response) => {
        const {filename} = request.params;
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.join(__dirname, '../../uploads', filename);

        
        response.download(filePath, error => {
            if (error) {
                response.status(500).json({error: "Erreur lors du téléchargement du fichier"})
            }
        });

    },

    deletePdf: async (request, response) => {
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        try {
            const { fileId } = request.params;
            const pdf = await pdfDatamapper.findById(fileId);
    
            if (!pdf) {
                return response.status(404).json({ error: "Le fichier n'a pas été trouvé." });
            }
    
            const filePath = pdf.pdf_url;
    
            // Supprimer le fichier
            await fs.unlink(path.join(__dirname, '..', '..', filePath));
    
            // Supprimer l'entrée dans la base de données
            await pdfDatamapper.deleteFile(fileId);
    
            // Envoyer la réponse après avoir terminé toutes les actions
            return response.status(200).json({ message: "Fichier supprimé avec succès" });
        } catch (err) {
            // Gérer les erreurs et envoyer une réponse appropriée
            console.error(err);
            return response.status(500).json({ error: "Erreur lors de la suppression du fichier" });
        }
    },

    getAll: async (request, response) => {
        const pdfs = await pdfDatamapper.findAll();
        if(!pdfs) {
            return response.status(500).json({error: "Une erreur est survenue lors de la récupération des fichiers."})
        }
        return response.status(200).send(pdfs);
    },

    getLastTract: async (request, response) => {
        const pdf = await pdfDatamapper.findLastTract();
        if(!pdf) {
            return response.status(500).json({error: "Une erreur est survenue lors de la récupération du fichier."})
        }
        return response.status(200).send(pdf)
    },

    getDocumentsBySection: async(request, response) => {
        const sectionId = request.params.sectionId;
        const documents = await pdfDatamapper.findAllPdfBySection(sectionId);
        if (!documents) {
            return response.status(500).json({error: "Une erreur est survenue lors du chargement des documents"})
        }
        return response.status(200).send(documents)
    },
}

