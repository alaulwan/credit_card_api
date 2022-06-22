import express from 'express'
import swaggerUi from 'swagger-ui-express'

import swaggerSpec from '../../swagger-output.json'

const router = express.Router()
  
// Swagger page
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Docs in JSON format
router.get('/docs.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json')
	res.send(swaggerSpec)
})

console.log('Docs available at /swagger/docs')
console.log('Docs json available at /swagger/docs.json')

export default router