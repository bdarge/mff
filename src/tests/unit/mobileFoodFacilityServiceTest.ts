import {MobileFoodFacilityService} from '../../services/MobileFoodFacilityService'
import {Repository} from '../../data/Repository'
import {FoodTruckCollection} from '../../models/FoodTruckCollection'
import assert from 'assert'
import {FoodTruck} from '../../models/FoodTruck'

describe('service', function () {
    const locationId = (new Date()).getTime()
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
        },
        createFoodTruck(foodTruck: FoodTruck) {
            foodTruck.locationId = locationId
            data.push(foodTruck)
            return Promise.resolve(foodTruck.locationId)
        }
    } as Repository

    it('should return paged data', async function () {
        const service: MobileFoodFacilityService = new MobileFoodFacilityService(repo)
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
        const service = new MobileFoodFacilityService(repo)
        assert.deepEqual(await service.getFoodTruckByLocationId(454675), data[1])
    })

    it('should create a food truck', async function () {
        const service = new MobileFoodFacilityService(repo)
        assert.equal(await service.insertFoodTruck({
            'facilityType': 'truck',
            'block': '3452'
        } as FoodTruck), locationId)
    })
})