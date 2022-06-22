import dotenv from 'dotenv'

const { POSTGRES_DB_HOST } = process.env
dotenv.config()

// Restore the host address in case already set by docker-compose
process.env.POSTGRES_DB_HOST = POSTGRES_DB_HOST || process.env.POSTGRES_DB_HOST

export default process.env
