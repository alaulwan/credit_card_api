import express from 'express'

import companiesRoutes from './companies.js'
import creditcarsdRoutes from './creditcards.js'
import invoicesRoutes from './invoices.js'

const router = express.Router()

router.use('/companies', companiesRoutes)
router.use('/creditcards', creditcarsdRoutes)
router.use('/invoices', invoicesRoutes)

export default router