import {MigrationInterface, QueryRunner} from "typeorm";

export class createUsers1625450580074 implements MigrationInterface {
    name = 'createUsers1625450580074'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "bio" character varying NOT NULL DEFAULT '', "image" character varying NOT NULL DEFAULT '', "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
