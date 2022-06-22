DROP DATABASE IF EXISTS creditcard;
DROP USER IF EXISTS creditcard;

CREATE USER creditcard WITH PASSWORD 'creditcard';
CREATE DATABASE creditcard;
GRANT ALL PRIVILEGES ON DATABASE creditcard TO creditcard;

\c creditcard

CREATE TABLE creditcards (
   creditcard_id serial PRIMARY KEY,
   card_number VARCHAR(24) UNIQUE NOT NULL,
   card_limit  INT NOT NULL,
   activated BOOLEAN NOT NULL
);

CREATE TABLE invoices (
   invoice_id serial PRIMARY KEY,
   creditcard_id INT NOT NULL,
   invoice_date TIMESTAMP,
   due_date TIMESTAMP,
   amount DOUBLE PRECISION,
   paid BOOLEAN NOT NULL,
   FOREIGN KEY (creditcard_id) REFERENCES creditcards (creditcard_id)
);

CREATE TABLE transactions (
   transaction_id serial PRIMARY KEY,
   creditcard_id INT NOT NULL,
   invoice_id INT,
   transaction_data VARCHAR(50) NOT NULL,
   transaction_date TIMESTAMP NOT NULL,
   amount DOUBLE PRECISION,
   FOREIGN KEY (creditcard_id) REFERENCES creditcards (creditcard_id),
   FOREIGN KEY (invoice_id) REFERENCES invoices (invoice_id)
);

CREATE TABLE companies (
   company_id serial PRIMARY KEY,
   company_name VARCHAR(50) UNIQUE NOT NULL,
   email VARCHAR ( 255 ) UNIQUE NOT NULL,
   creditcard_id INT,
   FOREIGN KEY (creditcard_id) REFERENCES creditcards (creditcard_id)
);

INSERT INTO creditcards (creditcard_id, card_number, card_limit, activated)
VALUES
	(1, '1111 1111 1111 1111 1111', 10000, TRUE),
	(2, '2222 2222 2222 2222 2222', 10000, FALSE);

INSERT INTO invoices (invoice_id, creditcard_id, invoice_date, due_date, amount, paid)
VALUES
	(1, 1, '2022-02-01T16:34:02', '2022-02-28T16:34:02', 3500, FALSE),
	(2, 2, '2022-05-01T16:34:02', '2022-05-30T16:34:02', 1000, FALSE);

INSERT INTO transactions (transaction_id, creditcard_id, invoice_id, transaction_data, amount, transaction_date)
VALUES
	(1, 1, 1, 'ALAA', 500, '2022-01-01T16:34:02'),
	(2, 1, 1, 'ICA', -4028.1, '2022-01-02T16:34:02'),
	(3, 1, NULL, 'IKEA', -34.34, '2022-02-03T16:34:02'),
	(4, 2, 2, 'AA', 1000, '2022-04-01T16:34:02'),
	(5, 2, 2, 'ICA', -2001.1, '2022-04-02T16:34:02');



INSERT INTO companies (company_id, company_name, email, creditcard_id)
VALUES
	(1, 'Alaa', 'alaa@gmail.com', 1),
    (2, 'AA', 'aa@gmail.com', 2);

GRANT ALL PRIVILEGES ON TABLE creditcards TO creditcard;
GRANT ALL PRIVILEGES ON TABLE invoices TO creditcard;
GRANT ALL PRIVILEGES ON TABLE transactions TO creditcard;
GRANT ALL PRIVILEGES ON TABLE companies TO creditcard;