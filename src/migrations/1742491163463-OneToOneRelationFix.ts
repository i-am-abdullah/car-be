import { MigrationInterface, QueryRunner } from "typeorm";

export class OneToOneRelationFix1742491163463 implements MigrationInterface {
    name = 'OneToOneRelationFix1742491163463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_variant" ADD "showroom_detail" uuid`);
        await queryRunner.query(`ALTER TABLE "car_variant" ADD CONSTRAINT "UQ_afd1588f7858d51378f1a3682fe" UNIQUE ("showroom_detail")`);
        await queryRunner.query(`ALTER TABLE "car_additional_details" ADD "listing_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_additional_details" ADD CONSTRAINT "UQ_62a94d81c4b8a8509232eab64cf" UNIQUE ("listing_id")`);
        await queryRunner.query(`ALTER TABLE "car_general_details" ADD "listing_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "car_general_details" ADD CONSTRAINT "UQ_b8faee9d8be3feee90388d6893d" UNIQUE ("listing_id")`);
        await queryRunner.query(`ALTER TABLE "car_variant" ADD CONSTRAINT "FK_afd1588f7858d51378f1a3682fe" FOREIGN KEY ("showroom_detail") REFERENCES "showroom_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_additional_details" ADD CONSTRAINT "FK_62a94d81c4b8a8509232eab64cf" FOREIGN KEY ("listing_id") REFERENCES "car_listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_general_details" ADD CONSTRAINT "FK_b8faee9d8be3feee90388d6893d" FOREIGN KEY ("listing_id") REFERENCES "car_listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_general_details" DROP CONSTRAINT "FK_b8faee9d8be3feee90388d6893d"`);
        await queryRunner.query(`ALTER TABLE "car_additional_details" DROP CONSTRAINT "FK_62a94d81c4b8a8509232eab64cf"`);
        await queryRunner.query(`ALTER TABLE "car_variant" DROP CONSTRAINT "FK_afd1588f7858d51378f1a3682fe"`);
        await queryRunner.query(`ALTER TABLE "car_general_details" DROP CONSTRAINT "UQ_b8faee9d8be3feee90388d6893d"`);
        await queryRunner.query(`ALTER TABLE "car_general_details" DROP COLUMN "listing_id"`);
        await queryRunner.query(`ALTER TABLE "car_additional_details" DROP CONSTRAINT "UQ_62a94d81c4b8a8509232eab64cf"`);
        await queryRunner.query(`ALTER TABLE "car_additional_details" DROP COLUMN "listing_id"`);
        await queryRunner.query(`ALTER TABLE "car_variant" DROP CONSTRAINT "UQ_afd1588f7858d51378f1a3682fe"`);
        await queryRunner.query(`ALTER TABLE "car_variant" DROP COLUMN "showroom_detail"`);
    }

}
