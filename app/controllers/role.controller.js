import * as roleDatamapper from "../datamappers/role.datamapper.js"

export default {
    findRoles: async (_,response) => {
        const roles = await roleDatamapper.findAllRoles();

        if(!roles) {
            return response
            .status(500)
            .json({error: "Problème avec le serveur, veuillez réessayer plus tard"})
        }
        return response.status(200).send(roles)
    },

    findRoleById: async (request, response) => {
        const {roleId} = request.params;
        const oneRole = await roleDatamapper.findOneRole(roleId);
        if (!oneRole) {
            return response
            .status(500)
            .json({error: "Problème avec le serveur, veuillez réessayer plus tard"})
        }
        return response.status(200).send(oneRole)
    },

    linkUserWithRole: async (request, response) => {
        const {userId} = request.params;
        const {roleId} = request.body;

        const roleLinked = await roleDatamapper.linkUserWithRole(userId, roleId);
        if (!roleLinked) {
            return response
            .status(500)
            .json({error: "Problème avec le serveur, veuillez réessayer plus tard"})
        }
        return response.status(200).send(roleLinked)
    }
}