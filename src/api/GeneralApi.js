import axios from 'axios';
import GeneralUtils from '../components/Utility/GeneralUtils';
/**
   * Return a list sorted by column type
   *
   * @param {string} apiName - name of api you want to call (e.g accounts, witnesses, etc)
   * @param {string} colType - column name
   * @param {string} sortType - ASC or DESC, defaults to ASC if none is supplied
   */

export const sort = (apiName, colType, sortType) => {
	const query = `/api/${apiName}?sort=${colType}&direction=${sortType.toUpperCase()}`;
	return new Promise(async (resolve, reject) => {
		const response = await axios.get(query);
		return resolve(response.data);
	});
};

/**
   * Return a list sorted by column type
   * @param {string} tableData - tableData returned from calling the accounts/witnesses/etc api
   * @param {string} apiName - name of api you want to call (e.g accounts, witnesses, etc)
   * @param {string} colType - column name
   * @param {string} sortType - ASC or DESC, defaults to ASC if none is supplied
   */
export const sortWithRank = (tableData, apiName, colType, sortType) => {
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
};

export const getMaintenanceTime = () => {
	const query = 'api/variables/';
	return new Promise(async (resolve, reject) => {
		const response = await axios.get(query);
		resolve(response.data[0].value);
	});
};