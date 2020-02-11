import axios from 'axios';
import GeneralUtils from '../components/Utility/GeneralUtils';
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
			return resolve(response.data);
		});
	},
   
	sortWithRank(tableData, apiName, colType, sortType) {
		const query = `/api/${apiName}?sort=${colType}&direction=${sortType.toUpperCase()}`;
		return new Promise(async (resolve, reject) => {
			if(colType === 'rank') {
				const rankedList = GeneralUtils.sortByRank(tableData, sortType);
				resolve(rankedList);
			} else {
				const response = await axios.get(query);
				const rankedRes = response.data.map(object => {
					const rankObject = tableData.find(el => el.id === object.id);
					return rankObject;
				});
				return resolve(rankedRes);
			}
		});
	},
};

export default SortApi;