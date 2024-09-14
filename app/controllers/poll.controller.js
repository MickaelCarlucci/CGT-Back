import * as pollDatamapper from "../datamappers/poll.datamapper.js";
import client from "../helpers/pg.client.js"

export default {
    createPoll: async(request, response) => {
        const { question, options } = request.body;  // Récupère question et options depuis le front

        // Vérification basique
        if (!question || !options || options.length === 0) {
            return response.status(400).json({ error: 'La question et les options sont obligatoires' });
        }

        // Appel à la fonction du datamapper pour insérer les données
        const poll = await pollDatamapper.create(question, options);
        if (!poll) {
            return response.status(500).json({error: "Une erreur est survenue pendant l'enregistrement du sondage"})
        }

        return response.status(201).json(poll);
    },

    vote: async(request, response) => {
        const {userId, pollId} = request.params;
        const {optionId} = request.body;
        console.log('Params:', request.params);
console.log('Body:', request.body);

    try {
        await client.query('BEGIN')
            const existingVote = await pollDatamapper.checkVote(userId, pollId);
            if (existingVote) {
                await client.query('ROLLBACK');
                return response.status(400).json({error: "Vous avez déjà voté"});
            }

            const vote = await pollDatamapper.insertVote(pollId, userId);
            console.log(vote)
            if (!vote) {
                await client.query('ROLLBACK');
                return response.status(500).json({error: "Il y a eu un problème lors de l'enregistrement du vote unique"});
            }

            const voteRegistered = await pollDatamapper.updateVote(optionId);
            if (!voteRegistered) {
                await client.query('ROLLBACK');
                return response.status(500).json({error: "Il y a eu un problème lors de l'enregistrement"});
            }
            
            await client.query('COMMIT');
            return response.status(200).send(voteRegistered);

        } catch (error) {
            await client.query('ROLLBACK'); 
            console.error("Erreur lors du vote :", error); // Log pour déboguer
    return response.status(500).json({error: "Erreur lors du traitement du vote"});
        }

    },

    getPolls: async (request, response) => {
        const polls = await pollDatamapper.findAll();
        if (!polls) {
            return response.status(500).json({error: "Les sondages n'ont pas pu être trouvé"})
        }
        return response.status(200).send(polls);
    },

    getOnePoll: async (request, response) => {
        const id = request.params.pollId;
        const poll = await pollDatamapper.findOne(id);
        if(!poll) {
            return response.status(500).json({error: "Impossible d'accéder au sondage."});
        }
        return response.status(200).send(poll);
    }

}