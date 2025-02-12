mvn:
	mvn clean install

up:
	docker-compose -p poetry -f docker-compose.yml up -d

logs:
	docker logs -f poetry-ui-1

down:
	docker-compose -p poetry -f docker-compose.yml down --remove-orphans

build-up:
	make mvn
	make up
