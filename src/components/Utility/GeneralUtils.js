const GeneralUtils = {
	sortByRank(tableData, sortType) {
		const sortedByRankTable = tableData.sort((a, b) => (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0));
		if(sortType.toUpperCase() === 'DESC') {
			sortedByRankTable.reverse();
		}

		 return sortedByRankTable; 
	}
};

export default GeneralUtils;