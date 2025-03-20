import { MigrationInterface, QueryRunner } from "typeorm";

export class FeatureMigrations1742320648493 implements MigrationInterface {
    name = 'FeatureMigrations1742320648493'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_listing_features" DROP CONSTRAINT "FK_b3ba2d5e0da5511578f471e8724"`);
        await queryRunner.query(`CREATE TABLE "features" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_bcc3a344ae156a9fba128e1cb4d" UNIQUE ("name"), CONSTRAINT "PK_5c1e336df2f4a7051e5bf08a941" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "car_listing_features" ADD CONSTRAINT "FK_b3ba2d5e0da5511578f471e8724" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_listing_features" DROP CONSTRAINT "FK_b3ba2d5e0da5511578f471e8724"`);
        await queryRunner.query(`DROP TABLE "features"`);
        await queryRunner.query(`ALTER TABLE "car_listing_features" ADD CONSTRAINT "FK_b3ba2d5e0da5511578f471e8724" FOREIGN KEY ("feature_id") REFERENCES "available_features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
