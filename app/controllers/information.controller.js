import * as infoDatamapper from "../datamappers/information.datamapper.js";

export default {
    newInformation: async (request, response) => {
        const {userId} = request.params;
        const {title, contain, image_url, sectionId} = request.body;

        const information = await infoDatamapper.create(title, contain, image_url, userId, sectionId);
        if (!information) {
            return response.status(500).json({error: "La nouvelle news n'a pas pu être enregistré"})
        }
        return response.status(200).send(information);
    },

    LastInformations: async (request, response) => {
        const information = await infoDatamapper.TenLastNews();
        if (!information) {
            return response.status(500).json({error: "les news n'ont pas pu être trouvé"})
        }
        return response.status(200).send(information);
    }

}