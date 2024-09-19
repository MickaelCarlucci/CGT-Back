import * as infoDatamapper from "../datamappers/information.datamapper.js";

export default {
    newInformation: async (request, response) => {
        const {userId} = request.params;
        const {title, contain, sectionId} = request.body;
        const imageUrl = request.file ? `/images/${request.file.filename}` : null;

        const information = await infoDatamapper.create(title, contain, imageUrl, userId, sectionId);
        if (!information) {
            return response.status(500).json({error: "La nouvelle news n'a pas pu être enregistré"})
        }
        return response.status(200).send(information);
    },

    recentInformation: async (__, response) => {
        const information = await infoDatamapper.lastNews();
        if(!information) {
            return response.status(500).json({error: "La dernière n'a pas pu être trouvé"})
        }
        return response.status(200).send(information);
    },

    LastInformations: async (request, response) => {
        const information = await infoDatamapper.TenLastNews();
        if (!information) {
            return response.status(500).json({error: "les news n'ont pas pu être trouvé"})
        }
        return response.status(200).send(information);
    },

    deleteInformation: async (request, response) => {
        const {newsId} = request.params;
        const deletedInformation = await infoDatamapper.DeleteNews(newsId);
        return response.status(200).send(deletedInformation);
    }

}