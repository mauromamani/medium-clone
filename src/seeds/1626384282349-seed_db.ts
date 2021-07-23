import { MigrationInterface, QueryRunner } from 'typeorm';

export class seed_db_1626384282349 implements MigrationInterface {
  name = 'seed_db_1626384282349';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffe'), ('nestjs')`,
    );

    /*await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-title', 'first title', 'first description', 'first body', 'coffe, dragons', 1), ('second-title', 'second title', 'second description', 'second body', 'coffe, nestjs', 1)`,
    );*/

    // password: foo
    await queryRunner.query(
      `INSERT INTO users (name, username, email, password) VALUES ('foo', 'foo', 'foo@foo.com', '$2b$10$mooRI8eMCzzVlxi6QDMNTeKrYzq.RVggTtPyhVugTITdbHOWzU9bG')`,
    );
  }

  public async down(): Promise<void> {
    return null;
  }
}
