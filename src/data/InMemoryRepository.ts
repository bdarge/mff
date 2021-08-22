import {Repository} from './Repository'
import {FoodTruck} from '../models/FoodTruck'
import {FoodTruckCollection} from '../models/FoodTruckCollection'
import {Read} from './inMemoryDataHelper'
import NodeCache from 'node-cache'

const CACHE_KEY = 'MF_DATA'

export class InMemoryRepository implements Repository {
    cache: NodeCache

    constructor(cache?: NodeCache) {
        this.cache = cache || new NodeCache()
    }

    /**
     * inserts a new food truck
     * @param foodTruck
     */
    async createFoodTruck(foodTruck: FoodTruck): Promise<number> {
        let all = await this._getDatabase()
        let sorted = all.sort((a, b) => a.locationId - b.locationId)
        foodTruck.locationId = sorted[sorted.length - 1].locationId++
        all.push(foodTruck)
        // update cache
        this._updateCache(all)
        return Promise.resolve(foodTruck.locationId)
    }

    /**
     * all a food truck based on locationId
     * @param locationId
     */
    async getFoodTruck(locationId: number): Promise<FoodTruck | undefined> {
        const all = await this._getDatabase()
        return all.find((item: FoodTruck) => item.locationId === locationId)
    }
    
    /**
     * get food trucks by block
     * @param block optional block identifier
     * @param limit list limit, default is 10
     * @param offset list offset, default is 0
     */
    async getFoodTrucks(block: string='', limit: number=10, offset: number=0): Promise<FoodTruckCollection> {
        let all = await this._getDatabase()

        // filter data if block is passed
        if (block) {
            all = all.filter(a => a.block === block)
        }

        // calculate actual limit and offset
        const index = limit * offset
        const end = index + limit < all.length ? index + limit : all.length

        // return a FoodTruckCollection object
        return {
            'metadata': {
                'resultset': {
                    'count': all.length,
                    'offset': offset,
                    'limit': limit
                }
            },
            'results': all.slice(index, end)
        } as FoodTruckCollection
    }

    private async _getDatabase(): Promise<FoodTruck[]>{
            let data = this.cache.get<FoodTruck[]>(CACHE_KEY)
            if(!data) {
            data = await Read()
            this.cache.set(CACHE_KEY, data)
        }
        return data
    }

    private _updateCache(all: FoodTruck[]) {
        this.cache.set(CACHE_KEY, all)
    }
}
