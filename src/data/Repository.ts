import {FoodTruck} from '../models/FoodTruck'
import {FoodTruckCollection} from '../models/FoodTruckCollection'

export interface Repository {
    createFoodTruck(foodTruck: FoodTruck): Promise<number>
    getFoodTruck(locationId: number): Promise<FoodTruck | undefined>
    getFoodTrucks(block: string, limit: number, offset: number): Promise<FoodTruckCollection>
}