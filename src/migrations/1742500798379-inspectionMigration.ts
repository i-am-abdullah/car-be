import { MigrationInterface, QueryRunner } from "typeorm";

export class InspectionMigration1742500798379 implements MigrationInterface {
    name = 'InspectionMigration1742500798379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inspection_packages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "description" text, "price" numeric(10,2) NOT NULL, "advance_percentage" integer NOT NULL DEFAULT '20', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_54c5be7cb08243e5c9c560c53e5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."inspection_requests_status_enum" AS ENUM('pending_approval', 'approved', 'rejected', 'pending_advance_payment', 'advance_paid', 'completed', 'cancelled')`);
        await queryRunner.query(`CREATE TYPE "public"."inspection_requests_advance_payment_status_enum" AS ENUM('pending', 'completed')`);
        await queryRunner.query(`CREATE TYPE "public"."inspection_requests_total_payment_status_enum" AS ENUM('pending', 'completed')`);
        await queryRunner.query(`CREATE TABLE "inspection_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "requested_date" TIMESTAMP NOT NULL, "scheduled_date" TIMESTAMP, "completion_date" TIMESTAMP, "location" character varying(255) NOT NULL, "contact_phone" character varying(20), "status" "public"."inspection_requests_status_enum" NOT NULL DEFAULT 'pending_approval', "total_price" numeric(10,2) NOT NULL, "advance_payment_status" "public"."inspection_requests_advance_payment_status_enum", "total_payment_status" "public"."inspection_requests_total_payment_status_enum", "full_payment_date" TIMESTAMP, "admin_notes" text, "user_notes" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "listing_id" uuid, "user_id" uuid, "package_id" uuid, CONSTRAINT "PK_46234c52d670024d3de2bc3ec28" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "car_listings" ADD "additional_detail_id" uuid`);
        await queryRunner.query(`ALTER TABLE "car_listings" ADD CONSTRAINT "UQ_6a35859cfe40f81d3c4ac088d02" UNIQUE ("additional_detail_id")`);
        await queryRunner.query(`ALTER TABLE "car_listings" ADD "general_detail_id" uuid`);
        await queryRunner.query(`ALTER TABLE "car_listings" ADD CONSTRAINT "UQ_9c164e02c8979511da919e2c690" UNIQUE ("general_detail_id")`);
        await queryRunner.query(`ALTER TABLE "inspection_requests" ADD CONSTRAINT "FK_9b4e217b06afc2c241f57f5c5f9" FOREIGN KEY ("listing_id") REFERENCES "car_listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inspection_requests" ADD CONSTRAINT "FK_fa00e2f3cd826ada2f0ae9755f6" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inspection_requests" ADD CONSTRAINT "FK_ee29c85f3c60d94801c73960ac7" FOREIGN KEY ("package_id") REFERENCES "inspection_packages"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_listings" ADD CONSTRAINT "FK_6a35859cfe40f81d3c4ac088d02" FOREIGN KEY ("additional_detail_id") REFERENCES "car_additional_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "car_listings" ADD CONSTRAINT "FK_9c164e02c8979511da919e2c690" FOREIGN KEY ("general_detail_id") REFERENCES "car_general_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_listings" DROP CONSTRAINT "FK_9c164e02c8979511da919e2c690"`);
        await queryRunner.query(`ALTER TABLE "car_listings" DROP CONSTRAINT "FK_6a35859cfe40f81d3c4ac088d02"`);
        await queryRunner.query(`ALTER TABLE "inspection_requests" DROP CONSTRAINT "FK_ee29c85f3c60d94801c73960ac7"`);
        await queryRunner.query(`ALTER TABLE "inspection_requests" DROP CONSTRAINT "FK_fa00e2f3cd826ada2f0ae9755f6"`);
        await queryRunner.query(`ALTER TABLE "inspection_requests" DROP CONSTRAINT "FK_9b4e217b06afc2c241f57f5c5f9"`);
        await queryRunner.query(`ALTER TABLE "car_listings" DROP CONSTRAINT "UQ_9c164e02c8979511da919e2c690"`);
        await queryRunner.query(`ALTER TABLE "car_listings" DROP COLUMN "general_detail_id"`);
        await queryRunner.query(`ALTER TABLE "car_listings" DROP CONSTRAINT "UQ_6a35859cfe40f81d3c4ac088d02"`);
        await queryRunner.query(`ALTER TABLE "car_listings" DROP COLUMN "additional_detail_id"`);
        await queryRunner.query(`DROP TABLE "inspection_requests"`);
        await queryRunner.query(`DROP TYPE "public"."inspection_requests_total_payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."inspection_requests_advance_payment_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."inspection_requests_status_enum"`);
        await queryRunner.query(`DROP TABLE "inspection_packages"`);
    }

}
