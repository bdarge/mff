import {FoodFacilityService} from '../../services/FoodFacilityService'
import {Repository} from '../../data/Repository'
import {FoodTruckCollection} from '../../models/FoodTruckCollection'
import assert from 'assert'

describe('service', function () {
    let data = [{
        'locationId': 35634,
        'facilityType': 'truck',
        'block': '3452'
    }, {
        'locationId': 454675,
        'facilityType': 'truck',
        'block': '65876'
    }]

    let repo = {
        getFoodTruck(locationId: number) {
            const value = data.find(d => d.locationId === locationId)
            return Promise.resolve(value)
        },
        getFoodTrucks(block: string, limit: number, offset: number) {
            return Promise.resolve({
                metadata: {
                    resultset: {
                        offset: offset,
                        limit: limit,
                        count: 2
                    }
                }, results: data
            } as FoodTruckCollection)
        }
    } as Repository

    it('should return paged data', async function () {
        const service: FoodFacilityService = new FoodFacilityService(repo)
        assert.deepEqual(await service.getFoodTrucks(),
            {
                metadata: {
                    resultset: {
                        offset: 0,
                        limit: 10,
                        count: 2
                    }
                }, results: data
            } as FoodTruckCollection)
    })

    it('should return a food truck', async function () {
        const service = new FoodFacilityService(repo)
        assert.deepEqual(await service.getFoodTruckByLocationId(454675), data[1])
    })
})