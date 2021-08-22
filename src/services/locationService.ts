import {Repository} from '../data/Repository'

export class LocationService {
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
}