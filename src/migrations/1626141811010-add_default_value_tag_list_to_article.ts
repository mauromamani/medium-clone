import {MigrationInterface, QueryRunner} from "typeorm";

export class addDefaultValueTagListToArticle1626141811010 implements MigrationInterface {
    name = 'addDefaultValueTagListToArticle1626141811010'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "tagList" SET DEFAULT '[]'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "tagList" DROP DEFAULT`);
    }

}
