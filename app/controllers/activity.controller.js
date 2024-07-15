import ActivityDataMapper from "../datamappers/classActivity.datamapper.js";

export default {
    findAllActivities: async (_, response) => {
        const activities = await ActivityDataMapper.findAll();

        if (!activities){
            return response
            .status(500)
            .json({error: "Problème avec le serveur, veuillez réessayer plus tard"})
        }
        return response.status(200).send(activities)
    },

    findActivityById: async (request, response) => {
        const {activityId} = request.params;
        const oneActivity = await ActivityDataMapper.findById(activityId);

        if (!oneActivity) {
            return response
            .status(404)
            .json({error: "Ce activité n'est pas dans la liste"})
        }
        return response.status(200).send(oneActivity)
    },

    addNewActivity: async (request, response) => {
        const nameActivity = request.body.name;
        const checkActivity = await ActivityDataMapper.checkIfExistActivity(nameActivity);

        if (checkActivity[0]) {
            return response
            .status(401)
            .json({ error: "L'activité a déjà été crée"})
        }

        const activityAdded = await ActivityDataMapper.create(nameActivity);
        if (!activityAdded) {
            return response
            .status(500)
            .json({error: "Une erreur est survenue"})
        }
        return response.status(200).send(activityAdded)
    },

    deleteActivity: async (request, response) => {
        const {activityId} = request.params;
        const activity = await ActivityDataMapper.findById(activityId)

        if (!activity) {
            return response
            .status(404)
            .json({error: "L'activité n'a pas été trouvé"})
        }
        const deletedActivity = await ActivityDataMapper.delete(activityId);
        return response.status(200).send(deletedActivity);
    },

    modificationActivity: async (request, response) => {
        const {activityId} = request.params;
        const nameActivity = request.body.name;

        const activity = await ActivityDataMapper.findById(activityId);
        if (!activity) {
            return response
            .status(404)
            .json({error: "L'activité n'a pas été trouvé"})
        }

        const checkActivity = await ActivityDataMapper.checkIfExistActivity(nameActivity);
        if (checkActivity[0]) {
            return response
            .status(401)
            .json({ error: "L'activité a déjà été crée"})
        }
        
        const updatedActivity = await ActivityDataMapper.update(nameActivity, activityId)
        return response.status(200).send(updatedActivity);
    }

}