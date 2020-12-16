import { getRepository, Repository, Raw } from 'typeorm';

/** Importa interface */
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';

/** Cria classe implementando interface que permite troca de dependencias */
class AppointmentsRepository implements IAppointmentsRepository {
  /** Define variável e tipagem */
  private ormRepository: Repository<Appointment>;

  constructor() {
    /** Define ormRepository como repositório de Appointment */
    this.ormRepository = getRepository(Appointment);
  }

  /**
   * Método público para encontrar appointment a partir de uma data.
   * Método pode retornar tipo Appointment OU null
   */
  public async findByDate(
    date: Date,
    provider_id: string,
  ): Promise<Appointment | undefined> {
    /** Encontra appointment em lista de appointments */
    // const findAppointment = this.appointments.find(appointment =>
    //   isEqual(date, appointment.date),
    // );

    /** Chama método assincrono para encontrar um appointment */
    const findAppointment = await this.ormRepository.findOne({
      /** Onde a coluna 'date' é igual ao parâmetro 'date' */
      where: { date, provider_id },
    });

    /** Retorna appointment encontrado e se não encontrar, retorna nulo */
    return findAppointment || undefined;
  }

  /** Método para criar appointment */
  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    /** Cria novo instância */
    const appointment = this.ormRepository.create({
      provider_id,
      user_id,
      date,
    });

    /** Salva instância no banco de dados */
    await this.ormRepository.save(appointment);

    /** Retorna instância criada */
    return appointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    /** Avalia se string tem menos de dois digitos e completa com zero a esquerda */
    const parsedMonth = String(month).padStart(2, '0');

    /** Filtra lista */
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
        ),
      },
    });

    /** Retorna lista */
    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    year,
    month,
    day,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    /** Avalia se string tem menos de dois digitos e completa com zero a esquerda */
    const parsedMonth = String(month).padStart(2, '0');
    const parsedDay = String(day).padStart(2, '0');

    /** Filtra lista */
    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
        ),
      },
      relations: ['user'],
    });

    /** Retorna lista */
    return appointments;
  }
}

export default AppointmentsRepository;
