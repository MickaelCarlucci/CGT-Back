import client from "../helpers/pg.client.js";

export async function linkCenterWithActivity(centerId, activityId) {
    const query = {
        text: 'INSERT INTO "centerHasActivity" (center_id, activity_id) VALUES ($1, $2) RETURNING center_id, activity_id',
        values: [centerId, activityId]
    }
    const result = await client.query(query);
    return result.rows[0];
}

export async function unlinkCenterFromActivity(centerId, activityId) {
    const query = {
        text: 'DELETE FROM "centerHasActivity" WHERE center_id=$1 and activity_id=$2 RETURNING center_id, activity,id',
        values: [centerId, activityId]
    }
    const result = await client.query(query);
    return result.rows[0];
}
//a revoir pour qu'elle donne toutes les activités par centre en l'état elle ne donne que le nombre de fois ou elle apparait
/*export async function findActivitiesBycenterId(centerId) {
    const query = {
        text: `SELECT activity* FROM "activity" 
               JOIN "center_has_activity" ON activity.id = center_has_activity.activity_id
               WHERE center_has_activity.activity_id = $1`,
        values: [centerId]
    };
    const result = await this.client.query(query);
    return result.rows;
}*/

export async function findCentersByActivityId(activityId) {
    const query = {
        text: `SELECT center.* FROM "center"
               JOIN "center_has_activity" ON center.id = center_has_activity.center_id
               WHERE center_has_activity.activity_id = $1`,
        values: [activityId]
    };
    const result = await this.client.query(query);
    return result.rows;
}

