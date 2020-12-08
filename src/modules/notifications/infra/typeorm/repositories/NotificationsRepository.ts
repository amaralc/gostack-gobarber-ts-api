import { getMongoRepository, MongoRepository } from 'typeorm';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';

/** Cria classe implementando interface que permite troca de dependencias */
export default class NotificationsRepository
  implements INotificationsRepository {
  /** Define variável e tipagem */
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    /**
     * Define ormRepository como repositório de Notifications, passando 'name'
     * da conexao conforme ormconfig.json
     */
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  /** Método para criar appointment */
  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    /** Cria novo instância */
    const notification = this.ormRepository.create({ recipient_id, content });

    /** Salva instância no banco de dados */
    await this.ormRepository.save(notification);

    /** Retorna instância criada */
    return notification;
  }
}
