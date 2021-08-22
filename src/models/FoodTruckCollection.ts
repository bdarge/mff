import {FoodTruck} from './FoodTruck'

// food truck collection metadata
export interface Metadata {
    resultset: {
        offset: number
        limit: number
        count: number
    }
}

// capture food truck collection
export interface FoodTruckCollection {
    metadata: Metadata
    results: FoodTruck[]
}