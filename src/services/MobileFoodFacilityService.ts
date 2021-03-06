import {Repository} from '../data/Repository'
import {FoodTruck} from '../models/FoodTruck'

export class MobileFoodFacilityService {
    repository: Repository

    constructor(repository: Repository) {
        this.repository = repository
    }

    async getFoodTrucks(block: string= '', limit: number=10, offset: number=0) {
        return this.repository.getFoodTrucks(block, limit, offset)
    }

    async getFoodTruckByLocationId(locationId: number) {
        return this.repository.getFoodTruck(locationId)
    }

    insertFoodTruck(foodTruck: FoodTruck) {
        return this.repository.createFoodTruck(foodTruck)
    }
}