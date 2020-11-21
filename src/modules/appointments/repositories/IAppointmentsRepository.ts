import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

export default interface IAppointmentsRepository {
  /** Define tipagem do metodo create */
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  /** Define tipo de parametro da interface */
  findByDate(date: Date): Promise<Appointment | undefined>;
}
