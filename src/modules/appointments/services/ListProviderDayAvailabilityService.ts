import { getHours } from 'date-fns';
import { injectable, inject } from 'tsyringe';
// import { getDate, getDaysInMonth } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<IResponse> {
    /** Busca agendamentos do dia */
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        year,
        month,
        day,
      },
    );

    /** Define horario de inicio dos agendamentos */
    const hourStart = 8;

    /** Define array com horarios possiveis em um dia */
    const eachHourArray = Array.from(
      /** Define comprimento (8 às 17 = 10h) */
      { length: 10 },
      /** Define valores dos elementos */
      (_, index) => index + hourStart,
    );

    /** Define array de disponibilidade */
    const availability = eachHourArray.map(hour => {
      const hasAppointmentInHour = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      return {
        hour,
        available: !hasAppointmentInHour,
      };
    });

    /** Retorna lista */
    return availability;
  }
}
