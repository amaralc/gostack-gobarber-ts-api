import { Router } from 'express';
/**
 * Importa metodos de date-fns
 * parseIso: converte String para objeto Date nativo do JavaScript
 * startOfHour: pega data e coloque minuto, segundo, milisegundos como zero
 */
import { startOfHour, parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

/** Cria roteador de agendamentos */
const appointmentsRouter = Router();

/** Instancia lista de agendamentos do tipo Appointment */
const appointmentsRepository = new AppointmentsRepository();

/** Escuta método get na rota raiz e retorna todos os agendamentos */
appointmentsRouter.get('/', (request, response) => {
  /** Cria variável para armazenar agendamentos */
  const appointments = appointmentsRepository.all();

  /** Retorna agendamentos */
  return response.json(appointments);
});

/** Escuta método post na rota raiz (/) e responde com objeto json */
appointmentsRouter.post('/', (request, response) => {
  /** Busca provider e date de dentro do corpo da requisicao */
  const { provider, date } = request.body;

  /** Ajusta formato da data */
  const parsedDate = startOfHour(parseISO(date));

  /**
   * Avalia se existe agendamento no mesmo horario enviado no corpo da
   * requisicao e retorna o primeiro appointment encontrado
   */
  const findAppointmentInSameDate = appointmentsRepository.findByDate(
    parsedDate,
  );

  /** Se encontrou appointment, retorna erro */
  if (findAppointmentInSameDate) {
    return response
      .status(400)
      .json({ message: 'This appointment is already booked' });
  }

  /** Adiciona agendamento à lista de agendamentos */
  const appointment = appointmentsRepository.create({
    provider,
    date: parsedDate,
  });

  /** Adiciona appointment criado na lista de appointments */
  return response.json(appointment);
});

/** Exporta roteador de agendamentos */
export default appointmentsRouter;
