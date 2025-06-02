import { Request, Response } from 'express';
import { classToClass } from 'class-transformer';

import makeCreateAppointmentService from '@modules/appointments/services/factories/makeCreateAppointmentService';
import makeListUserAppointmentsService from '@modules/appointments/services/factories/makeListUserAppointmentsService';

export default class AppointmentsController {
  async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;
    const user_id = request.user.id;

    const createAppointmentService = makeCreateAppointmentService();

    const appointment = await createAppointmentService.execute({
      provider_id,
      user_id,
      date,
    });

    return response.json(appointment);
  }

  async index(request: Request, response: Response): Promise<Response> {
    const { user_id } = request;

    const listUserAppointmentsService = makeListUserAppointmentsService();

    const appointments = await listUserAppointmentsService.execute({
      user_id,
    });

    return response.send(classToClass(appointments));
  }
}
