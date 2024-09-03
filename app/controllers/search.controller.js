import * as searchDatamapper from "../datamappers/search.datamapper.js"

export default {

getAllUsers: async (request, response) => {
    const users = await searchDatamapper.findUsersByRoles();
    if(!users) {
        return response.status(500).json({ error: "Une erreur est survenue pour afficher les utilisateurs."})
    }
    return response.status(200).send(users);
},

getUsersByCenter: async (request, response) => {
    const center = request.params.centerId;

    const users = await searchDatamapper.findUsersByCenter(center);
    if (!users) {
        return response.status(500).json({error: "Une erreur est survenue pour afficher les utilisateurs."})
    }

    return response.status(200).send(users);

},

getUsersByActivity: async (request, response) => {
    const {centerId, activityId} = request.params;

    const users = await searchDatamapper.findUsersByCenterByActivity(centerId, activityId);
    if(!users) {
    return response.status(500).json({error: "Une erreur est survenue pour afficher les utilisateurs."})
    }

    return response.status(200).send(users);
}

}