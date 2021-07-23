import {MigrationInterface, QueryRunner} from "typeorm";

export class addEmailToUsers1625533112563 implements MigrationInterface {
    name = 'addEmailToUsers1625533112563'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
    }

}
