import { ObjectID } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

/** Cria classe implementando interface que permite troca de dependencias */
export default class NotificationsRepository
  implements INotificationsRepository {
  /** Define repositorio */
  private notifications: Notification[] = [];

  /** Método para criar appointment */
  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    /** Cria novo instância */
    const notification = new Notification();

    /** Define valores do objeto */
    Object.assign(notification, { id: new ObjectID(), content, recipient_id });

    /** Salva instância no repositorio */
    this.notifications.push(notification);

    /** Retorna instância criada */
    return notification;
  }
}
