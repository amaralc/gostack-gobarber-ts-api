import { Router } from 'express';
import { startOfHour, parseISO, isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

/**
 * Importa metodos de date-fns
 * parseIso: converte String para objeto Date nativo do JavaScript
 * startOfHour: pega data e coloque minuto, segundo, milisegundos como zero
 */

/** Cria roteador de agendamentos */
const appointmentsRouter = Router();

/** Cria lista de agendamentos do tipo Appointment */
const appointments: Appointment[] = [];

/** Escuta método get na rota raiz (/) e responde com objeto json */
appointmentsRouter.post('/', (request, response) => {
  /** Busca provider e date de dentro do corpo da requisicao */
  const { provider, date } = request.body;

  /** Ajusta formato da data */
  const parsedDate = startOfHour(parseISO(date));

  /**
   * Avalia se existe agendamento no mesmo horario enviado no corpo da
   * requisicao e retorna o primeiro appointment encontrado
   */
  const findAppointmentInSameDate = appointments.find(appointment =>
    isEqual(parsedDate, appointment.date),
  );

  /** Se encontrou appointment, retorna erro */
  if (findAppointmentInSameDate) {
    return response
      .status(400)
      .json({ message: 'This appointment is already booked' });
  }

  /** Cria novo appointment */
  const appointment = new Appointment(provider, parsedDate);

  /** Adiciona agendamento à lista de agendamentos */
  appointments.push(appointment);

  /** Adiciona appointment criado na lista de appointments */
  return response.json(appointment);
});

/** Exporta roteador de agendamentos */
export default appointmentsRouter;
