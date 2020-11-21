import { getRepository, Repository } from 'typeorm';

/** Importa interface */
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

/** Cria classe implementando interface que permite troca de dependencias */
class AppointmentRepository implements IAppointmentsRepository {
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
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    /** Encontra appointment em lista de appointments */
    // const findAppointment = this.appointments.find(appointment =>
    //   isEqual(date, appointment.date),
    // );

    /** Chama método assincrono para encontrar um appointment */
    const findAppointment = await this.ormRepository.findOne({
      /** Onde a coluna 'date' é igual ao parâmetro 'date' */
      where: { date },
    });

    /** Retorna appointment encontrado e se não encontrar, retorna nulo */
    return findAppointment || undefined;
  }

  /** Método para criar appointment */
  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    /** Cria novo instância */
    const appointment = this.ormRepository.create({ provider_id, date });

    /** Salva instância no banco de dados */
    await this.ormRepository.save(appointment);

    /** Retorna instância criada */
    return appointment;
  }
}

export default AppointmentRepository;
