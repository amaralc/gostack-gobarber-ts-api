import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class AddUserIdToAppointments1607369231924
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /** Adiciona nova coluna */
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'user_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    /** Cria relacionamento */
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        /** Nome do relacionamento */
        name: 'AppointmentUser',
        /** Coluna desta tabela que referencia tabela externa */
        columnNames: ['user_id'],
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

    /** Remove relacionamento */
    await queryRunner.dropForeignKey('appointments', 'AppointmentUser');

    /** Remove coluna nova */
    await queryRunner.dropColumn('appointments', 'user_id');
  }
}
