-- Sets up the central aula_database with the tenants table and a single E2E test tenant.
-- The MARIADB_DATABASE env var already causes MariaDB to create aula_database, so we
-- only need to create the table and seed the tenant row.

USE aula_database;

CREATE TABLE IF NOT EXISTS `tenants` (
  `id`                    varchar(255) NOT NULL,
  `name`                  varchar(255) NOT NULL,
  `api_base_url`          varchar(255) NOT NULL,
  `contact_info`          varchar(255) DEFAULT NULL,
  `admin1_name`           varchar(255) DEFAULT NULL,
  `admin1_username`       varchar(255) NOT NULL,
  `admin1_email`          varchar(255) NOT NULL,
  `admin1_init_pass_url`  varchar(255) DEFAULT NULL,
  `admin2_name`           varchar(255) DEFAULT NULL,
  `admin2_username`       varchar(255) DEFAULT NULL,
  `admin2_email`          varchar(255) DEFAULT NULL,
  `admin2_init_pass_url`  varchar(255) DEFAULT NULL,
  `instance_code`         varchar(10)  NOT NULL,
  `jwt_key`               varchar(255) DEFAULT NULL,
  `created_at`            timestamp    NULL DEFAULT NULL,
  `updated_at`            timestamp    NULL DEFAULT NULL,
  `data`                  longtext     DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `tenants_name_unique` (`name`),
  UNIQUE KEY `tenants_instance_code_unique` (`instance_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- The SINGLE tenant for e2e tests.
-- api_base_url is what the browser stores as api_url and uses for all API calls,
-- so it must be reachable from the test runner host (localhost:8080).
-- The data JSON tells the legacy backend which database/credentials to use for this instance.
INSERT INTO `tenants`
  (`id`, `name`, `api_base_url`, `admin1_username`, `admin1_email`, `instance_code`, `jwt_key`, `created_at`, `updated_at`, `data`)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'E2E Test Instance',
  'http://localhost:8080',
  'admin',
  'admin@aula.de',
  'SINGLE',
  'e2e_jwt_secret_key',
  NOW(),
  NOW(),
  '{"tenancy_db_name":"aula_e2e","tenancy_db_username":"aula_user","tenancy_db_password":"e2e_pass"}'
);
