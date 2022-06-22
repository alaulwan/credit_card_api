import express from 'express'

// Load environment variables from the file .env
import env from './load_dot_env.js' // eslint-disable-line

import routes from './src/routes/routers.js'
import generateSwagger from './swaggerGenerator.js'

const app = express()
const port = process.env.PORT

// app.use(express.json())

app.use('/', routes)


app.get('/', (req, res) => {
	res.send('Hello')
})


await generateSwagger(app, port)

app.listen(port, () => console.log(`Server running on port: http://localhost:${port}`))
