import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AlterProviderFieldToProviderId1605376670325
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** Etapa 01 - Deleta coluna antiga */
    await queryRunner.dropColumn('appointments', 'provider');

    /** Etapa 02 - Adiciona nova coluna */
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'provider_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    /** Etapa 03 - Cria relacionamento */
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        /** Nome do relacionamento */
        name: 'AppointmentProvider',
        /** Coluna desta tabela que referencia tabela externa */
        columnNames: ['provider_id'],
        /** Tabela referenciada pelo campo desta tabela */
        referencedTableName: 'users',
        /** Nome da coluna referenciada, na tabela externa */
        referencedColumnNames: ['id'],
        /** Se instancia na tabela referenciada for deletada, seta nulo nesta tabela */
        onDelete: 'SET NULL',
        /** Se instancia na tabela referenciada for alterada, altera valor nesta tabela */
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * IMPORTANTE: Migration precisa ser desfeita na ordem reversa
     */

    /** Etapa 01 - Remove relacionamento */
    await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');

    /** Etapa 02 - Remove coluna nova */
    await queryRunner.dropColumn('appointments', 'provider_id');

    /** Etapa 03 - Adiciona coluna antiga */
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'provider',
        type: 'varchar',
      }),
    );
  }
}
