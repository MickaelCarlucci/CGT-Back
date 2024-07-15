import CenterDataMapper from "../datamappers/classCenter.datamapper.js";

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
            .json({ error: "Le centre a déjà été crée"})
        }

        const centerAdded = await CenterDataMapper.create(nameCenter);
        if (!centerAdded) {
            return response
            .status(500)
            .json({error: "Une erreur est survenue"})
        }
        return response.status(200).send(centerAdded)
    },

    deleteCenter: async (request, response) => {
        const {centerId} = request.params;
        const center = await CenterDataMapper.findById(centerId)

        if (!center) {
            return response
            .status(404)
            .json({error: "Le centre n'a pas été trouvé"})
        }
        const deletedCenter = await CenterDataMapper.delete(centerId);
        return response.status(200).send(deletedCenter);
    },

    modificationCenter: async (request, response) => {
        const {centerId} = request.params;
        const nameCenter = request.body.name;

        const center = await CenterDataMapper.findById(centerId);
        if (!center) {
            return response
            .status(404)
            .json({error: "Le centre n'a pas été trouvé"})
        }

        const checkCenter = await CenterDataMapper.checkIfExistCenter(nameCenter);

        if (checkCenter[0]) {
            return response
            .status(401)
            .json({ error: "Le centre a déjà été crée"})
        }

        const updatedCenter = await CenterDataMapper.update(nameCenter, centerId)
        return response.status(200).send(updatedCenter);
    }

}