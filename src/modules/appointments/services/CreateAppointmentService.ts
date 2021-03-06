import { startOfHour, isBefore, getHours, format } from 'date-fns';

import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

/**
 * [x] Recebe informações
 * [x] Trata erros e excessões
 * [x] Acessa respositório
 */

/** Cria interface para recebimento de dados */
interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

/**
 * Dependency Inversion
 */

/** Classe para criação de appointment e identifica que é injetável (receberá injeção de dependência) */
@injectable()
class CreateAppointmentService {
  /**
   * Define variavel private com tipo definido.
   * Essa sintaxe é uma alternativa para não precisar declarar uma variável private e
   * depois inicializá-la com this.variavel no constructor
   */
  constructor(
    /** Injeta dependencias */
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,

    @inject('NotificationsRepository')
    private notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  /** Único método da classe, público, e que neste caso cria um appointment */
  public async execute({
    provider_id,
    user_id,
    date,
  }: IRequest): Promise<Appointment> {
    /** Data do agendamento definida como início da hora */
    const appointmentDate = startOfHour(date);

    /** Avalia se user_id e provider_id sao iguais, e se forem retorna erro */
    if (user_id === provider_id) {
      throw new AppError("You can't create an appointment with yourself");
    }

    /** Se agendamento for antes das 8am ou depois das 5pm, retorna erro */
    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError(
        'You can only create appointments between 8am and 5pm',
      );
    }

    /**
     * Avalia se existe agendamento no mesmo horario enviado no corpo da
     * requisicao e retorna o primeiro appointment encontrado
     */
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id,
    );

    /** Se encontrou appointment, retorna erro */
    if (findAppointmentInSameDate) {
      /** Retorna erro status 400 */
      throw new AppError('This appointment is already booked');
    }

    /** Avalia se data ja passou */
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError("You can't create an appointment on a past date.");
    }

    /** Cria instância da classe de appointment */
    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    /** Formata data do agendamento */
    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm'h'");

    /** Cria notificacao de agendamento */
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `Novo agendamento para ${dateFormatted}`,
    });

    /** Invalida agendamentos */
    await this.cacheProvider.invalidate(
      `provider-appointments:${provider_id}:${format(
        appointmentDate,
        'yyyy-M-d',
      )}`,
    );

    return appointment;
  }
}

export default CreateAppointmentService;
