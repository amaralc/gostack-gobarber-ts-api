import { v4 } from 'uuid';
import { isEqual } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';

/** Cria classe implementando interface que permite troca de dependencias */
class AppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    /** Encontra instancia na lista */
    const findAppointment = this.appointments.find(appointment =>
      /** Compara datas */
      isEqual(appointment.date, date),
    );

    /** Retorna instancia */
    return findAppointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    /** Instancia classe Appointment */
    const appointment = new Appointment();

    /** Define conteúdo do objeto instanciado */
    Object.assign(appointment, { id: v4(), date, provider_id });

    /** Adiciona o objeto à lista */
    this.appointments.push(appointment);

    /** Retorna objeto */
    return appointment;
  }
}

export default AppointmentsRepository;
