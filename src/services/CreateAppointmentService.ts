import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentsRepository from '../repositories/AppointmentsRepository';

/**
 * [x] Recebe informações
 * [x] Trata erros e excessões
 * [x] Acessa respositório
 */

/** Cria interface para recebimento de dados */
interface Request {
  provider: string;
  date: Date;
}

/**
 * Dependency Inversion
 */

/** Classe para criação de appointment */
class CreateAppointmentService {
  /** Cria variável privada e define tipo */
  private appointmentsRepository: AppointmentsRepository;

  /** Define método de inicialização do service declarando parâmetro de entrada e tipo */
  constructor(appointmentsRepository: AppointmentsRepository) {
    /** Pega parâmetro de entrada e atribui valor à variável privada */
    this.appointmentsRepository = appointmentsRepository;
  }

  /** Único método da classe, público, e que neste caso cria um appointment */
  public execute({ provider, date }: Request): Appointment {
    /** Data do agendamento definida como início da hora */
    const appointmentDate = startOfHour(date);

    /**
     * Avalia se existe agendamento no mesmo horario enviado no corpo da
     * requisicao e retorna o primeiro appointment encontrado
     */
    const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    /** Se encontrou appointment, retorna erro */
    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
    }

    /** Adiciona agendamento à lista de agendamentos */
    const appointment = this.appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
