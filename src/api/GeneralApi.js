import axios from 'axios';

const SortApi = {

	/**
   * Return a list of blocks
   *
   * @param {string} start - first block to retrieve
   * @param {string} end - last block to retrieve
   * @param {string} direction - ASC or DESC, defaults to ASC if none is supplied
   */

	sort(apiName, colType, sortType) {//accounts
		const query = `/api/${apiName}?sort=${colType}&direction=${sortType.toUpperCase()}`;
		return new Promise(async (resolve, reject) => {
			const response = await axios.get(query);
			return resolve(response);
		});
	}
};

export default SortApi;