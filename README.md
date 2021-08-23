# Mobile Food Facility API
The purpose of this api is to manage mobile food truck stations in a given city. The API can be used to add, find a food truck by location id, and list all food trucks by block. To test out the API, we use mobile food truck stations' data of the city of San Francisco. 

## Assumptions and consideration
- The API should be deployed in a micro-service architecture on the cloud. To that goal a `Dockerfile` is provided to
  an image.
- The API uses in-memory database which can be replaced easily with a database as the
  repository implements an interface `Repository`.
- `locationId` is considered as a primary field. 

## Technologies
The following technologies are used:
- The api is implemented using [nodejs](https://nodejs.org/en/) with typescript, and [express](https://expressjs.com/).
  nodejs is one of the ideal choices to quickly set up an api for micro-service environment.
- `node-cache` is used for in-memory database
- For now only `applicant`, and `facilityType` are made required when inserting food truck.
- logging is provided by `winston` along with `morgan` to log http logs.

## Usage

To run the app in development run `npm run dev`. Use REST client or `curl` to test it.  

- To add a new food truck
  ```
    curl --header "Content-Type: application/json"  \
         --request POST   --data '{"applicant":"binyam","facilityType":"truck"}' \ 
           http://localhost:3000/food-truck
  ```

- To retrieve a food truck based on `locationId` field
  ```
    curl http://localhost:3000/food-truck/1514023
  ```

- To get all food trucks around a block.
  By default, the api returns `10` trucks which can be changed by providing query
  params `limit` and `offset`.
  ```
    curl http://localhost:3000/food-truck?block=3507
  ```

## Test
- To run a unit test do,
```console
  npm run test
```
- To run an integration test do
```console
  npm run integration_test
```

## Deployment

As we mentioned above the app will be deployed in a micro-service environment, which mean we need an image to spin off
containers. In the current effort we provided a dockerfile to create an image based on `node:alpine` base image. We also
added `docker-compose` files to test the container in a local setting.

The production deployment can be tested locally using `docker-compose` as follows.

```console
   docker-compose -f docker-compose.yml -f docker-compose-prod.yml up -d
```

## TODO
- Add the additional REST http verbs such as `PATCH`, and `DELETE`.
- Add a custom token to track api requests in logs.
- Implement token based authorization, and authentication.
- Add more validation and test on post data.
- Include appropriate API documentation using tools such as swagger.
- Use a database with appropriate optimization which handles millions of records. Nosql
  databases such as mongodb can be a good candidate.