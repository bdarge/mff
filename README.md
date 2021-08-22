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

## Usage

To run the app in development run `npm run dev`. Use REST client to test it.  

- To add a new food truck
  ```
    POST Http://{baseurl}/food-truck
    Body {locationId: '',Applicant: '',FacilityType: '', ...}
  ```

- To retrieve a food truck based on `locationId` field
  ```
    GET Http://{baseurl}/food-truck/:locationId
  ```

- To get all food trucks around a block.
  By default, the api returns `10` trucks which can be changed by providing query
  params `limit` and `offset`.
  ```
    GET Http://{baseurl}/food-truck?blockId={provide id}
  ```