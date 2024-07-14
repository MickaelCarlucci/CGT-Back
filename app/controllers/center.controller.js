import CenterDataMapper from "../datamappers/classCenter.datamapper.js";
import * as centerHasActivityDataMapper from "../datamappers/centerHasActivity.datamapper.js";

export default {
    findAllCenters: async (_, response) => {
        const centers = await CenterDataMapper.findAll();

        if (!centers){
            return response
            .status(500)
            .json({error: "Problème avec le serveur, veuillez réessayer plus tard"})
        }
        return response.status(200).send(centers)
    },

    findCenterById: async (request, response) => {
        const {centerId} = request.params;
        const oneCenter = await CenterDataMapper.findById(centerId);

        if (!oneCenter) {
            return response
            .status(404)
            .json({error: "Ce centre n'est pas dans la liste"})
        }
        return response.status(200).send(oneCenter)
    },

    addNewCenter: async (request, response) => {
        const nameCenter = request.body.name;
        const checkCenter = await CenterDataMapper.checkIfExistCenter(nameCenter);

        if (checkCenter[0]) {
            return response
            .status(401)
            .json({ error: "Le centre existe déjà"})
        }

        const centeradded = await CenterDataMapper.create(nameCenter);
        if (!centeradded) {
            return response
            .status(500)
            .json({error: "Une erreur est survenue"})
        }
        return response.status(200).send(centeradded)
    }

}