import {InMemoryRepository} from '../../data/InMemoryRepository'
import * as assert from 'assert'
import {FoodTruck} from '../../models/FoodTruck'

describe('In-memory repository', function () {
    describe('read', () => {
        it('should fetch data with default offset and limit', async function () {
            const repo = new InMemoryRepository()
            const r = await repo.getFoodTrucks()
            assert.ok(r.results.length > 0)
            assert.equal(r.metadata.resultset.offset, 0)
            assert.equal(r.metadata.resultset.limit, 10)
        })

        it('should fetch data when block is passed', async function () {
            const repo = new InMemoryRepository()
            const r = await repo.getFoodTrucks('3721')
            assert.ok(r.results.length > 0)
            assert.ok(r.results.filter(r => r.block !== '3721').length === 0)
            assert.equal(r.metadata.resultset.offset, 0)
            assert.equal(r.metadata.resultset.limit, 10)
        })
    })

    describe('create', function () {
        it('should create a new cvs item', async function () {
            const repo = new InMemoryRepository()
            const r = await repo.createFoodTruck({
                applicant: 'Swedish',
                facilityType: 'Truck'
            } as FoodTruck)

            assert.ok(r)
            // verify
            const result = await repo.getFoodTruck(r)
            assert.ok(result)
            assert.equal(result.locationId, r)
        })
    })
})