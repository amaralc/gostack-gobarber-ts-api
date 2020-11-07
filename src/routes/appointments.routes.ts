import { Router } from 'express';
/**
 * Importa metodos de date-fns
 * parseIso: converte String para objeto Date nativo do JavaScript
 * startOfHour: pega data e coloque minuto, segundo, milisegundos como zero
 */
import { parseISO } from 'date-fns';
import AppointmentsRepository from '../repositories/AppointmentsRepository';
import CreateAppointmentService from '../services/CreateAppointmentService';

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
  try {
    /** Busca provider e date de dentro do corpo da requisicao */
    const { provider, date } = request.body;

    /** Ajusta formato da data */
    const parsedDate = parseISO(date);

    /** Instancia serviço */
    const createAppointment = new CreateAppointmentService(
      appointmentsRepository,
    );

    /** Executa serviço (cria appointment) */
    const appointment = createAppointment.execute({
      date: parsedDate,
      provider,
    });

    /** Devolve resposta à requisição */
    return response.json(appointment);

    /** Caso o serviço retorne erro */
  } catch (error) {
    /**
     * Retorna mensagem de erro definida no serviço */
    return response.status(400).json({ error: error.message });
  }
});

/** Exporta roteador de agendamentos */
export default appointmentsRouter;
