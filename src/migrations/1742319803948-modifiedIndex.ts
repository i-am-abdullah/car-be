import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedIndex1742319803948 implements MigrationInterface {
    name = 'ModifiedIndex1742319803948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_a2385755d9b85e787c48749561"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8d8792c2a5d73713cbec2403f2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be3f1770d368f51b93ed5a57e9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_612749a5504b3ec863bbbf2a44"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9627c9ba9f9315a0fb71dd3fb5"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_9627c9ba9f9315a0fb71dd3fb5" ON "car_listing_images" ("listing_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_612749a5504b3ec863bbbf2a44" ON "car_listing_features" ("feature_id", "listing_id") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_be3f1770d368f51b93ed5a57e9" ON "car_model" ("make_id", "name") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8d8792c2a5d73713cbec2403f2" ON "car_year" ("model_id", "year") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a2385755d9b85e787c48749561" ON "car_variant" ("name", "year_id") `);
    }

}
