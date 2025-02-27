import * as appointmentDatamapper from "../datamappers/appointment.datamapper.js";
import sanitizeHtml from "sanitize-html";

export default {
  getAppointment: async (_, response) => {
    const appointment = await appointmentDatamapper.find();
    if (!appointment) {
      return response
        .status(500)
        .json({ error: "Le rendez-vous n'a pas pu être récupéré" });
    }
    return response.status(200).send(appointment);
  },

  updateAppointment: async (request, response) => {
    const subject = sanitizeHtml(request.body.subject);
    const date = sanitizeHtml(request.body.date);
    const linkMeeting = sanitizeHtml(request.body.linkMeeting);

    const appointmentUpdated = await appointmentDatamapper.update(
      subject,
      date,
      linkMeeting
    );
    if (!appointmentUpdated) {
      return response
        .status(500)
        .json({ error: "Impossible de modifier le rendez-vous" });
    }
    return response.status(200).send(appointmentUpdated);
  },
};
