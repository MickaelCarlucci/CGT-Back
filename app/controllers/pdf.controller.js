import * as pdfDatamapper from "../datamappers/pdf.datamapper.js";
import path from "path";
import { fileURLToPath } from "url";

export default {

    upload: async (request, response) => {
        const center_id = request.body.center_id;
        const section_id = request.body.section_id;

        console.log('section_id:', request.body.section_id);
        console.log('center_id:', request.body.center_id);
        console.log('File:', request.file);

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
        console.log("Demande de téléchargement pour le fichier:", filename);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const filePath = path.join(__dirname, '../../uploads', filename);

        console.log("Chemin complet du fichier:", filePath);
        
        response.download(filePath, error => {
            if (error) {
                response.status(500).json({error: "Erreur lors du téléchargement du fichier"})
            }
        });

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

