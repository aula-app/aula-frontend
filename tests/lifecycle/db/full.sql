
  const usersToCreate = [
    { name: 'user', role: 20 },
    { name: 'student', role: 20 },
  ];


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

--
-- Table structure for table `au_activitylog`
--

DROP TABLE IF EXISTS `au_activitylog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_activitylog` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` smallint(6) DEFAULT NULL COMMENT 'Which type of activity (i.e. 1=login, 2=logout, 3=vote, 4= new idea etc.)',
  `info` varchar(1024) DEFAULT NULL COMMENT 'comment or activity as clear text',
  `group` int(11) DEFAULT NULL COMMENT 'group type of user that triggered the activity',
  `target` int(11) NOT NULL DEFAULT 0 COMMENT 'target of the activity (i.E. vote for a specific idea id)',
  `created` datetime DEFAULT NULL COMMENT 'Date time of the activity',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update is saved if dataset is altered',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_categories`
--

DROP TABLE IF EXISTS `au_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(1024) DEFAULT NULL COMMENT 'name of category',
  `description_public` text DEFAULT NULL COMMENT 'public description, seen in frontend',
  `description_internal` text DEFAULT NULL COMMENT 'only seen by admins',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive, 1=active 2=archived',
  `created` datetime DEFAULT current_timestamp() COMMENT 'create date',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user id of the updater',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hash id of the category',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_change_password`
--

DROP TABLE IF EXISTS `au_change_password`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_change_password` (
  `user_id` int(11) DEFAULT NULL,
  `secret` text DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_commands`
--

DROP TABLE IF EXISTS `au_commands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_commands` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cmd_id` int(11) DEFAULT NULL COMMENT 'command id (i.e. 1=delete user, 2=suspend user, 3=unsuspend user 4=vacation_on, 5=vacation_off etc.)',
  `command` varchar(1024) DEFAULT NULL COMMENT 'command in text form',
  `parameters` varchar(2048) DEFAULT NULL COMMENT 'parameters for the command',
  `date_start` datetime DEFAULT NULL COMMENT 'Date and time, when command is executed',
  `date_end` datetime DEFAULT NULL COMMENT 'Date and time, when command execution ends',
  `active` tinyint(1) DEFAULT NULL COMMENT '0=inactive, 1=active',
  `status` int(11) DEFAULT NULL COMMENT '0=not executed yet, 1=executed, 2=executed with error',
  `info` varchar(1024) DEFAULT NULL COMMENT 'contains comment of person that entered command',
  `target_id` int(11) DEFAULT NULL COMMENT 'id of target that the command relates to - i.E. user id, group id, organisation',
  `creator_id` int(11) DEFAULT NULL COMMENT 'id of user who created the command',
  `created` datetime DEFAULT current_timestamp() COMMENT 'create date of the command',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update of command',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user id of the updater',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_comments`
--

DROP TABLE IF EXISTS `au_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `content` varchar(4096) DEFAULT NULL COMMENT 'content of the comment',
  `sum_likes` int(11) DEFAULT NULL COMMENT 'count of likes for faster access and less DB queries',
  `user_id` int(11) DEFAULT NULL COMMENT 'id of user that created comment',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive, 1=active, 2=suspended, 3=reported, 4=archived',
  `created` datetime DEFAULT current_timestamp() COMMENT 'datetime of creation',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update of comment',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user_id of the updater',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hash id of the comment',
  `language_id` int(11) DEFAULT NULL COMMENT 'Language_id',
  `idea_id` int(11) DEFAULT NULL COMMENT 'id of the idea',
  `parent_id` int(11) DEFAULT NULL COMMENT 'id of the parent comment (0=first comment)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_consent`
--

