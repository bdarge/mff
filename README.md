# Mobile Food Facility API
The purpose of this api is to manage mobile food truck stations in a given city. The API can be used to add, find a food truck by location id, and list all food trucks by block. To test out the API, we use mobile food truck stations' data of the city of San Francisco. 

## Assumptions and consideration
- The API should be deployed in a micro-service architecture on the cloud. To that goal a `Dockerfile` is provided to
  an image.
- The API uses in-memory database which can be replaced easily with a database as the
  repository implements an interface `Repository`.
- `locationId` is considered as a primary field. 