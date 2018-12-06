import axios from 'axios';

const TransactionApi = {

	/**
   * Return a list of transactions
   *
   * @param {string} start - first block to retrieve
   * @param {string} end - last block to retrieve
   * @param {string} direction - ASC or DESC, defaults to ASC if none is supplied
   */

	getTransactions() {
		const query = '/api/transactions/recent?id=&limit=10';

		return new Promise(async (resolve, reject) => {
			const response = await axios.get(query);
			return resolve(response);
		});
	},

	/**
   * Return a list of transactions for id, with limit restriction
   *
   * @param {string} id - The column to sort by
   */

	getTransactionsId(id) {
		const query = `/api/transactions/recent?id=${id}&limit=10`;

		return new Promise(async (resolve, reject) => {
			const response = await axios.get(query);
			return resolve(response);
		  });
	},
   
	/**
   * Return all operations from the DB
   *
   */

	getOperations() {
		return new Promise(async (resolve, reject) => {
			const response = await axios.get('/api/operations/');
			return resolve(response);
		  });
	},
	/**
   * Return the length of the number of transactions
   *
   */

	getTransactionLength() {
		return new Promise(async (resolve, reject) => {
			const response = await axios.get('/api/transactions/length');
			return resolve(response);
		  });
	},

};
  
export default TransactionApi;
  