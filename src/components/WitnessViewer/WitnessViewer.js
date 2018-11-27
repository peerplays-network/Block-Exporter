import React, { Component, Fragment } from 'react';
import WitnessRow from './WitnessRow';
import axios from 'axios';
import styles from './styles.css';
import PaginationCall from '../Account/PaginationCall';
import { Input, InputGroup} from 'reactstrap';
import { connect } from 'react-redux'; 

class WitnessViewer extends Component {
	constructor(props) {
		super(props);
		this.state = {topFiveWitnessData: !!this.props.witnesses ? this.props.witnesses.slice(0, 5) : [], witnessData: !!this.props.witnesses ? this.props.witnesses : [], searchData: !!this.props.witnesses ? this.props.witnesses : [], witness: '', currentPage: 0, pageSize: 3, pagesCount: 0, sortType: 'ASC', sortBy: 'rank'};
		this.gridHeight = 25;
	}

	componentDidMount() {
		let newState = this.state.searchData.sort((a, b) => (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0)).reverse();
		
		if(this.state.sortType === 'ASC')
		{
			newState = newState.reverse();
		}
		this.setState({searchData: newState});
		!!this.props.witnesses ? this.refreshPagination(this.props.witnesses) : this.refreshPagination([]);
		
		if(this.props.history ===undefined)
			this.props.calculateComponentHeight(this.props.id, this.gridHeight);
	}

	componentDidUpdate(prevProps) {
		if(this.props.witnesses !== prevProps.witnesses) {
			this.setState({witnessData: this.props.witnesses, searchData: this.props.witnesses, topFiveWitnessData: this.props.witnesses.slice(0, 5)});
			this.refreshPagination(this.props.witnesses);
		}
	}

	refreshPagination (data) {
		this.setState({pagesCount: Math.ceil(data.length / this.state.pageSize) });
		this.setState({currentPage: 0});
	}

	onWitnessEnter(e) {
		e.preventDefault();
		this.setState({witness: e.target.value});
		if(e.target.value.includes('1.6.'))
			this.findAccountById(e.target.value, this.state.witnessData);
		else
			this.findAccountByName(e.target.value, this.state.witnessData);
	}

	sortSearch(witness, data) {
		if(witness.includes('1.6.'))
			this.findAccountById(witness, data);
		else
			this.findAccountByName(witness, data);
	}

	findAccountByName(witness, data) {
		var temp_data = [];
		temp_data = data.filter(obj => {
			return obj.account_name.includes(witness);
		  });
		this.setState({ searchData: temp_data });
		this.refreshPagination(temp_data);
	}

	findAccountById(witness, data) {
		var temp_data = [];
		temp_data = data.filter(obj => {
			return obj.account_id === (witness);
		  });
		this.setState({ searchData: temp_data });
		this.refreshPagination(temp_data);
	}

	changePage(e, index) {
		e.preventDefault();
		this.setState({ currentPage: index  });
	}

	sortByColumn(colType) {
		let sortType = this.state.sortType;
		if(this.state.sortBy === colType)
		{
			sortType === 'DESC' ? sortType='ASC': sortType='DESC';
		}
		this.setState({sortType:sortType, sortBy:colType});
		/*sorts depending on the column type. Also does a lookup on the witness data which
		  stores the initial API call made when the component is loaded and witness rank is calculated.
		the witness rank is the appended to the data coming in from the sort API call.*/
		axios.get(`api/witnesses?sort=${colType}&direction=${sortType}`, {
		}).then(response => {
			let sortedWitnessData = response.data;
			sortedWitnessData = sortedWitnessData.map(object => {
				const rankObject = this.state.witnessData.find(el => el.id === object.id);
				return rankObject;
			});
			//this.setState({searchData: sortedWitnessData});
			this.sortSearch(this.state.witness, sortedWitnessData);
			//this.refreshPagination(sortedWitnessData);
		}).catch(error => {console.log('error fetching witness data', error);});
	}

	sortByColumnSmall(colType) {
		let sortType = this.state.sortType;
		let sortedList = [];
		if(this.state.sortBy === colType)
		{
			sortType === 'DESC' ? sortType='ASC': sortType='DESC';
		}
		this.setState({sortType:sortType, sortBy:colType});

		switch(colType) {
			case 'account_name':
				sortedList = this.state.topFiveWitnessData.sort( (a, b) => {return (''+a.account_name.localeCompare(b.account_name));});
				break;
			case 'total_votes':
				sortedList = this.state.topFiveWitnessData.sort((a, b) => (a.total_votes > b.total_votes) ? 1 : ((b.total_votes > a.total_votes) ? -1 : 0));
				break;
			case 'total_missed':
				sortedList = this.state.topFiveWitnessData.sort((a, b) => (a.total_missed > b.total_missed) ? 1 : ((b.total_missed > a.total_missed) ? -1 : 0));
				break;
			case 'url':
				sortedList = this.state.topFiveWitnessData.sort( (a, b) => {return (''+a.url.localeCompare(b.url));});
				break;
			default :
				break;

		}
		
		if(sortedList.length === 5) {
			sortType === 'ASC' ? this.setState({topFiveWitnessData: sortedList.reverse()}) : this.setState({topFiveWitnessData: sortedList}) ;
		}
	}

