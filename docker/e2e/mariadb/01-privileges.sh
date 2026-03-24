#!/bin/bash

# Grant the aula_user broad privileges needed to create and manage tenant databases.
# This mirrors the setup in backend-aula/docker/mariadb/950_init-user-privileges.sh.
mariadb -u root -p"${MARIADB_ROOT_PASSWORD}" <<-EOSQL
    GRANT USAGE, ALTER, ALTER ROUTINE, CREATE, CREATE ROUTINE, CREATE TEMPORARY TABLES, CREATE USER, CREATE VIEW, DELETE, DROP, EVENT, EXECUTE, INDEX, INSERT, LOCK TABLES, REFERENCES, SELECT, SHOW VIEW, TRIGGER, UPDATE ON *.* TO '${MARIADB_USER}'@'%' WITH GRANT OPTION;
    FLUSH PRIVILEGES;
EOSQL
