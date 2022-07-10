# node-service-starter-ts-mongo

Typescript node starter with:

- Typescript 4
- express
- eslint
- env-cmd for environment management
- morgan for api logging
- MongoDB

### Start app local dev
```
make start-dev
```

#### Start MongoDB for local dev
```
docker-compose up -d
```
---

## this branch:

exploring [cockatiel](https://www.npmjs.com/package/cockatiel) as a api fault-handling library for Retry, Circuit Breaker, Timeout, Bulkhead Isolation, and Fallback

- Retry examples completed:

  - `handleAll` simplest to use. be aware of over eager in retrying all types of failure for frequent retries. 
  
  - `handleWhenResult` useful in most scenarios. To only retry certain http error codes or other conditions based on the result. Checks against results passed up to cockatiel. Need to return both response and error back up. And then let cockatiel throw retry failures.

  - `handleType` check against error object's instance type by constructor. Might be useful to if there is middleware or request library throwing custom error types such as NetworkError or HttpError for example. Otherwise, `Error` type would always be valid for all the different JS error types by inheritance.

  - `handleWhen` checks against any condition on the error object passed in. Unlike `handleType` we can specify specific filter conditions. Useful to check beyond `Error` instance, like error.name or message if tightly coupling is not a concern. Example checks for not `SyntaxError` and `ReferenceError`.

  - `handleResultType` a kind of combination of `handleWhenResult` and `handleType`. It checks against result passed up to cockatiel but then only checks against that object's instance type by constructor. Example creates a custom `ApiRemoteError` class based on status code range. And have cockatiel policy only retry error of that type. It can be very useful beyond `handleWhenResult` if we intend on retrying a range of http failures.

  Summary: Consider `handleAll` for simple one-time retry. Consider `handleWhenResult` for very limited retry cases like one http error code. Consider `handleResultType` for grouping retries by custom class.

- Timeout example completed:
  - `aggressive policy` immediate errors/aborts when the timeout MS is reached