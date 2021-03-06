import pg from 'pg'
const { Pool } = pg

const {
	POSTGRES_DB_USERNAME: user,
	POSTGRES_DB_PASS: password,
	POSTGRES_DB_NAME: database,
	POSTGRES_DB_HOST: host,
	POSTGRES_DB_PORT: port
} = process.env

const pool = new Pool({
	user,
	password,
	database,
	host,
	port
})

export default class PostgresDB {
	static async getCompanies(){
		try {
			const response = await pool.query('SELECT * FROM companies')
			return response?.rows?.length ? response.rows : []
		} catch (error) {
			return error
		}
	}

	static async getCompanyById(companyId){
		try {
			const response = await pool.query('SELECT * FROM companies WHERE company_id=$1', [companyId])
			return response?.rows?.length ? response.rows[0] : undefined
		} catch (error) {
			return error
		}
	}

	static async getCreditCardsByCompanyId(companyId){
		try {
			const response = await pool.query('SELECT * FROM creditcards WHERE company_id=$1', [companyId])
			return response?.rows?.length ? response.rows : []
		} catch (error) {
			console.log(error)
			return error
		}
	}

	static async getCreditInfoForCompany(companyId){
		try {
			const company = await this.getCompanyById(companyId)
			if(!company) return undefined

			const creditcards = await this.getCreditCardsByCompanyId(companyId)
			if(!creditcards) return company

			const cardsInfoPromises = creditcards.map(async (creditcard) => {
				const invoices = await this.getInvoicesByCardId(creditcard.creditcard_id)
				const transactions = await this.getTransactionsByCardId(creditcard.creditcard_id)
				return {
					...creditcard,
					invoices,
					transactions
				}
			})

			const cardsInfo = await Promise.all(cardsInfoPromises)

			return {
				...company,
				cardsInfo
			}
		} catch (error) {
			return error
		}
	}

	static async getCreditCardById(creditCardId){
		try {
			const response = await pool.query('SELECT * FROM creditcards WHERE creditcard_id=$1', [creditCardId])
			return response?.rows?.length ? response.rows[0] : undefined
		} catch (error) {
			return error
		}
	}

	static async setCardStatus(creditCardId, activateStatus){
		try {
			await pool.query('UPDATE creditcards SET activated=$2 WHERE creditcard_id=$1', [creditCardId, activateStatus])
			return this.getCreditCardById(creditCardId)
		} catch (error) {
			return error
		}
	}

	static async getInvoicesByCardId(creditCardId){
		try {
			const response = await pool.query('SELECT * FROM invoices WHERE creditcard_id=$1', [creditCardId])
			return response?.rows?.length ? response.rows : []
		} catch (error) {
			return error
		}
	}

	static async getTransactionsByCardId(creditCardId){
		try {
			const response = await pool.query('SELECT * FROM transactions WHERE creditcard_id=$1', [creditCardId])
			return response?.rows?.length ? response.rows : []
		} catch (error) {
			return error
		}
	}

	static async getInvoiceById(invoiceId){
		try {
			const response = await pool.query('SELECT * FROM invoices WHERE invoice_id=$1', [invoiceId])
			return response?.rows?.length ? response.rows[0] : undefined
		} catch (error) {
			return error
		}
	}

	static async getTransactionsByInvoiceId(invoiceId){
		try {
			const response = await pool.query('SELECT * FROM transactions WHERE invoice_id=$1', [invoiceId])
			return response?.rows?.length ? response.rows : []
		} catch (error) {
			return error
		}
	}
}
