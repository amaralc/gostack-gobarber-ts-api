import { EntityRepository, Repository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

@EntityRepository(Appointment)
class AppointmentRepository extends Repository<Appointment> {
  /** Acima, entre <> : parametro de uma tipagem */
  /**
   * Método público para encontrar appointment a partir de uma data.
   * Método pode retornar tipo Appointment OU null
   */
  public async findByDate(date: Date): Promise<Appointment | null> {
    /** Encontra appointment em lista de appointments */
    // const findAppointment = this.appointments.find(appointment =>
    //   isEqual(date, appointment.date),
    // );

    /** Chama método assincrono para encontrar um appointment */
    const findAppointment = await this.findOne({
      /** Onde a coluna 'date' é igual ao parâmetro 'date' */
      where: { date },
    });

    /** Retorna appointment encontrado e se não encontrar, retorna nulo */
    return findAppointment || null;
  }
}

export default AppointmentRepository;
