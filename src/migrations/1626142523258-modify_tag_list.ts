import {MigrationInterface, QueryRunner} from "typeorm";

export class modifyTagList1626142523258 implements MigrationInterface {
    name = 'modifyTagList1626142523258'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "tagList" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" ALTER COLUMN "tagList" SET DEFAULT '[]'`);
    }

}
