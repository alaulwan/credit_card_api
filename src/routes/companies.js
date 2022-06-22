import express from 'express'

import DB from '../db/db.js'

const router = express.Router()

router.get('/', async (req, res) => {
	const result = await DB.getCompanies()
	res.send(result)
})

router.get('/:id', async (req, res) => {
	const { id } = req.params
	const company = await DB.getCompanyById(id)
	if(company){
		return res.send(company)
	}
	res.status(404).send('NOT FOUND')
})

router.get('/:id/creditcards', async (req, res) => {
	const { id } = req.params
	const creditcard = await DB.getCreditCardsByCompanyId(id)
	if(creditcard){
		return res.send(creditcard)
	}
	res.status(404).send('NOT FOUND')
})

router.get('/:id/credit_info', async (req, res) => {
	const { id } = req.params
	const creditInfo = await DB.getCreditInfoForCompany(id)
	if(creditInfo){
		return res.send(creditInfo)
	}
	res.status(404).send('NOT FOUND')
})

export default router