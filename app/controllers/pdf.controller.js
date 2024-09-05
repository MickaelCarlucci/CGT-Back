import * as pdfDatamapper from "../datamappers/pdf.datamapper.js";

export default {

    upload: async (request, response) => {
        const center_id = request.body.centerId;
        const section_id = request.body.sectionId;

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
        const {userId} = request.params;
        console.log(userId);
        const pdf = await pdfDatamapper.findById(userId)
        if (!pdf) {
            return response.status(500).json({error: "Une erreur est survenue lors de la récupération du fichier."})
        }
        return response.status(200).send(pdf);
    },

    getAll: async (request, response) => {
        const pdfs = await pdfDatamapper.findAll();
        if(!pdfs) {
            return response.status(500).json({error: "Une erreur est survenue lors de la récupération des fichiers."})
        }
        return response.status(200).send(pdfs)
    }
}

