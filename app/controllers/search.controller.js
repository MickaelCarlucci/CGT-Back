import * as searchDatamapper from "../datamappers/search.datamapper.js"

export default {

getAllUsers: async (request, response) => {
    const users = await searchDatamapper.findUsersByRoles();
    if(!users) {
        return response.status(500).json({ error: "Une erreur est survenue pour afficher les utilisateurs"})
    }
    return response.status(200).send(users);
}

}