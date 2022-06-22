import express from 'express'

import DB from '../db/db.js'

const router = express.Router()

router.get('/:id', async (req, res) => {
	const { id } = req.params
	const creditcard = await DB.getCreditCardById(id)
	if(creditcard){
		return res.send(creditcard)
	}
	res.status(404).send('NOT FOUND')
})

router.get('/:id/invoices', async (req, res) => {
	const { id } = req.params
	const invoices = await DB.getInvoicesByCardId(id)
	return res.send(invoices)
})

router.get('/:id/transactions', async (req, res) => {
	const { id } = req.params
	const transactions = await DB.getTransactionsByCardId(id)
	return res.send(transactions)
})

export default router