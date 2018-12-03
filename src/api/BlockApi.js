import axios from 'axios';
import * as Constants from '../constants/constants'; 

const BlockApi = {

	/**
   * Return a list of sorted blocks by column
   *
   * @param {string} column - The column to sort by
   * @param {string} direction - ASC or DESC
   * @param {string} x - x in LIMIT X, Y
   * @param {string} y - y in LIMIT X, Y
   * @param {string} last - The last block to sort from
   */
	getSortedBlocks(column, direction, x, y, last) {
		return new Promise(async (resolve, reject) => {
			const response = await axios.get(`api/blocks/sorted?sort=${column}&direction=${direction}&x=${x}&y=${y}&last=${last}`);
			return resolve(response);
		  });
	}
};
  
export default BlockApi;
  