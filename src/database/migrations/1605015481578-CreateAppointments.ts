import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateAppointments1605015481578
  implements MigrationInterface {
  /**
   * Alterações que serão realizadas no banco de dados quando a migration for
   * executada.
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      /** Cria nova tabela */
      new Table({
        /** Nome da tabela */
        name: 'appointments',
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
          },
          /** Outra coluna */
          {
            name: 'provider',
            type: 'varchar',
            /** Pode ser nulo? (true | false) */
            isNullable: false,
          },
          /** Outra coluna */
          {
            name: 'date',
            /** Define tipo timestamp com timezone */
            type: 'timestamp with time zone',
            isNullable: false,
          },
        ],
      }),
    );
  }

  /**
   * Reverte as alterações realizadas no método up, quando precisarmos voltar
   * nas migrations (ex.: migrate:undo:all)
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    /** Deleta tabela */
    await queryRunner.dropTable('appointments');
  }
}
