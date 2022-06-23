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
			const response = await pool.query('\
			SELECT *,tra.*, tra.invoice_id as tra_invoice_id, tra.amount as tra_amount FROM companies AS com \
			LEFT JOIN creditcards AS crd ON crd.company_id=com.company_id \
			LEFT JOIN invoices AS inv ON inv.creditcard_id=crd.creditcard_id \
			LEFT JOIN transactions AS tra ON tra.creditcard_id=crd.creditcard_id \
			WHERE com.company_id=$1'
			,[companyId])

			if(!response?.rows?.length) return undefined
			const rows = response.rows

			const result = {
				company_id: rows[0].company_id,
				company_name: rows[0].company_name,
				email: rows[0].email,
				cardsInfo: []
			}

			const cardsMap = new Map()
			const handledInvoice = []
			const handledTransaction = []
			rows.forEach((row) => {
				if (!row.creditcard_id) return

				let card = cardsMap.get(row.creditcard_id)
				if(!card){
					card = {
						creditcard_id: row.creditcard_id,
						card_number: row.card_number,
						card_limit: row.card_limit,
						activated: row.activated,
						invoices: [],
						transactions: []
					}
					result.cardsInfo.push(card)
					cardsMap.set(row.creditcard_id, card)
				}

				if (row.invoice_id && !handledInvoice.includes(row.invoice_id)){
					handledInvoice.push(row.invoice_id)
					const invoice = {
						invoice_id: row.invoice_id,
						invoice_date: row.invoice_date,
						due_date: row.due_date,
						amount: row.amount,
						paid: row.paid
					}
					card.invoices.push(invoice)
				}

				if (row.transaction_id && !handledTransaction.includes(row.transaction_id)){
					handledTransaction.push(row.transaction_id)
					const tra = {
						transaction_id: row.transaction_id,
						invoice_id: row.tra_invoice_id,
						transaction_data: row.transaction_data,
						transaction_date: row.transaction_date,
						amount: row.tra_amount
					}
					card.transactions.push(tra)
				}
			})

			return result
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
