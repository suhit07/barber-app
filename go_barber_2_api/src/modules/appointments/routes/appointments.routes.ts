import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { Appointment } from '../schemas/AppointmentSchema';
import { User } from '../../users/schemas/UserSchema';

const appointmentsRouter = Router();

// Create appointment
appointmentsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().length(24).hex().required(),
      date: Joi.date().required(),
    },
  }),
  async (request, response) => {
    const { provider_id, date } = request.body;
    const user_id = request.user.id;

    const provider = await User.findById(provider_id);

    if (!provider) {
      return response.status(400).json({ error: 'Provider not found' });
    }

    const appointmentDate = new Date(date);

    if (appointmentDate.getHours() < 8 || appointmentDate.getHours() > 17) {
      return response.status(400).json({
        error: 'You can only create appointments between 8am and 5pm',
      });
    }

    const appointment = await Appointment.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    return response.json(appointment);
  },
);

// List appointments
appointmentsRouter.get('/', async (request, response) => {
  const user_id = request.user.id;

  const appointments = await Appointment.find({
    user_id,
  }).sort({ date: 1 });

  return response.json(appointments);
});

// Cancel appointment
appointmentsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const user_id = request.user.id;

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    return response.status(404).json({ error: 'Appointment not found' });
  }

  if (appointment.user_id !== user_id) {
    return response.status(401).json({
      error: "You don't have permission to cancel this appointment",
    });
  }

  const dateWithSub = new Date(appointment.date);
  dateWithSub.setHours(dateWithSub.getHours() - 2);

  if (dateWithSub < new Date()) {
    return response.status(400).json({
      error: 'You can only cancel appointments 2 hours in advance',
    });
  }

  appointment.canceled_at = new Date();
  await appointment.save();

  return response.json(appointment);
});

export default appointmentsRouter; 