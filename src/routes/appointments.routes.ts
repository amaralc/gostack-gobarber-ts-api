import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
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

/** Escuta método get na rota raiz e retorna todos os agendamentos */
appointmentsRouter.get('/', async (request, response) => {
  /** Cria appointments repository */
  const appointmentsRepository = getCustomRepository(AppointmentsRepository);

  /** Cria variável para armazenar todos os agendamentos */
  const appointments = await appointmentsRepository.find();

  /** Retorna agendamentos */
  return response.json(appointments);
});

/** Escuta método post na rota raiz (/) e responde com objeto json */
appointmentsRouter.post('/', async (request, response) => {
  try {
    /** Busca provider_id e date de dentro do corpo da requisicao */
    const { provider_id, date } = request.body;

    /** Ajusta formato da data */
    const parsedDate = parseISO(date);

    /** Instancia serviço */
    const createAppointment = new CreateAppointmentService();

    /** Executa serviço (cria appointment) */
    const appointment = await createAppointment.execute({
      date: parsedDate,
      provider_id,
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
