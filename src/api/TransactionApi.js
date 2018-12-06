import axios from 'axios';
import * as Constants from '../constants/constants'; 

const TransactionApi = {

	/**
   * Return a list of blocks
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
   * Return a list of sorted blocks by column, with limit restriction
   *
   * @param {string} column - The column to sort by
   * @param {string} direction - ASC or DESC
   * @param {string} x - x in LIMIT X, Y
   * @param {string} y - y in LIMIT X, Y
   * @param {string} last - The last block to sort from
   */

	getTransactionsId(id) {
		const query = `/api/transactions/recent?id=${id}&limit=10`;

		return new Promise(async (resolve, reject) => {
			const response = await axios.get(query);
			return resolve(response);
		  });
	},
   
	/**
   * Return last block from the DB
   *
   */

	getLastBlock() {
		return new Promise(async (resolve, reject) => {
			const response = await axios.get('api/blocks/last');
			return resolve(response);
		  });
	},
	/**
   * Return the length of the blockchain
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
  