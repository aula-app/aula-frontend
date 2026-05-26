/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.10-MariaDB, for Linux (x86_64)
--
-- Host: mariadb    Database: tenant_d5e67552-d591-4465-b462-f41ea13d73a2
-- ------------------------------------------------------
-- Server version	11.7.2-MariaDB-ubu2404

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

SET autocommit=0;
SET FOREIGN_KEY_CHECKS=0;
SET UNIQUE_CHECKS=0;

BEGIN;

LOCK TABLES `au_rooms` WRITE;
/*!40000 ALTER TABLE `au_rooms` DISABLE KEYS */;
INSERT INTO `au_rooms` (id, room_name, description_internal, hash_id, status, type) VALUES
(1, 'Schule',NULL,'78b58d10a5bd01ca09dfd7478bb6ba07',1,1),
(2, 'e2e.class_1A','e2e test room of class 1A','1a',1,0);
/*!40000 ALTER TABLE `au_rooms` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `au_system_current_state` WRITE;
/*!40000 ALTER TABLE `au_system_current_state` DISABLE KEYS */;
INSERT INTO `au_system_current_state` (online_mode, created, last_update, updater_id) VALUES
(1,'2026-05-19 09:39:54','2026-05-19 09:39:54',1);
/*!40000 ALTER TABLE `au_system_current_state` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `au_system_global_config` WRITE;
/*!40000 ALTER TABLE `au_system_global_config` DISABLE KEYS */;
INSERT INTO `au_system_global_config` (name, allow_registration) VALUES
('E2E Test Instance',0);
/*!40000 ALTER TABLE `au_system_global_config` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `au_users_basedata` WRITE;
/*!40000 ALTER TABLE `au_users_basedata` DISABLE KEYS */;
-- "IGNORE" - It could be that our e2e infra setup will already create Admin and TechAdmin for the first pass
INSERT IGNORE INTO `au_users_basedata`
(
  id, displayname, realname, username, email,
  pw, hash_id,
  userlevel, about_me, registration_status, status, created, last_update, presence, pw_changed, roles
)
VALUES 
(
  1, 'e2e.admin', 'Admin Adminović','admin','dev+e2e-admin@aula.de',
  '$2a$04$nacjQt60gWeND/lAhkUQW./9JkP3cxDSswXHOnzDI3wCsxe3NQzum','e2e.admin.50',
  50, 'e2e admin user', 2, 1, NOW(), NOW(), 1, 1, '[]'
),
(
  2, 'e2e.tech-admin', 'Tech Adminović','tech_admin','dev+e2e-tech_admin@aula.de',
  '$2a$04$nacjQt60gWeND/lAhkUQW./9JkP3cxDSswXHOnzDI3wCsxe3NQzum','e2e.tech_admin.60',
  50, 'e2e admin user', 2, 1, NOW(), NOW(), 1, 1, '[]'
),
(
  3, 'e2e.user', 'User Userić', 'user', 'dev+e2e-user@aula.de',
  '$2a$04$nacjQt60gWeND/lAhkUQW./9JkP3cxDSswXHOnzDI3wCsxe3NQzum', 'e2e.user.20.user', 
  20, 'e2e test user', 2, 1, NOW(), NOW(), 1, 1, '[{"room": "1a", "role": 20}]'
),
(
  4, 'e2e.student', 'Student Studentić', 'student', 'dev+e2e-student@aula.de',
  '$2a$04$nacjQt60gWeND/lAhkUQW./9JkP3cxDSswXHOnzDI3wCsxe3NQzum', 'e2e.user.20.student', 
  20, 'e2e test student', 2, 1, NOW(), NOW(), 1, 1, '[{"room": "1a", "role": 20}]'
);
/*!40000 ALTER TABLE `au_users_basedata` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `au_rel_rooms_users` WRITE;
/*!40000 ALTER TABLE `au_rel_rooms_users` DISABLE KEYS */;
INSERT INTO `au_rel_rooms_users`
(room_id, user_id, status, created, last_update, updater_id)
VALUES
(2, 3, 1, NOW(), NOW(), 1),
(2, 4, 1, NOW(), NOW(), 1);
/*!40000 ALTER TABLE `au_rel_rooms_users` ENABLE KEYS */;
UNLOCK TABLES;

COMMIT;
SET UNIQUE_CHECKS=1;
SET FOREIGN_KEY_CHECKS=1;
SET autocommit=1;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-05-19  9:41:47
