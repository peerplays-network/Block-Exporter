import axios from 'axios';
import * as Constants from '../constants/constants'; 

const BlockApi = {

	/**
   * Return a list of blocks
   *
   * @param {string} start - first block to retrieve
   * @param {string} end - last block to retrieve
   * @param {string} direction - ASC or DESC, defaults to ASC if none is supplied
   */

	getBlocks(start, end, direction = 'ASC') {
		const query = `api/blocks?start=${start}&end=${end}&direction=${direction}`;

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

	getBlocksLimited(column, direction, x, y, last) {
		const query = `api/blocks/sorted?sort=${column}&direction=${direction}&x=${x}&y=${y}&last=${last}`;

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

	getBlockLength() {
		return new Promise(async (resolve, reject) => {
			const response = await axios.get('api/blocks/length');
			return resolve(response);
		  });
	},

};
  
export default BlockApi;
  