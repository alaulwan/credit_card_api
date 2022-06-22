import express from 'express'

import DB from '../db/db.js'

const router = express.Router()
router.get('/:id', async (req, res) => {
	const {id } = req.params
	const invoice = await DB.getInvoiceById(id)
	if(invoice){
		return res.send(invoice)
	}
	res.status(404).send('NOT FOUND')
})

router.get('/:id/transactions', async (req, res) => {
	const { id } = req.params
	const transactions = await DB.getTransactionsByInvoiceId(id)
	return res.send(transactions)
})

export default router