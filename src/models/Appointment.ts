import { v4 } from 'uuid';

class Appointment {
  id: string;

  provider: string;

  date: Date;

  /** Define valores iniciais de construção da instância, omitindo o parâmetro 'id' */
  constructor({ provider, date }: Omit<Appointment, 'id'>) {
    /** Define id do appointment como uuid v4 */
    this.id = v4();
    this.provider = provider;
    this.date = date;
  }
}

export default Appointment;