	sortByRank(tableSize) {
		let sortType = this.state.sortType;
		if(this.state.sortBy === 'rank')
		{
			sortType === 'DESC' ? sortType='ASC': sortType='DESC';
		}
		let newState = tableSize === 'big' ? this.state.searchData.sort((a, b) => (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0)).reverse() : this.state.topFiveWitnessData.sort((a, b) => (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0)).reverse();;
		
		if(this.state.sortType === 'ASC')
		{
			newState = newState.reverse();
		}
		tableSize === 'big' ? this.setState({searchData: newState, sortType:sortType, sortBy:'rank', currentPage: 0}) : this.setState({topFiveWitnessData: newState, sortType:sortType, sortBy:'rank', currentPage: 0});
	}

	renderBigTable() {
		const { currentPage, witness, searchData, pageSize } = this.state;

		return (
			<div>
				{!!this.props.history ? // browse all witness page
					<div className="container pt-0 pb-5 mt-5">
						<Fragment>
							<div className="pagination-wrapper"> 
								<InputGroup>
									<Input type="text" value={witness} onChange={this.onWitnessEnter.bind(this)} placeholder="Witness" />
								</InputGroup>
								<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
							</div>
							<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-2 pb-3 mt-0`}>
								<span className="fa fa-balance-scale">&nbsp;</span>Browse Witnesses</h1>

							<table className="table">
								<thead className={`${styles['clickable']} ${styles['header-contrast-text']} ${styles['header-contrast-text']} ${styles['witness-header']} ${styles['nowrap']}`}>
									<tr>
										<th onClick={this.sortByRank.bind(this, 'big')} scope="col">Rank</th>
										<th onClick={this.sortByColumn.bind(this, 'account_name')} scope="col">Witness Name</th>
										<th onClick={this.sortByColumn.bind(this, 'total_votes')} scope="col">Votes</th>
										<th onClick={this.sortByColumn.bind(this, 'total_missed')} scope="col">Misses</th>
										<th onClick={this.sortByColumn.bind(this, 'url')} scope="col">URL</th>
									</tr>
								</thead>
								{searchData && <tbody>
									{searchData.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((witness) => {
										return <WitnessRow
											key={witness.id}
											rank={witness.rank}
											witness={witness.account_name}
											votes={witness.total_votes}
											misses={witness.total_missed}
											account_id={witness.account_id}
											lastBlock={witness.url}
										/>;
									})}
								</tbody>}
							</table>{searchData.length===0 && <div> No Witnesses Found </div>}
						</Fragment>
					</div>
					:// witness widget
					<div className="container pt-0 pb-5 mt-0">
						<Fragment>
							<div className="pagination-wrapper mt-0"> 
								<InputGroup>
									<Input type="text" value={witness} onChange={this.onWitnessEnter.bind(this)} placeholder="Witness" />
								</InputGroup>
								<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
							</div>
							

							<table className="table">
								<thead className={`${styles['clickable']} ${styles['header-contrast-text']} ${styles['header-contrast-text']} ${styles['witness-header']} ${styles['nowrap']}`}>
									<tr>
										<th onClick={this.sortByRank.bind(this, 'big')} scope="col">Rank</th>
										<th onClick={this.sortByColumn.bind(this, 'account_name')} scope="col">Witness Name</th>
										<th onClick={this.sortByColumn.bind(this, 'total_votes')} scope="col">Votes</th>
										<th onClick={this.sortByColumn.bind(this, 'total_missed')} scope="col">Misses</th>
										<th onClick={this.sortByColumn.bind(this, 'url')} scope="col">URL</th>
									</tr>
								</thead>
								{searchData && <tbody>
									{searchData.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((witness) => {
										return <WitnessRow
											key={witness.id}
											rank={witness.rank}
											witness={witness.account_name}
											votes={witness.total_votes}
											misses={witness.total_missed}
											account_id={witness.account_id}
											lastBlock={witness.url}
										/>;
									})}
								</tbody>}
							</table>{searchData.length===0 && <div> No Witnesses Found </div>}
						</Fragment>
					</div>}
			</div>
						
			
		);
	}

	renderSmallTable() {
		const {topFiveWitnessData} = this.state;
		return (
			<Fragment>
				<table className="table">
					<thead className={`${styles['clickable']} ${styles['header-contrast-text']} ${styles['header-contrast-text']} ${styles['witness-header']} ${styles['nowrap']}`}>
						<tr>
							<th onClick={this.sortByRank.bind(this, 'small')} scope="col">Rank</th>
							<th onClick={this.sortByColumnSmall.bind(this, 'account_name')} scope="col">Witness Name</th>
							<th onClick={this.sortByColumnSmall.bind(this, 'total_votes')} scope="col">Votes</th>
							<th onClick={this.sortByColumnSmall.bind(this, 'total_missed')} scope="col">Misses</th>
							<th onClick={this.sortByColumnSmall.bind(this, 'url')} scope="col">URL</th>
						</tr>
					</thead>
					<tbody>
						{topFiveWitnessData.map((witness) => {
							return <WitnessRow
								key={witness.id}
								rank={witness.rank}
								witness={witness.account_name}
								votes={witness.total_votes}
								misses={witness.total_missed}
								lastBlock={witness.url}
								account_id={witness.account_id}
							/>;
						})}
					</tbody>
				</table>
			</Fragment>
		);
	}
	
	render() {
		return (
			<div>
				{this.props.size === 'small' ?
					this.renderSmallTable()
					:
					this.renderBigTable()
				}
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	witnesses: state.witnesses.witnessList
});

export default connect(mapStateToProps)(WitnessViewer);