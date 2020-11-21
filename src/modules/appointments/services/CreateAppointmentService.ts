import { startOfHour } from 'date-fns';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

/**
 * [x] Recebe informações
 * [x] Trata erros e excessões
 * [x] Acessa respositório
 */

/** Cria interface para recebimento de dados */
interface IRequest {
  provider_id: string;
  date: Date;
}

/**
 * Dependency Inversion
 */

/** Classe para criação de appointment */
class CreateAppointmentService {
  /**
   * Define variavel private com tipo definido.
   * Essa sintaxe é uma alternativa para não precisar declarar uma variável private e
   * depois inicializá-la com this.variavel no constructor
   */
  constructor(private appointmentsRepository: IAppointmentsRepository) {}

  /** Único método da classe, público, e que neste caso cria um appointment */
  public async execute({ provider_id, date }: IRequest): Promise<Appointment> {
    /** Data do agendamento definida como início da hora */
    const appointmentDate = startOfHour(date);

    /**
     * Avalia se existe agendamento no mesmo horario enviado no corpo da
     * requisicao e retorna o primeiro appointment encontrado
     */
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    /** Se encontrou appointment, retorna erro */
    if (findAppointmentInSameDate) {
      /** Retorna erro status 400 */
      throw new AppError('This appointment is already booked');
    }

    /** Cria instância da classe de appointment */
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
