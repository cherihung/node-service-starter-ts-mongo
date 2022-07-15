start-mongo:
	docker-compose up -d

end-mongo:
	docker-compose down
	
start-dev: start-mongo
	yarn start

test-breaker:
	ab -k -c 10 -n 50000 http://localhost:8080/breaker_sampling