import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtAndUpdatedAtDateColumnsToPostTable1745562404129 implements MigrationInterface {
    name = 'AddCreatedAtAndUpdatedAtDateColumnsToPostTable1745562404129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
        await queryRunner.query(`
            ALTER TABLE "post"
            ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "post" DROP COLUMN "updated_at"
        `);
        await queryRunner.query(`
            ALTER TABLE "post" DROP COLUMN "created_at"
        `);
    }

}