DROP TABLE IF EXISTS `au_consent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_consent` (
  `user_id` int(11) NOT NULL COMMENT 'id of user',
  `text_id` int(11) NOT NULL DEFAULT 0 COMMENT 'id of text',
  `consent` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1= user consented 0= user didnt consent 2=user revoked consent',
  `date_consent` datetime DEFAULT NULL COMMENT 'date of consent to terms',
  `date_revoke` datetime DEFAULT NULL COMMENT 'date of revocation',
  `created` datetime DEFAULT current_timestamp() COMMENT 'create time',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user id of the updater',
  `status` int(11) NOT NULL DEFAULT 1 COMMENT 'status of consent',
  PRIMARY KEY (`user_id`,`text_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_delegation`
--

DROP TABLE IF EXISTS `au_delegation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_delegation` (
  `user_id_original` int(11) NOT NULL COMMENT 'original user (delegating)',
  `user_id_target` int(11) NOT NULL COMMENT 'receiving user',
  `room_id` int(11) NOT NULL DEFAULT 0 COMMENT 'id where the delegation is in',
  `topic_id` int(11) NOT NULL COMMENT 'id of the topic the delegation is for',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive, 1=active, 2=suspended',
  `updater_id` int(11) NOT NULL DEFAULT 0 COMMENT 'id of the updating user',
  `created` datetime DEFAULT current_timestamp() COMMENT 'created date',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  PRIMARY KEY (`user_id_original`,`user_id_target`,`topic_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_groups`
--

DROP TABLE IF EXISTS `au_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_groups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `group_name` varchar(1024) DEFAULT NULL COMMENT 'name of group',
  `description_public` text DEFAULT NULL COMMENT 'public description of group',
  `description_internal` text DEFAULT NULL COMMENT 'internal description, only seen by admins',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive, 1=active, 2=suspended, 3=archived',
  `internal_info` varchar(2048) DEFAULT NULL COMMENT 'internal info, only visible to admins',
  `created` datetime DEFAULT current_timestamp() COMMENT 'datetime of creation',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update of group',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user id of the updater',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hash id of the group',
  `access_code` varchar(1024) DEFAULT NULL COMMENT 'if set then access code is needed to join group',
  `order_importance` int(11) DEFAULT NULL COMMENT 'order that groups are shown (used for display)',
  `vote_bias` int(11) DEFAULT NULL COMMENT 'votes weight per user in this group',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_ideas`
--

DROP TABLE IF EXISTS `au_ideas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_ideas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` text DEFAULT NULL,
  `content` text DEFAULT NULL COMMENT 'content of the idea',
  `sum_likes` int(11) DEFAULT NULL COMMENT 'aggregated likes for faster access, less DB Queries',
  `sum_votes` int(11) DEFAULT NULL COMMENT 'aggregated votes for faster access, less DB Queries',
  `number_of_votes` int(11) DEFAULT NULL COMMENT 'number of votes given for this idea',
  `user_id` int(11) DEFAULT NULL COMMENT 'creator id',
  `votes_available_per_user` int(11) DEFAULT NULL COMMENT 'number of votes that are available per user',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive, 1=active, 2=suspended, 3=reported, 4=archived 5= in review',
  `language_id` int(11) NOT NULL DEFAULT 0 COMMENT 'id of the language 0=default',
  `created` datetime DEFAULT current_timestamp() COMMENT 'create date',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update of idea',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hash id for this id',
  `order_importance` int(11) DEFAULT NULL COMMENT 'order of appearance / importance',
  `info` text DEFAULT NULL COMMENT 'free text field, can be used to add extra information',
  `updater_id` int(11) DEFAULT NULL COMMENT 'id of the updater',
  `room_id` int(11) DEFAULT NULL COMMENT 'id of the room',
  `is_winner` int(11) DEFAULT NULL COMMENT 'flag that this idea succeeded in the voting phase',
  `approved` int(11) DEFAULT NULL COMMENT 'approved in approval phase',
  `approval_comment` text DEFAULT NULL COMMENT 'comment or reasoning why an idea was disapproved / approved',
  `topic_id` int(11) DEFAULT NULL COMMENT 'id of topic that idea belongs to',
  `sum_comments` int(11) NOT NULL DEFAULT 0,
  `custom_field1` text DEFAULT NULL COMMENT 'custom_field1',
  `custom_field2` text DEFAULT NULL COMMENT 'custom_field2',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT 'type of idea 0=std 1=school induced (i.e.survey)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_likes`
--

DROP TABLE IF EXISTS `au_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_likes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT 'id of liking user',
  `object_id` int(11) DEFAULT NULL COMMENT 'id of liked object (idea or comment)',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive, 1=active, temporarily 2=suspended',
  `created` datetime DEFAULT current_timestamp() COMMENT 'create date',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'update date',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hash id of the like',
  `object_type` int(11) DEFAULT NULL COMMENT 'type of liked object 1=idea, 2=comment',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_media`
--

DROP TABLE IF EXISTS `au_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_media` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) DEFAULT NULL COMMENT 'type of media (1=picture, 2=video, 3= audio 4=pdf etc.)',
  `url` varchar(2048) DEFAULT NULL COMMENT 'URL to media',
  `system_type` int(11) DEFAULT NULL COMMENT '0=default, 1=custom',
  `path` varchar(2048) DEFAULT NULL COMMENT 'system path to the file',
  `status` tinyint(1) DEFAULT NULL COMMENT '0=inactive, 1=active 2= reported 3=archived',
  `info` varchar(2028) DEFAULT NULL COMMENT 'description',
  `name` varchar(1024) DEFAULT NULL COMMENT 'name of medium (other than filename)',
  `filename` varchar(2048) DEFAULT NULL COMMENT 'filename with extension (without path)',
  `created` datetime DEFAULT current_timestamp() COMMENT 'creation date',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hash_id of the media',
  `updater_id` int(11) DEFAULT NULL COMMENT 'id of the user that uploaded',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_messages`
--

DROP TABLE IF EXISTS `au_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_messages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `creator_id` int(11) DEFAULT NULL COMMENT 'user id of the creator (0=system)',
  `headline` varchar(1024) DEFAULT NULL COMMENT 'headline of the news',
  `body` text DEFAULT NULL COMMENT 'news body',
  `publish_date` datetime DEFAULT NULL COMMENT 'date, when the news are published to the dashboards',
  `target_group` int(11) DEFAULT NULL COMMENT 'defines group that should receive the news (0=all or group id)',
  `target_id` int(11) DEFAULT NULL COMMENT 'user_id of user that should receive the message',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive 1=active 2=archive',
  `only_on_dashboard` tinyint(1) DEFAULT NULL COMMENT '0=no 1= only displayed on dashboard, no active sending',
  `created` datetime DEFAULT current_timestamp() COMMENT 'date when news were created',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user id of the updater',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hash_id for news post',
  `language_id` int(11) DEFAULT NULL COMMENT 'id of language 0=default',
  `level_of_detail` int(11) DEFAULT NULL COMMENT 'enables the user to filter msgs',
  `msg_type` int(11) DEFAULT NULL COMMENT 'type id of a msg 1=general news 2=user specific news, 3=idea news etc.',
  `room_id` int(11) DEFAULT NULL COMMENT 'if specified only displayed to room members',
  `pin_to_top` int(11) NOT NULL DEFAULT 0 COMMENT '0=no, 1 = yes',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_phases_global_config`
--

DROP TABLE IF EXISTS `au_phases_global_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_phases_global_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(1024) DEFAULT NULL COMMENT 'name of phase',
  `phase_id` int(11) DEFAULT NULL COMMENT '0=wild idea 10=workphase 20=approval 30=voting 40=implementation',
  `duration` int(11) DEFAULT NULL COMMENT 'default duration of phase',
  `time_scale` int(11) DEFAULT NULL COMMENT 'timescale of default duration (0=hours, 1=days, 2=months)',
  `description_public` varchar(4096) DEFAULT NULL COMMENT 'public description of phase',
  `description_internal` varchar(4096) DEFAULT NULL COMMENT 'description only seen by admins',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0=inactive, 1=active',
  `type` int(11) DEFAULT NULL COMMENT 'phase type, 0=voting enabled, 1=voting+likes enabled, 2=likes enabled, 3=no votes, no likes etc.)',
  `created` datetime DEFAULT current_timestamp() COMMENT 'time of creation',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'time of last update',
  `updater_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_categories_ideas`
--

DROP TABLE IF EXISTS `au_rel_categories_ideas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_categories_ideas` (
  `category_id` int(11) NOT NULL COMMENT 'id of category',
  `idea_id` int(11) NOT NULL COMMENT 'id of idea',
  `created` datetime DEFAULT current_timestamp() COMMENT 'creation time of relation',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update of dataset',
  `updater_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`category_id`,`idea_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_categories_media`
--

DROP TABLE IF EXISTS `au_rel_categories_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_categories_media` (
  `category_id` int(11) NOT NULL COMMENT 'id of category',
  `media_id` int(11) NOT NULL COMMENT 'id of media in mediatable',
  `type` int(11) DEFAULT NULL COMMENT 'position where media is used within category',
  `created` datetime DEFAULT NULL COMMENT 'create time',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`category_id`,`media_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_categories_rooms`
--

DROP TABLE IF EXISTS `au_rel_categories_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_categories_rooms` (
  `category_id` int(11) NOT NULL COMMENT 'id of category',
  `room_id` int(11) NOT NULL COMMENT 'id of room',
  `created` datetime DEFAULT current_timestamp() COMMENT 'creation time of relation',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update of dataset',
  `updater_id` int(11) DEFAULT NULL COMMENT 'id of updater',
  PRIMARY KEY (`category_id`,`room_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_groups_media`
--

DROP TABLE IF EXISTS `au_rel_groups_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_groups_media` (
  `group_id` int(11) NOT NULL COMMENT 'id of group',
  `media_id` int(11) NOT NULL COMMENT 'id of media',
  `type` int(11) DEFAULT NULL COMMENT 'position of media within group',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive 1=active',
  `created` datetime DEFAULT NULL,
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `updater_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`group_id`,`media_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_groups_users`
--

DROP TABLE IF EXISTS `au_rel_groups_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_groups_users` (
  `group_id` int(11) NOT NULL COMMENT 'group id',
  `user_id` int(11) NOT NULL COMMENT 'id of user',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive 1=active 2=suspended 3=archive',
  `created` datetime DEFAULT current_timestamp() COMMENT 'creation time',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL COMMENT 'id of the user who did the update',
  PRIMARY KEY (`group_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_ideas_comments`
--

DROP TABLE IF EXISTS `au_rel_ideas_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_ideas_comments` (
  `idea_id` int(11) NOT NULL COMMENT 'id of the idea',
  `comment_id` int(11) NOT NULL COMMENT 'id of the comment',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive 1=active 2=suspended 3=archive',
  `created` datetime DEFAULT NULL COMMENT 'time of creation',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update of dataset',
  `updater_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`idea_id`,`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_ideas_media`
--

DROP TABLE IF EXISTS `au_rel_ideas_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_ideas_media` (
  `idea_id` int(11) NOT NULL,
  `media_id` int(11) NOT NULL,
  `created` datetime DEFAULT NULL,
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `updater_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`idea_id`,`media_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_rooms_media`
--

DROP TABLE IF EXISTS `au_rel_rooms_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_rooms_media` (
  `room_id` int(11) NOT NULL COMMENT 'id of the room',
  `media_id` int(11) NOT NULL COMMENT 'id of the medium in media table',
  `type` int(11) DEFAULT NULL COMMENT 'position within the room',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive 1=active',
  `created` datetime DEFAULT NULL,
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `updater_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`room_id`,`media_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_rooms_users`
--

DROP TABLE IF EXISTS `au_rel_rooms_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_rooms_users` (
  `room_id` int(11) NOT NULL COMMENT 'id of the room',
  `user_id` int(11) NOT NULL COMMENT 'id of the user',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive, 1=active, 2= temporarily suspended, 3= historic',
  `created` datetime DEFAULT current_timestamp() COMMENT 'create time',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user id of updater',
  PRIMARY KEY (`room_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_topics_ideas`
--

DROP TABLE IF EXISTS `au_rel_topics_ideas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_topics_ideas` (
  `topic_id` int(11) NOT NULL COMMENT 'id of the topic',
  `idea_id` int(11) NOT NULL COMMENT 'id of the idea',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `created` datetime DEFAULT NULL,
  `updater_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`topic_id`,`idea_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_topics_media`
--

DROP TABLE IF EXISTS `au_rel_topics_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_topics_media` (
  `topic_id` int(11) NOT NULL COMMENT 'id of the topic',
  `media_id` int(11) NOT NULL COMMENT 'id of the media in media table',
  `type` int(11) DEFAULT NULL COMMENT 'position within the topic',
  `created` datetime DEFAULT NULL COMMENT 'creation date',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`topic_id`,`media_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_user_user`
--

DROP TABLE IF EXISTS `au_rel_user_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_user_user` (
  `user_id1` int(11) NOT NULL COMMENT 'id of first user',
  `user_id2` int(11) NOT NULL COMMENT 'id of second user',
  `type` int(11) DEFAULT NULL COMMENT 'type of relation 0=associated 1=associated and following / subscribed',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive, 1=active, 2=suspended 3= archived',
  `created` datetime DEFAULT NULL COMMENT 'create date',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL COMMENT 'id of user who did the update',
  PRIMARY KEY (`user_id1`,`user_id2`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_users_media`
--

DROP TABLE IF EXISTS `au_rel_users_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_users_media` (
  `user_id` int(11) NOT NULL COMMENT 'id of the user',
  `media_id` int(11) NOT NULL COMMENT 'id of the media in the media table',
  `type` int(11) DEFAULT NULL COMMENT 'position within the user',
  `created` datetime DEFAULT NULL COMMENT 'create time',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`,`media_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rel_users_triggers`
--

DROP TABLE IF EXISTS `au_rel_users_triggers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rel_users_triggers` (
  `user_id` int(11) NOT NULL COMMENT 'id of the user',
  `trigger_id` int(11) NOT NULL COMMENT 'id of the trigger',
  `user_consent` tinyint(1) DEFAULT NULL COMMENT '0=no 1=yes',
  `created` datetime DEFAULT NULL COMMENT 'create time',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user id of the updater',
  PRIMARY KEY (`user_id`,`trigger_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_reported`
--

DROP TABLE IF EXISTS `au_reported`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_reported` (
  `user_id` int(11) NOT NULL COMMENT 'id of the reporting user',
  `type` int(11) NOT NULL COMMENT 'type of reported object 0=idea, 1=comment, 2=user',
  `object_id` int(11) NOT NULL COMMENT 'id of reported object',
  `status` int(11) DEFAULT NULL COMMENT '0=new 1=acknowledged by admin',
  `created` datetime DEFAULT NULL COMMENT 'create date',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `reason` text DEFAULT NULL COMMENT 'reason for reporting',
  `internal_info` text DEFAULT NULL COMMENT 'internal notes on this reporting',
  PRIMARY KEY (`user_id`,`object_id`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_roles`
--

DROP TABLE IF EXISTS `au_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` int(11) DEFAULT NULL COMMENT 'name of role',
  `description_public` text DEFAULT NULL COMMENT 'description useable in frontend',
  `description_internal` text DEFAULT NULL COMMENT 'description only seen by admins',
  `order` int(11) DEFAULT NULL COMMENT 'used for sorting in display in frontend',
  `rights_level` int(11) DEFAULT NULL COMMENT '0=view_only, 10=std_user, 20=privileged user1, 30=privileged user 2, 40=privileged user 5, 50=admin, 60=tech admin',
  `status` tinyint(1) DEFAULT NULL COMMENT '0=inactive, 1=active 2=suspended 3=archived',
  `created` datetime DEFAULT NULL COMMENT 'time of creation',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update of dataset',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hash id of the role',
  `updater_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_rooms`
--

DROP TABLE IF EXISTS `au_rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_rooms` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `room_name` varchar(1024) DEFAULT NULL COMMENT 'Name of the room',
  `description_public` text DEFAULT NULL COMMENT 'public description of the room',
  `description_internal` text DEFAULT NULL COMMENT 'info, only visible to admins',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive 1=active 2= suspended, 3=archived',
  `restrict_to_roomusers_only` tinyint(1) DEFAULT NULL COMMENT '1=yes, only users that are part of this room can view and vote',
  `order_importance` int(11) DEFAULT NULL COMMENT 'order - useable for display purposes or logical operations',
  `created` datetime DEFAULT current_timestamp() COMMENT 'Date time when room was created',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'Last update of room',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user_id of the updater',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hashed id of the room',
  `access_code` varchar(1024) DEFAULT NULL COMMENT 'if set, user needs access code to access room',
  `internal_info` text DEFAULT NULL COMMENT 'internal info and notes on this room',
  `phase_duration_0` int(11) DEFAULT NULL COMMENT 'phase duration 0',
  `phase_duration_1` int(11) DEFAULT NULL COMMENT 'phase_duration_1',
  `phase_duration_2` int(11) DEFAULT NULL COMMENT 'phase_duration_2',
  `phase_duration_3` int(11) DEFAULT NULL COMMENT 'phase_duration_3',
  `phase_duration_4` int(11) DEFAULT NULL COMMENT 'phase_duration_4',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT '0 = standard room 1 = MAIN ROOM (aula)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `au_rooms`
--

LOCK TABLES `au_rooms` WRITE;
/*!40000 ALTER TABLE `au_rooms` DISABLE KEYS */;
INSERT INTO `au_rooms` VALUES
(1,'Schule',NULL,NULL,1,NULL,NULL,'2026-05-19 09:39:54',NULL,NULL,'78b58d10a5bd01ca09dfd7478bb6ba07',NULL,NULL,NULL,NULL,NULL,NULL,NULL,1);
/*!40000 ALTER TABLE `au_rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `au_services`
--

DROP TABLE IF EXISTS `au_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_services` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(1024) DEFAULT NULL COMMENT 'name of the service',
  `type` int(11) DEFAULT NULL COMMENT 'type of service (0=authentication, 1=push notification etc.)',
  `url` text DEFAULT NULL COMMENT 'URL to service',
  `return_url` text DEFAULT NULL COMMENT 'return url to main system',
  `api_secret` varchar(4096) DEFAULT NULL COMMENT 'secret used for service',
  `api_key` text DEFAULT NULL COMMENT 'public key used',
  `api_tok` text DEFAULT NULL COMMENT 'token for api if necessary',
  `parameter1` text DEFAULT NULL COMMENT 'miscellaneous parameter',
  `parameter2` text DEFAULT NULL COMMENT 'miscellaneous parameter',
  `parameter3` text DEFAULT NULL COMMENT 'miscellaneous parameter',
  `parameter4` text DEFAULT NULL COMMENT 'miscellaneous parameter',
  `parameter5` text DEFAULT NULL COMMENT 'miscellaneous parameter',
  `parameter6` text DEFAULT NULL COMMENT 'miscellaneous parameter',
  `description_public` text DEFAULT NULL COMMENT 'Description for public view',
  `description_internal` text DEFAULT NULL COMMENT 'Description for internal view only',
  `status` tinyint(1) DEFAULT NULL COMMENT '0=inactive, 1=active',
  `order` int(11) DEFAULT NULL COMMENT 'order for frontend display',
  `created` datetime DEFAULT NULL COMMENT 'time of creation',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user id of the updater',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hash_id of the service',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_system_current_state`
--

DROP TABLE IF EXISTS `au_system_current_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_system_current_state` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `online_mode` tinyint(1) DEFAULT NULL COMMENT '0=off, 1=on, 2=off (weekend) 3=off (vacation) 4=off (holiday)',
  `revert_to_on_active` tinyint(1) DEFAULT NULL COMMENT 'auto turn back on active (1) or inactive (0)',
  `revert_to_on_date` datetime DEFAULT NULL COMMENT 'date and time, when system gets back online',
  `created` datetime DEFAULT current_timestamp() COMMENT 'create time',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `au_system_current_state`
--

LOCK TABLES `au_system_current_state` WRITE;
/*!40000 ALTER TABLE `au_system_current_state` DISABLE KEYS */;
INSERT INTO `au_system_current_state` VALUES
(1,1,NULL,NULL,'2026-05-19 09:39:54','2026-05-19 09:39:54',1);
/*!40000 ALTER TABLE `au_system_current_state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `au_system_global_config`
--

DROP TABLE IF EXISTS `au_system_global_config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_system_global_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(1024) DEFAULT NULL COMMENT 'name of organisation',
  `internal_hash_id` varchar(2048) DEFAULT NULL COMMENT 'hash id within the organisation',
  `external_hash_id` varchar(2048) DEFAULT NULL COMMENT 'hash id of the organisation to the outside world',
  `description_public` text DEFAULT NULL COMMENT 'text that is publicly displayed on the frontend',
  `base_url` varchar(2048) DEFAULT NULL COMMENT 'base url of the organisation instance',
  `media_url` varchar(2048) DEFAULT NULL COMMENT 'url for media contents',
  `preferred_language` int(11) DEFAULT NULL COMMENT 'id for the default language',
  `date_format` int(11) DEFAULT NULL COMMENT 'id for the date format',
  `time_format` int(11) DEFAULT NULL COMMENT 'id for the time format',
  `first_workday_week` int(11) DEFAULT NULL COMMENT 'id for the first workday',
  `last_workday_week` int(11) DEFAULT NULL COMMENT 'id for the last workday',
  `start_time` datetime DEFAULT NULL COMMENT 'regular starting time',
  `daily_end_time` datetime DEFAULT NULL COMMENT 'regular end_time',
  `allow_registration` tinyint(1) NOT NULL COMMENT '0=no 1=yes',
  `default_role_for_registration` int(11) DEFAULT NULL COMMENT 'role id for new self registered users',
  `default_email_address` varchar(1024) DEFAULT NULL COMMENT 'default fallback e-mail address',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user id of updater',
  `archive_after` int(11) DEFAULT NULL COMMENT 'number of days after which content is automatically archived',
  `organisation_type` int(11) DEFAULT NULL COMMENT '0=school, 1=other organisation - for term set',
  `enable_oauth` int(11) NOT NULL DEFAULT 0 COMMENT '0 = disable, 1 = enable',
  `custom_field1_name` text DEFAULT NULL COMMENT 'Name custom field 1',
  `custom_field2_name` text DEFAULT NULL COMMENT 'Name custom field 2',
  `quorum_wild_ideas` int(11) NOT NULL DEFAULT 10 COMMENT 'percentage for wild idea quorum',
  `quorum_votes` int(11) NOT NULL DEFAULT 10 COMMENT 'percentage for votes',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `au_system_global_config`
--

LOCK TABLES `au_system_global_config` WRITE;
/*!40000 ALTER TABLE `au_system_global_config` DISABLE KEYS */;
INSERT INTO `au_system_global_config` VALUES
(1,'E2E Test Instance',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,10,10);
/*!40000 ALTER TABLE `au_system_global_config` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `au_systemlog`
--

DROP TABLE IF EXISTS `au_systemlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_systemlog` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) DEFAULT NULL COMMENT '0=standard, 1=warning, 2=error 3=nuke error',
  `message` text DEFAULT NULL COMMENT 'entry message / error message',
  `usergroup` int(11) DEFAULT NULL COMMENT 'group that caused the error / activity',
  `url` varchar(2048) DEFAULT NULL COMMENT 'url where event occurred',
  `created` datetime DEFAULT current_timestamp() COMMENT 'creation of log entry',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update of this entry',
  `updater_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_texts`
--

DROP TABLE IF EXISTS `au_texts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_texts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `creator_id` int(11) DEFAULT NULL COMMENT 'user id of the creator',
  `headline` varchar(1024) DEFAULT NULL COMMENT 'headline of the text',
  `body` text DEFAULT NULL COMMENT 'the actual text',
  `user_needs_to_consent` tinyint(1) DEFAULT NULL COMMENT 'consent requirements',
  `service_id_consent` int(11) DEFAULT NULL COMMENT 'id of the service that the consent applies to',
  `consent_text` varchar(512) DEFAULT NULL COMMENT 'text displayed to user for consent',
  `language_id` int(11) DEFAULT NULL COMMENT 'id of the language (0=default)',
  `location` int(11) DEFAULT NULL COMMENT 'location (page) where the text is shown',
  `created` datetime DEFAULT current_timestamp() COMMENT 'create time',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last_update',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user_id of updater',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hash_id of the text',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_topics`
--

DROP TABLE IF EXISTS `au_topics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_topics` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(1024) DEFAULT NULL COMMENT 'name of topic',
  `description_public` text DEFAULT NULL COMMENT 'public description of the topic',
  `description_internal` text DEFAULT NULL COMMENT 'description only seen by admins',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive, 1=active 2=archived',
  `order_importance` int(11) DEFAULT NULL COMMENT 'order bias for displaying in frontend',
  `created` datetime DEFAULT current_timestamp() COMMENT 'creation time',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hash id of the topic',
  `updater_id` int(11) NOT NULL DEFAULT 0 COMMENT 'id of the user that does the update',
  `room_id` int(11) NOT NULL DEFAULT 0 COMMENT 'id of the room the topic is in',
  `phase_id` int(11) NOT NULL DEFAULT 1 COMMENT 'Number of phase the topic is in',
  `wild_ideas_enabled` int(11) NOT NULL DEFAULT 1 COMMENT '1=enabled 0=disabled',
  `publishing_date` datetime DEFAULT NULL COMMENT 'Date, when the topic is active',
  `phase_duration_0` int(11) DEFAULT NULL COMMENT 'Duration of phase 0',
  `phase_duration_1` int(11) DEFAULT NULL COMMENT 'Duration of phase 1',
  `phase_duration_2` int(11) DEFAULT NULL COMMENT 'Duration of phase 2',
  `phase_duration_3` int(11) DEFAULT NULL COMMENT 'Duration of phase 3',
  `phase_duration_4` int(11) DEFAULT NULL COMMENT 'Duration of phase 4',
  `type` int(11) NOT NULL DEFAULT 0 COMMENT 'type of box (0=std, 1= special)',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_triggers`
--

DROP TABLE IF EXISTS `au_triggers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_triggers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `trigger_id` int(11) DEFAULT NULL COMMENT 'id of the trigger',
  `name_public` varchar(512) DEFAULT NULL COMMENT 'public name of the trigger',
  `name_internal` varchar(512) DEFAULT NULL COMMENT 'internal name of the trigger',
  `description_public` text DEFAULT NULL COMMENT 'description of the trigger',
  `description_internal` text DEFAULT NULL COMMENT 'internal description',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive, 1=active 2=suspended',
  `created` datetime DEFAULT NULL COMMENT 'create time',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user id of the last updater',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_user_levels`
--

DROP TABLE IF EXISTS `au_user_levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_user_levels` (
  `level` int(11) NOT NULL COMMENT 'id of level',
  `name` varchar(1024) DEFAULT NULL COMMENT 'name of level',
  `description` text DEFAULT NULL COMMENT 'description of userlevel / rights',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive 1=active',
  PRIMARY KEY (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_users_basedata`
--

DROP TABLE IF EXISTS `au_users_basedata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_users_basedata` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `realname` varchar(2048) DEFAULT NULL COMMENT 'real name of the user',
  `displayname` varchar(1024) DEFAULT NULL COMMENT 'name displayed in frontend',
  `username` varchar(512) DEFAULT NULL,
  `email` varchar(2048) DEFAULT NULL COMMENT 'email address',
  `sso_sub` varchar(255) DEFAULT NULL COMMENT 'Subject identifier from the SSO identity provider (OIDC sub claim)',
  `sso_provider` varchar(100) DEFAULT NULL COMMENT 'SSO identity provider name used to create this user (e.g. mock-iserv, vidis)',
  `sso_id_token` text DEFAULT NULL COMMENT 'OIDC id_token from Keycloak; used for RP-initiated logout (id_token_hint)',
  `sso_refresh_token` text DEFAULT NULL COMMENT 'Keycloak refresh token; used for server-side session revocation on logout',
  `sso_idp_id_token` text DEFAULT NULL COMMENT 'id_token from the upstream IdP (e.g. mock-iserv); used to logout from the IdP session',
  `pw` varchar(2048) DEFAULT NULL COMMENT 'pw',
  `position` varchar(1024) DEFAULT NULL COMMENT 'position within the organisation - not mandatory',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hashed id userspecific',
  `about_me` text DEFAULT NULL COMMENT 'about me text',
  `registration_status` int(11) DEFAULT NULL COMMENT 'Registration status 0=new, 1=in registration 2=completed',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive 1=active 2=suspended 3=archive',
  `created` datetime DEFAULT current_timestamp() COMMENT 'created time',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `last_update_retrieval` datetime DEFAULT NULL COMMENT 'last update_retrieval',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user_id of the updater',
  `creator_id` int(11) DEFAULT NULL COMMENT 'user_id of the creator',
  `bi` varchar(1024) DEFAULT NULL COMMENT 'blind index',
  `userlevel` int(11) DEFAULT NULL COMMENT 'level of the user (access rights)',
  `infinite_votes` int(11) DEFAULT NULL COMMENT '0=inactive 1= active (this user has infinite votes)',
  `last_login` datetime DEFAULT NULL COMMENT 'date of last login',
  `presence` int(11) NOT NULL DEFAULT 1 COMMENT '0 = user is absent, 1= user is present',
  `absent_until` datetime DEFAULT NULL COMMENT 'date until the user is absent',
  `auto_delegation` int(11) NOT NULL DEFAULT 0 COMMENT '1=on, 0=off',
  `trustee_id` int(11) DEFAULT NULL COMMENT 'id of the trusted user',
  `o1` int(11) DEFAULT NULL,
  `o2` int(11) DEFAULT NULL,
  `o3` int(11) DEFAULT NULL,
  `consents_given` int(11) NOT NULL DEFAULT 0 COMMENT 'consents given',
  `consents_needed` int(11) NOT NULL DEFAULT 0 COMMENT 'needed consents',
  `temp_pw` varchar(256) DEFAULT NULL COMMENT 'temp pw for user',
  `pw_changed` int(11) NOT NULL DEFAULT 0 COMMENT 'user has changed his initial pw',
  `refresh_token` tinyint(1) NOT NULL DEFAULT 0 COMMENT 'refresh token request',
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '[]' COMMENT 'roles of the user' CHECK (json_valid(`roles`)),
  PRIMARY KEY (`id`),
  UNIQUE KEY `au_users_basedata_sso_sub_unique` (`sso_sub`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `au_users_basedata`
--

LOCK TABLES `au_users_basedata` WRITE;
/*!40000 ALTER TABLE `au_users_basedata` DISABLE KEYS */;
INSERT INTO `au_users_basedata` VALUES
(1,'Admin User','Admin User','admin','admin@aula.de',NULL,NULL,NULL,NULL,NULL,'$2y$12$JbYwIAhr/QfHha84BkKp4OZ34cfFO6rB6DlFbMraUXa9ezHAvP9IC',NULL,'h9g2wNyPqRE5tCly3HgITV1Cgbnmmrjz',NULL,2,1,'2026-05-19 09:39:54','2026-05-19 09:39:54',NULL,NULL,NULL,NULL,50,NULL,NULL,1,NULL,0,NULL,NULL,NULL,NULL,0,0,NULL,1,0,'[]'),
(2,'Tech Admin','Tech Admin','tech_admin','tech@aula.de',NULL,NULL,NULL,NULL,NULL,'$2y$12$AflBkOIId5p89zmVn236Se4DmsTVcltx0/9S1jAHIpX3o5Z1bfske',NULL,'OD92Sikl2B0h8298jx8sqztyu69Z653S',NULL,2,1,'2026-05-19 09:39:54','2026-05-19 09:39:54',NULL,NULL,NULL,NULL,50,NULL,NULL,1,NULL,0,NULL,NULL,NULL,NULL,0,0,NULL,1,0,'[]');
/*!40000 ALTER TABLE `au_users_basedata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `au_users_settings`
--

DROP TABLE IF EXISTS `au_users_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_users_settings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT 'id of the user',
  `external_service_login` int(11) DEFAULT NULL COMMENT 'SSO / OAuth2 login 0=no 1=yes',
  `created` datetime DEFAULT NULL,
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update',
  `updater_id` int(11) DEFAULT NULL COMMENT 'user id of the updater',
  `external_service_id` int(11) DEFAULT NULL COMMENT 'id of the used service for authentication',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `au_votes`
--

DROP TABLE IF EXISTS `au_votes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `au_votes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT 'id of voting user',
  `idea_id` int(11) DEFAULT NULL COMMENT 'id of idea',
  `vote_value` int(11) DEFAULT NULL COMMENT 'value of the vote (-1, 0, +1)',
  `status` int(11) DEFAULT NULL COMMENT '0=inactive, 1=active, 2= temporarily suspended',
  `created` datetime DEFAULT current_timestamp() COMMENT 'time of first creation',
  `last_update` datetime DEFAULT NULL ON UPDATE current_timestamp() COMMENT 'last update on this dataset',
  `hash_id` varchar(1024) DEFAULT NULL COMMENT 'hash id of the vote',
  `vote_weight` int(11) DEFAULT NULL COMMENT 'absolute value for given votes',
  `number_of_delegations` int(11) DEFAULT NULL COMMENT 'number of delegated votes included',
  `comment` varchar(2048) DEFAULT NULL COMMENT 'Comment that the user added to a vote',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES
(1,'0001_01_01_000000_create_users_table',1),
(2,'0001_01_01_000001_create_cache_table',1),
(3,'2025_11_12_133121_create_oauth_auth_codes_table',1),
(4,'2025_11_12_133122_create_oauth_access_tokens_table',1),
(5,'2025_11_12_133123_create_oauth_refresh_tokens_table',1),
(6,'2025_11_12_133124_create_oauth_clients_table',1),
(7,'2025_11_12_133125_create_oauth_device_codes_table',1),
(8,'2026_01_28_000001_create_legacy_aula_tables',1),
(9,'2026_04_14_000001_add_sso_sub_to_users_table',1),
(10,'2026_04_15_000001_add_sso_provider_to_users_table',1),
(11,'2026_04_27_000001_add_sso_id_token_to_users_table',1),
(12,'2026_04_27_000002_add_sso_refresh_token_to_users_table',1),
(13,'2026_04_27_000003_add_sso_idp_id_token_to_users_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oauth_access_tokens`
--

DROP TABLE IF EXISTS `oauth_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_access_tokens` (
  `id` char(80) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `client_id` uuid NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `scopes` text DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_access_tokens_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oauth_auth_codes`
--

DROP TABLE IF EXISTS `oauth_auth_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_auth_codes` (
  `id` char(80) NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `client_id` uuid NOT NULL,
  `scopes` text DEFAULT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_auth_codes_user_id_index` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oauth_clients`
--

DROP TABLE IF EXISTS `oauth_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_clients` (
  `id` uuid NOT NULL,
  `owner_type` varchar(255) DEFAULT NULL,
  `owner_id` bigint(20) unsigned DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `secret` varchar(255) DEFAULT NULL,
  `provider` varchar(255) DEFAULT NULL,
  `redirect_uris` text NOT NULL,
  `grant_types` text NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_clients_owner_type_owner_id_index` (`owner_type`,`owner_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oauth_device_codes`
--

DROP TABLE IF EXISTS `oauth_device_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_device_codes` (
  `id` char(80) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `client_id` uuid NOT NULL,
  `user_code` char(8) NOT NULL,
  `scopes` text NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `user_approved_at` datetime DEFAULT NULL,
  `last_polled_at` datetime DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `oauth_device_codes_user_code_unique` (`user_code`),
  KEY `oauth_device_codes_user_id_index` (`user_id`),
  KEY `oauth_device_codes_client_id_index` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oauth_refresh_tokens`
--

DROP TABLE IF EXISTS `oauth_refresh_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `oauth_refresh_tokens` (
  `id` char(80) NOT NULL,
  `access_token_id` char(80) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-05-19  9:41:47
