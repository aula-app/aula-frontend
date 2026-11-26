-- Layered on 120-seed.sql: users with a school-wide role who are only members of the
-- standard room, plus a room without any members.
INSERT INTO `au_users_basedata`
(
  id, displayname, realname, username, email,
  pw, hash_id,
  userlevel, about_me, registration_status, status, created, last_update, presence, pw_changed, roles
)
VALUES
(
  5, 'e2e.supermod', 'Supermod Supermodić', 'supermod', 'dev+e2e-supermod@aula.de',
  '$2a$04$AgQajDMd4MKQcMSW3nNphuO9jRxU.udCk5DYzecof7u/Tl1Ax.atC', 'e2e.user.40.supermod',
  40, 'e2e test super moderator', 2, 1, NOW(), NOW(), 1, 1, '[{"room": "std", "role": 40}]'
),
(
  6, 'e2e.supermod_v', 'Supermod V. Supermodić', 'supermod_v', 'dev+e2e-supermod-v@aula.de',
  '$2a$04$AgQajDMd4MKQcMSW3nNphuO9jRxU.udCk5DYzecof7u/Tl1Ax.atC', 'e2e.user.41.supermod_v',
  41, 'e2e test super moderator with voting rights', 2, 1, NOW(), NOW(), 1, 1, '[{"room": "std", "role": 41}]'
),
(
  7, 'e2e.principal', 'Principal Principalić', 'principal', 'dev+e2e-principal@aula.de',
  '$2a$04$AgQajDMd4MKQcMSW3nNphuO9jRxU.udCk5DYzecof7u/Tl1Ax.atC', 'e2e.user.44.principal',
  44, 'e2e test auditor', 2, 1, NOW(), NOW(), 1, 1, '[{"room": "std", "role": 44}]'
),
(
  8, 'e2e.principal_v', 'Principal V. Principalić', 'principal_v', 'dev+e2e-principal-v@aula.de',
  '$2a$04$AgQajDMd4MKQcMSW3nNphuO9jRxU.udCk5DYzecof7u/Tl1Ax.atC', 'e2e.user.45.principal_v',
  45, 'e2e test auditor with voting rights', 2, 1, NOW(), NOW(), 1, 1, '[{"room": "std", "role": 45}]'
);

INSERT INTO `au_rel_rooms_users`
(room_id, user_id, status, created, last_update, updater_id)
VALUES
(1, 5, 1, NOW(), NOW(), 1),
(1, 6, 1, NOW(), NOW(), 1),
(1, 7, 1, NOW(), NOW(), 1),
(1, 8, 1, NOW(), NOW(), 1);

INSERT INTO `au_rooms` (id, room_name, description_internal, hash_id, status, type) VALUES
(3, 'e2e.class_2B', 'e2e test room without members', '2b', 1, 0);
