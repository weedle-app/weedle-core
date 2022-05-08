import {MigrationInterface, QueryRunner} from "typeorm";

export class userAuthApiKeys1652003553590 implements MigrationInterface {
    name = 'userAuthApiKeys1652003553590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "email" character varying NOT NULL, "profile_type" character varying NOT NULL DEFAULT 'customer', "auth_id" uuid NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_32ddc1ae708e8261a870a6eb3e6" UNIQUE ("auth_id"), CONSTRAINT "REL_32ddc1ae708e8261a870a6eb3e" UNIQUE ("auth_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "email" character varying NOT NULL, "password" character varying NOT NULL, "account_verified" boolean NOT NULL DEFAULT false, "verification_expiration" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "verification_code" character varying, "password_reset" character varying, "password_reset_code" character varying, "reset_code_expiration" TIMESTAMP DEFAULT ('now'::text)::timestamp(6) with time zone, "changed_password" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_7e416cf6172bc5aec04244f6459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."api_access_keys_status_enum" AS ENUM('ACTIVE', 'SUSPENDED')`);
        await queryRunner.query(`CREATE TABLE "api_access_keys" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT true, "deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "updated_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone, "api_key" character varying NOT NULL, "server_url" character varying NOT NULL, "status" "public"."api_access_keys_status_enum" NOT NULL DEFAULT 'ACTIVE', "authId" uuid, CONSTRAINT "PK_7b3cd288604ed08f9ccd6195083" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_32ddc1ae708e8261a870a6eb3e6" FOREIGN KEY ("auth_id") REFERENCES "auth"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "api_access_keys" ADD CONSTRAINT "FK_946ffbb6c852c2bfea1cf696ce1" FOREIGN KEY ("authId") REFERENCES "auth"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "api_access_keys" DROP CONSTRAINT "FK_946ffbb6c852c2bfea1cf696ce1"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_32ddc1ae708e8261a870a6eb3e6"`);
        await queryRunner.query(`DROP TABLE "api_access_keys"`);
        await queryRunner.query(`DROP TYPE "public"."api_access_keys_status_enum"`);
        await queryRunner.query(`DROP TABLE "auth"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
