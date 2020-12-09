import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import CreateUserService from '@modules/users/services/CreateUserService';
import { classToClass } from 'class-transformer';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    /** Instancia servico de criacao de usuario */
    const createUser = container.resolve(CreateUserService);

    /** Cria novo usuario com todas as propriedades configuradas como opcionais
     * Motivo: Permitir que informacoes sejam deletadas na rota que as usa (ex.: password)
     * Ref: https://www.typescriptlang.org/docs/handbook/utility-types.html
     */
    const user: Partial<ICreateUserDTO> = await createUser.execute({
      name,
      email,
      password,
    });

    /** Retorna usuario criado */
    return response.status(200).json({ user: classToClass(user) });
  }
}
