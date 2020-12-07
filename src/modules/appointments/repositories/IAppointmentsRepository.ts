import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '../dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '../dtos/IFindAllInDayFromProviderDTO';

export default interface IAppointmentsRepository {
  /** Define tipagem do metodo create */
  create(data: ICreateAppointmentDTO): Promise<Appointment>;
  /** Define tipo de parametro da interface */
  findByDate(date: Date): Promise<Appointment | undefined>;
  /** Define tipo do metodo de listagem no mes */
  findAllInMonthFromProvider(
    data: IFindAllInMonthFromProviderDTO,
  ): Promise<Appointment[]>;
  /** Define tipo do metodo de listagem no dia */
  findAllInDayFromProvider(
    data: IFindAllInDayFromProviderDTO,
  ): Promise<Appointment[]>;
}
