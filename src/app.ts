import express from 'express'
import * as http from 'http'
import config from 'config'

import Logger from './helpers/logger'
import morganMiddleware from './middleware/morgan'
import {MobileFoodFacilityService} from './services/MobileFoodFacilityService'
import {InMemoryRepository} from './data/InMemoryRepository'
import NodeCache from 'node-cache'
import {MobileFoodFacilityRoutes} from './routes/MobileFoodFacilityRoutes'

const app: express.Application = express()
export const server: http.Server = http.createServer(app)
const port = config.get('port') || 3000

// parse incoming request body to json
app.use(express.json())

// HTTP request logger middleware for node.js
app.use(morganMiddleware)

// initialise InMemoryRepository
const repository = new InMemoryRepository(new NodeCache())

// initialize MobileFoodFacilityService
const svc = new MobileFoodFacilityService(repository)

//initialize mobileFoodFacilityRoutes
const mobileFoodFacilityRoutes = new MobileFoodFacilityRoutes(svc)

app.use('/food-truck', mobileFoodFacilityRoutes.getRoute())

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server running at http://localhost:${port}`)
})

server.listen(port, () => {
    Logger.debug(`Server is listening at ${port}.`)
})

// exit gracefully if the server stopped unexpectedly
process.on('uncaughtException', function (err) {
    Logger.error((new Date).toUTCString() + ' uncaughtException:', err.message)
    Logger.error(err.stack)
    process.exit(1)
})