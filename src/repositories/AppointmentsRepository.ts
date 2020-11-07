import { isEqual } from 'date-fns';
import Appointment from '../models/Appointment';

class AppointmentRepository {
  /** Cria variável acessível apenas dentro da classe */
  private appointments: Appointment[];

  constructor() {
    /** Define lista de appointments */
    this.appointments = [];
  }

  /** Método público que retorna todos os agendamentos no formato 'array de appointments' */
  public all(): Appointment[] {
    return this.appointments;
  }

  /**
   * Método público para encontrar appointment a partir de uma data.
   * Método pode retornar tipo Appointment OU null
   */
  public findByDate(date: Date): Appointment | null {
    /** Encontra appointment em lista de appointments */
    const findAppointment = this.appointments.find(appointment =>
      isEqual(date, appointment.date),
    );

    /** Retorna appointment encontrado e se não encontrar, retorna nulo */
    return findAppointment || null;
  }

  /** Crie método acessível fora da classe para criar novo appointment */
  public create(provider: string, date: Date): Appointment {
    /** Define appointment como novo Appointment */
    const appointment = new Appointment(provider, date);

    /** Adiciona appointment à lista de appointments */
    this.appointments.push(appointment);

    /** Retorna appointment */
    return appointment;
  }
}

export default AppointmentRepository;
