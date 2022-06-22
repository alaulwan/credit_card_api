import swaggerAutogen from 'swagger-autogen'

export default async function generateSwagger(app, port){
	const doc = {
		info: {
			title: 'My API',
			description: 'Description',
		},
		host: `localhost:${port}`,
		schemes: ['http'],
	}
      
	const outputFile = './swagger-output.json'
	const endpointsFiles = ['./src/routes/routers.js']
      
	await swaggerAutogen()(outputFile, endpointsFiles, doc)
	const swaggerRoutes = (await import('./src/routes/swagger.js')).default
	app.use('/swagger', swaggerRoutes)
}

