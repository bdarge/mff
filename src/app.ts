import express from 'express'
import * as http from 'http'
import config from 'config'

import Logger from './helpers/logger'
import morganMiddleware from './middleware/morgan'

const app: express.Application = express()
export const server: http.Server = http.createServer(app)
const port = config.get('port') || 3000

// parse incoming request body to json
app.use(express.json())

// HTTP request logger middleware for node.js
app.use(morganMiddleware)

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(`Server running at http://localhost:${port}`)
})

server.listen(port, () => {
    Logger.debug(`Server is listening at ${port}.`)
})

process.on('uncaughtException', function (err) {
    Logger.error((new Date).toUTCString() + ' uncaughtException:', err.message)
    Logger.error(err.stack)
    process.exit(1)
})