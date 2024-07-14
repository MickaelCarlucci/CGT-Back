import CenterDataMapper from "../datamappers/classCenter.datamapper.js";
import * as centerHasActivityDataMapper from "../datamappers/centerHasActivity.datamapper.js";

export default {
    findAllCenters: async (request, response) => {
        const centers = await CenterDataMapper.findAll();

        if (!centers){
            return response
            .status(500)
            .json({error: "Problème avec le serveur, veuillez réessayer plus tard"})
        }
        return response.status(200).send(centers)
    }


}