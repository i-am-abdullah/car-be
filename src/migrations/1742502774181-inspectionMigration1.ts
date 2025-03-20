import { MigrationInterface, QueryRunner } from "typeorm";

export class InspectionMigration11742502774181 implements MigrationInterface {
    name = 'InspectionMigration11742502774181'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inspection_reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "overall_condition" character varying(50) NOT NULL, "condition_rating" numeric(3,1) NOT NULL, "exterior_assessment" text NOT NULL, "interior_assessment" text NOT NULL, "mechanical_assessment" text NOT NULL, "electrical_assessment" text NOT NULL, "odometer_reading" integer NOT NULL, "vin_verified" boolean NOT NULL DEFAULT false, "inspector_comments" text NOT NULL, "recommended_actions" text NOT NULL, "estimated_repair_costs" numeric(10,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "inspection_request_id" uuid NOT NULL, CONSTRAINT "REL_c82416401c41b5b775a6efdaf7" UNIQUE ("inspection_request_id"), CONSTRAINT "PK_661242697489523769401a1c299" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inspection_requests" ADD "inspection_report_id" uuid`);
        await queryRunner.query(`ALTER TABLE "inspection_requests" ADD CONSTRAINT "UQ_66290e9f2103ab4cb3ce8947c9b" UNIQUE ("inspection_report_id")`);
        await queryRunner.query(`ALTER TABLE "inspection_reports" ADD CONSTRAINT "FK_c82416401c41b5b775a6efdaf74" FOREIGN KEY ("inspection_request_id") REFERENCES "inspection_requests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inspection_requests" ADD CONSTRAINT "FK_66290e9f2103ab4cb3ce8947c9b" FOREIGN KEY ("inspection_report_id") REFERENCES "inspection_reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inspection_requests" DROP CONSTRAINT "FK_66290e9f2103ab4cb3ce8947c9b"`);
        await queryRunner.query(`ALTER TABLE "inspection_reports" DROP CONSTRAINT "FK_c82416401c41b5b775a6efdaf74"`);
        await queryRunner.query(`ALTER TABLE "inspection_requests" DROP CONSTRAINT "UQ_66290e9f2103ab4cb3ce8947c9b"`);
        await queryRunner.query(`ALTER TABLE "inspection_requests" DROP COLUMN "inspection_report_id"`);
        await queryRunner.query(`DROP TABLE "inspection_reports"`);
    }

}
