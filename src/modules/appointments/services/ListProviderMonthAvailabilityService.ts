import { injectable, inject } from 'tsyringe';
import { getDate, getDaysInMonth } from 'date-fns';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
export default class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    /** Define numero de dias no mes */
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    /** Cria array a partir do numero de dias no mes */
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    /**
     * Cria array de comprimento igual aos dias do mes que retorna disponibilidade por dia
     * Ex.: [{day: 1, available: true}, {day: 2, available: false}, ...]
     */
    const availability = eachDayArray.map(day => {
      /** Filtra lista de agendamentos para cada dia */
      const appointmentsInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      /**
       * Retorna dia e disponibilidade no formato
       * Ex.: {day: 1, available: true}
       */
      return {
        day,
        available: appointmentsInDay.length < 10,
      };
    });

    return availability;
  }
}
