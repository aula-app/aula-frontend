.PHONY: xdebug-v2-docker-setup
xdebug-v2-docker-setup:
	docker compose exec backend-v2 true
	docker compose exec backend-v2 sh -c 'apk add php84-pecl-xdebug; echo -e "zend_extension=/usr/lib/php84/modules/xdebug.so\nxdebug.mode=develop,debug\nxdebug.start_with_request=yes\nxdebug.client_host=host.docker.internal\nxdebug.client_port=9013\ndefault_socket_timeout=600" > /usr/local/etc/php/conf.d/docker-xdebug.ini'
	docker compose exec backend-v2 sh -c 'composer require --dev -m phpunit/phpunit ^12'
	docker compose restart backend-v2
	docker compose exec backend-v2 php -i | grep xdebug.client_
	@echo "Note: ephemeral, might need to rerun after docker compose restart/up/down!"

.PHONY: xdebug-v2-docker-check
xdebug-v2-docker-check:
	docker compose exec backend-v2 php -i \
		| grep -E 'xdebug.(client_|start_with_request|mode)'
	@echo "VSCode/launch.json expects host:docker-internal:9013 mode=develop,debug start_with_request=yes"

.PHONY: xdebug-v2-cli-check
xdebug-v2-cli-check:
	php -i \
		| grep -E 'xdebug.(client_|start_with_request|mode)'
	./artisan tinker --execute 'phpinfo();' \
		| grep -E 'xdebug.(client_|start_with_request|mode)'
	@echo "VSCode/launch.json expects localhost:9003 mode=develop,debug start_with_request=yes"

.PHONY: xdebug-legacy-docker-check
xdebug-legacy-docker-check:
	docker compose exec backend-v2 php -i \
		| grep -E 'xdebug.(client_|start_with_request|mode)'
	@echo "VSCode/launch.json expects host:docker-internal:9003 mode=develop,debug start_with_request=yes"