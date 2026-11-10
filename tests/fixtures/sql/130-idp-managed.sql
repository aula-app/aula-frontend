-- Layered on 120-seed.sql: the student becomes an SSO user, class 1A a synced room,
-- plus a synced room the student is not in and a local room.
UPDATE `au_users_basedata` SET idp_user_id = 'e2e-idp-student' WHERE hash_id = 'e2e.user.20.student';
-- Phase durations set: the room form cannot save a room whose durations are NULL.
UPDATE `au_rooms` SET idp_group_id = 'e2e-idp-group-1a', phase_duration_1 = 14, phase_duration_3 = 14 WHERE hash_id = '1a';

INSERT INTO `au_rooms` (id, room_name, description_internal, hash_id, status, type, idp_group_id) VALUES
(3, 'e2e.idp_class_2B', NULL, 'idp2b', 1, 0, 'e2e-idp-group-2b'),
(4, 'e2e.local_room', NULL, 'local', 1, 0, NULL);
