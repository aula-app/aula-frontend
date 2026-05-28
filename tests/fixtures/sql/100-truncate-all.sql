-- WARNING: TRUNCATE permanently removes all rows and resets AUTO_INCREMENT. Backup first if needed.

-- Disable foreign key checks so truncates succeed even with FK constraints
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE `au_systemlog`;
TRUNCATE TABLE `au_system_global_config`;
TRUNCATE TABLE `au_system_current_state`;
TRUNCATE TABLE `au_rel_users_triggers`;
TRUNCATE TABLE `au_rel_users_media`;
TRUNCATE TABLE `au_rel_user_user`;
TRUNCATE TABLE `au_rel_topics_media`;
TRUNCATE TABLE `au_rel_topics_ideas`;
TRUNCATE TABLE `au_rel_rooms_users`;
TRUNCATE TABLE `au_rel_rooms_media`;
TRUNCATE TABLE `au_rel_ideas_media`;
TRUNCATE TABLE `au_rel_ideas_comments`;
TRUNCATE TABLE `au_rel_groups_users`;
TRUNCATE TABLE `au_rel_groups_media`;
TRUNCATE TABLE `au_rel_categories_rooms`;
TRUNCATE TABLE `au_rel_categories_media`;
TRUNCATE TABLE `au_rel_categories_ideas`;
TRUNCATE TABLE `au_users_settings`;
TRUNCATE TABLE `au_users_basedata`;
TRUNCATE TABLE `au_user_levels`;
TRUNCATE TABLE `au_votes`;
TRUNCATE TABLE `au_triggers`;
TRUNCATE TABLE `au_topics`;
TRUNCATE TABLE `au_texts`;
TRUNCATE TABLE `au_services`;
TRUNCATE TABLE `au_rooms`;
TRUNCATE TABLE `au_roles`;
TRUNCATE TABLE `au_reported`;
TRUNCATE TABLE `au_phases_global_config`;
TRUNCATE TABLE `au_messages`;
TRUNCATE TABLE `au_media`;
TRUNCATE TABLE `au_likes`;
TRUNCATE TABLE `au_ideas`;
TRUNCATE TABLE `au_groups`;
TRUNCATE TABLE `au_delegation`;
TRUNCATE TABLE `au_consent`;
TRUNCATE TABLE `au_comments`;
TRUNCATE TABLE `au_commands`;
TRUNCATE TABLE `au_change_password`;
TRUNCATE TABLE `au_categories`;
TRUNCATE TABLE `au_activitylog`;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
