import {FoodTruck} from '../models/FoodTruck'
import * as fs from 'fs'
import config from 'config'
import camelCase from 'camelcase'

const DATA_FILE_PATH = `${__dirname}/${config.get('localDbFilePath') as string}`
const CHUNK = 1000000

/**
 * read csv file asynchronous using stream, and return well parsed array of food trucks.
 * @constructor
 */
export async function Read(): Promise<FoodTruck[]> {
    // need to consider all seniors when parsing csv file, to that end I am using a regex pattern
    const pattern = new RegExp('(?:,|\\n|^)("(?:(?:"")*[^"]*)*"|[^",\\n]*|(?:\\n|$))')

    const stream = fs.createReadStream(DATA_FILE_PATH, {highWaterMark: CHUNK})

    let headers: any
    let database: FoodTruck[] = []

    for await(const raw of stream) {
        const data = raw.toString().trim().split(/\r?\n/)
        data.map((line: string) => {
            if (!headers) {
                headers = line.trim().split(pattern).filter(h => h)
                // clean up the headers
                for (let index in headers) {
                    // remove all non-alphanumeric characters
                    headers[index] = headers[index].replace(/[^a-zA-Z\d\s:]/g, ' ')
                    // use camelCase
                    headers[index] = camelCase(headers[index])
                    if (headers[index] === 'locationid') {
                        headers[index] = 'locationId'
                    }
                }
            } else {
                let obj = {} as FoodTruck
                line.trim().split(pattern)
                    .filter(i => i)
                    .forEach((item, index) => {
                        // convert locationId to number
                        obj[headers[index]] = index == 0 ? parseInt(item) : item
                    })
                database.push(obj as FoodTruck)
            }
        })
    }
    return database
}