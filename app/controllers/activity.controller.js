import ActivityDataMapper from "../datamappers/classActivity.datamapper.js";
import * as CenterHasActivityDataMapper from "../datamappers/centerHasActivity.datamapper.js";
import client from "../helpers/pg.client.js";

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
        const { name, centerId } = request.body;

        await client.query('BEGIN');
        const checkActivity = await ActivityDataMapper.checkIfExistActivity(name);
        if (checkActivity[0]) {
            return response
                .status(401)
                .json({ error: "L'activité a déjà été créée" });
        }

        const activityAdded = await ActivityDataMapper.create(name);
        if (!activityAdded) {
            return response
                .status(500)
                .json({ error: "Une erreur est survenue lors de la création de l'activité" });
        }

        let activityId = await ActivityDataMapper.findActivityByName(name);

        if (!activityId) {
            await client.query('ROLLBACK');
            return response
                .status(404)
                .json({ error: "L'id de l'activité nouvellement créée est indéfini" });
        }
         activityId = activityId.id

        // Lier l'activité au centre sélectionné
        const linkActivityToCenter = await CenterHasActivityDataMapper.linkCenterWithActivity(centerId, activityId);
        if (!linkActivityToCenter) {
            return response
                .status(500)
                .json({ error: "Une erreur est survenue lors de la liaison de l'activité au centre" });
        }
        return response.status(200).send({ activity: activityAdded, link: linkActivityToCenter });
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
    },

    linkActivityWithNewCenter: async (request, response) => {
       const {centerId, activityId} = request.body;
       const activityLinked = await CenterHasActivityDataMapper.linkCenterWithActivity(centerId, activityId);

       if (!activityLinked) {
        return response
        .status(500)
        .json({error: "Une erreur est survenue lors de la liaison de l'activité au centre"})
       }
       return response.status(200).send(activityLinked);
    },

    findCenterByActivity: async (request, response) => {
        const {activityId} = request.params;
        const verifyActivity = await ActivityDataMapper.findById(activityId)
        if (!verifyActivity) {
            return response
            .status(500)
            .json({error: "L'activité n'a pas été trouvé"})
        }

        const listCenterByActivity = await CenterHasActivityDataMapper.findCentersByActivityId(activityId)
        if (!listCenterByActivity) {
            return response
            .status(500)
            .json({error: "Une erreur est survenue"})
        }
        return response.status(200).send(listCenterByActivity)
    }
}