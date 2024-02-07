import { MongoClient } from 'mongodb'

let clientPromise: Promise<MongoClient> | undefined
let mongoClient: MongoClient

const getClient = async () => {  
    if (mongoClient){
        return mongoClient
    }

    const uri = process.env.MONGODB_URI
    if (!uri) {
        throw new Error('Add Mongo URI to .env.local')
    }

    if (!clientPromise){
        console.log("connecting to mongo")
        const mongo = new MongoClient(uri)
        clientPromise = mongo.connect()
        console.log("mongo promise created")
    }

    mongoClient = await clientPromise
    console.log("connected to mongo")
    return mongoClient
}

export const nashDb = async () => {
    const client = await getClient()

    return client.db()
}