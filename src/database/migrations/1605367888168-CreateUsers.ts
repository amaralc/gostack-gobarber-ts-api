import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUsers1605367888168 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      /** Cria nova tabela */
      new Table({
        /** Nome da tabela */
        name: 'users',
        /** Colunas da tabela */
        columns: [
          /** Primeira coluna */
          {
            /** Nome de uma coluna */
            name: 'id',
            /** Tipo da coluna */
            type: 'varchar',
            /** Chave primaria: (true | false) */
            isPrimary: true,
            /** Define como uuid (mais recomendado, inclusive por segurança) */
            generationStrategy: 'uuid',
            /** Define geração automática de id */
            default: 'uuid_generate_v4()',
          },
          /** Outra coluna */
          {
            name: 'name',
            type: 'varchar',
            /** Pode ser nulo? (true | false) (o padrão já é false) */
            isNullable: false,
          },
          /** Outra coluna */
          {
            name: 'email',
            /** Define tipo timestamp com timezone */
            type: 'varchar',
            /** Define que valor deve ser único naquela coluna da tabela */
            isUnique: true,
            isNullable: false,
          },
          /** Outra coluna */
          {
            name: 'password',
            /** Define tipo timestamp com timezone */
            type: 'varchar',
          },
          /** Outra coluna */
          {
            name: 'created_at',
            type: 'timestamp',
            /** Valor default deve ser o timestamp de agora */
            default: 'now()',
          },
          /** Outra coluna */
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /** Deleta tabela */
    await queryRunner.dropTable('users');
  }
}
