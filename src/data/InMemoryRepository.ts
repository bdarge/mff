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

    createFoodTruck(foodTruck: FoodTruck): Promise<number> {
        return Promise.resolve(0);
    }

    getFoodTruck(locationId: number): Promise<FoodTruck | undefined> {
        return Promise.resolve(undefined);
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
}
