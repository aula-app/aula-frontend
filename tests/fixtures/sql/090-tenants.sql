-- TODO: very likely remove this

INSERT INTO `tenants` 

    (id, name, api_base_url, contact_info, school_type_id,
    admin1_name, admin1_username, admin1_email, admin1_init_pass_url,
    admin2_name, admin2_username, admin2_email, admin2_init_pass_url,
    instance_code, is_name_public, jwt_key,
    sso_enabled, sso_provider, sso_idp_config, idp_school_id, idp_migration_status, idp_import_status, idp_import_rooms, idp_import_users, idp_import_error, idp_import_started_at, idp_import_finished_at, sso_force_logout, sso_required, sso_require_email_verified,
    created_at, updated_at,
    data)

VALUES
    ('0f57367a-9827-4829-84b5-2debfe8d984a', 'TEST.0', 'http://127.0.0.1:3000', NULL, NULL, 
    'Admin Adminović', 'admin', 'dev+e2e-admin@aula.de', NULL,
    'Admin II. Adminović', 'admin2', 'dev+e2e-admin2@aula.de', NULL,
    'TEST0', 1, 'PqJuKa4NWbAr8k36UDtDFpXS2eWMfwUxVsYXjr2QbbeMGXN1E7Mt3lte6WQjgwvi',
    0, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, 1, 0, 1,
    NOW(), NOW(),
    CONCAT('{',
        '"created_at": "', CAST(NOW() AS CHAR), '", ',
        '"updated_at": "', CAST(NOW() AS CHAR), '", ',
        '"tenancy_db_name": "tenant_', '0f57367a-9827-4829-84b5-2debfe8d984a', '", ',
        '"tenancy_db_username": "aula_user",',
        '"tenancy_db_password": "example"',
        '}')
    ),

    ('1f57367a-9827-4829-84b5-2debfe8d984a', 'TEST.1', 'http://127.0.0.1:3000', NULL, NULL, 
    'Admin Adminović', 'admin', 'dev+e2e-admin@aula.de', NULL,
    'Admin II. Adminović', 'admin2', 'dev+e2e-admin2@aula.de', NULL,
    'TEST1', 1, 'PqJuKa4NWbAr8k36UDtDFpXS2eWMfwUxVsYXjr2QbbeMGXN1E7Mt3lte6WQjgwvi',
    0, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, 1, 0, 1,
    NOW(), NOW(),
    CONCAT('{',
        '"created_at": "', CAST(NOW() AS CHAR), '", ',
        '"updated_at": "', CAST(NOW() AS CHAR), '", ',
        '"tenancy_db_name": "tenant_', '1f57367a-9827-4829-84b5-2debfe8d984a', '", ',
        '"tenancy_db_username": "aula_user",',
        '"tenancy_db_password": "example"',
        '}')
    ),

    ('2f57367a-9827-4829-84b5-2debfe8d984a', 'TEST.2', 'http://127.0.0.1:3000', NULL, NULL, 
    'Admin Adminović', 'admin', 'dev+e2e-admin@aula.de', NULL,
    'Admin II. Adminović', 'admin2', 'dev+e2e-admin2@aula.de', NULL,
    'TEST2', 1, 'PqJuKa4NWbAr8k36UDtDFpXS2eWMfwUxVsYXjr2QbbeMGXN1E7Mt3lte6WQjgwvi',
    0, NULL, NULL, NULL, NULL, NULL, 0, 0, NULL, NULL, NULL, 1, 0, 1,
    NOW(), NOW(),
    CONCAT('{',
        '"created_at": "', CAST(NOW() AS CHAR), '", ',
        '"updated_at": "', CAST(NOW() AS CHAR), '", ',
        '"tenancy_db_name": "tenant_', '2f57367a-9827-4829-84b5-2debfe8d984a', '", ',
        '"tenancy_db_username": "aula_user",',
        '"tenancy_db_password": "example"',
        '}')
    )

ON DUPLICATE KEY UPDATE

    id=VALUES(id), name=VALUES(name), api_base_url=VALUES(api_base_url), contact_info=VALUES(contact_info), school_type_id=VALUES(school_type_id),
    admin1_name=VALUES(admin1_name), admin1_username=VALUES(admin1_username), admin1_email=VALUES(admin1_email), admin1_init_pass_url=VALUES(admin1_init_pass_url),
    admin2_name=VALUES(admin2_name), admin2_username=VALUES(admin2_username), admin2_email=VALUES(admin2_email), admin2_init_pass_url=VALUES(admin2_init_pass_url),
    instance_code=VALUES(instance_code), is_name_public=VALUES(is_name_public), jwt_key=VALUES(jwt_key),
    sso_enabled=VALUES(sso_enabled), sso_provider=VALUES(sso_provider), sso_idp_config=VALUES(sso_idp_config), idp_school_id=VALUES(idp_school_id), idp_migration_status=VALUES(idp_migration_status), idp_import_status=VALUES(idp_import_status), idp_import_rooms=VALUES(idp_import_rooms), idp_import_users=VALUES(idp_import_users), idp_import_error=VALUES(idp_import_error), idp_import_started_at=VALUES(idp_import_started_at), idp_import_finished_at=VALUES(idp_import_finished_at), sso_force_logout=VALUES(sso_force_logout), sso_required=VALUES(sso_required), sso_require_email_verified=VALUES(sso_require_email_verified),
    created_at=VALUES(created_at), updated_at=VALUES(updated_at),
    data=VALUES(data)
;
