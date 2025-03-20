import { MigrationInterface, QueryRunner } from "typeorm";

export class IntialMigration1741117908804 implements MigrationInterface {
    name = 'IntialMigration1741117908804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "username" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "firstName" character varying(100) NOT NULL, "lastName" character varying(100), "phoneNumber" character varying(20), "profilePictureUrl" text, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "isVerified" boolean NOT NULL DEFAULT false, "lastLogin" TIMESTAMP, CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
