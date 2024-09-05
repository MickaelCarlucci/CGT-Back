import * as sectionDatamapper from "../datamappers/section.datamapper.js"

export default {
    getAllSection: async (request, response) => {
        const sections = await sectionDatamapper.findAll();
        if (!sections) {
            return response.status(500).json({error: "Impossible de charger la listes des sections"});
        }
        return response.status(200).send(sections);
    } 
}