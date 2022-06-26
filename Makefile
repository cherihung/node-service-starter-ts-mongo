start-mongo:
	docker-compose up -d

end-mongo:
	docker-compose down
	
start-dev: start-mongo
	yarn start
