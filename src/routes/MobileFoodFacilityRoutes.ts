import express from 'express'
import Logger from '../helpers/logger'
import {MobileFoodFacilityService} from '../services/MobileFoodFacilityService'
import validate from '../helpers/foodTruckFacilityValidator'
import {validationResult} from 'express-validator/check'

export class MobileFoodFacilityRoutes {
    name: string
    service: MobileFoodFacilityService
    router: express.Router

    constructor(service: MobileFoodFacilityService) {
        this.service = service
        this.name = 'MobileFoodFacilityRoutes'
        this.router = express.Router()
    }

    /**
     * GET /food-truck?block=[optional]&offset=[default=0]&limit=[default=10]
     * @param req
     * @param res
     */
    async getFoodTrucks(req: express.Request, res: express.Response) {
        let offset: number = 0
        let limit: number = 10

        if(req.query.offset) {
            offset = parseInt(<string>req.query.offset)
            if (offset < 0) {
                Logger.error('offset should be positive number.')
                return res.status(400).send({
                    code: 400,
                    userMessage: 'offset should be positive number.'
                })
            }
        }

        if(req.query.limit) {
            limit = parseInt(<string>req.query.limit)
            if (limit < 0) {
                Logger.error('limit should be positive number.')
                return res.status(400).send({
                    code: 400,
                    userMessage: 'limit should be positive number.'
                })
            }
        }

        const block = req.query.block || ''
        try {
            const result = await this.service.getFoodTrucks(block.toString(), limit, offset)
            res.status(200).json(result)
        } catch(e) {
            Logger.error(e.message)
            res.status(500).send({
                code: 500,
                userMessage: 'Failed to process request.'
            })
        }
    }

    /**
     * get food truck by location id
     * @param req
     * @param res
     */
    async getFoodTruckByLocationId(req: express.Request, res: express.Response) {
        try {
            const id: number = parseInt(req.params.id)
            const data = await this.service.getFoodTruckByLocationId(id)
            res.status(200).send(data)
        } catch (e) {
            Logger.error(e.message)
            res.status(500).send({
                code: 500,
                userMessage: 'Failed to process request.'
            })
        }
    }

    /**
     * inserts a new truck and return the location id
     * @param req
     * @param res
     */
    async create(req: express.Request, res: express.Response) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).send({
                    status: 400,
                    userMessage: errors.array()
                })
            }
            const id = await this.service.insertFoodTruck(req.body)
            res.status(201).send({locationId: id})
        } catch (e) {
            Logger.error(e.message)
            res.status(500).send({
                code: 500,
                userMessage: 'Failed to process request.'
            })
        }
    }

    getRoute () {
        this.router
            .get('/',
                (req : express.Request, res : express.Response) => this.getFoodTrucks(req, res))
            .post('/',
                validate('create'),
                (req : express.Request, res : express.Response) => this.create(req, res))
            .get('/:id',
                (req : express.Request, res : express.Response) => this.getFoodTruckByLocationId(req, res))

        Logger.info(`${this.name} routes configured.`)

        return this.router
    }
}