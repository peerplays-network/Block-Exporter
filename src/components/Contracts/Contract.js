import React, { Component } from 'react';
import ContractRow from './ContractRow';
import PaginationCall from '../Account/PaginationCall';
import { Input, InputGroup } from 'reactstrap';
import { connect } from 'react-redux';

class Contract extends Component {
	constructor(e) {
		super(e);
		this.state = {
			data: this.props.contracts,
			temp_data: this.props.contracts,
			contract : '',
			currentPage: 0,
			pageSize: 5,
			pagesCount: 0
		};
		this.gridHeight = 43;
		//pagination set page length
		this.onContractEnter = this.onContractEnter.bind(this);
	}

	componentDidMount() {
		this.findData();
		if(this.props.id !== '') {
			this.props.calculateComponentHeight(this.props.id, this.gridHeight);
		}
	}
    
	findContract(contractName, data) {
		var temp_data = [];
		//if the data.id matches contractName add to data
		for (var contract in data) {
			if (data[contract].name.indexOf(contractName) >= 0 ) 
				temp_data.push(data[contract]);
		}
		// if (temp_data.length <= 0)
		// 	temp_data = data;
		this.setState({ temp_data: temp_data });
		this.refreshPagination(temp_data);
	}
	findData() {
		this.setState({pagesCount: this.props.contracts ? Math.ceil(this.props.contracts.length / this.state.pageSize) : 0, currentPage: 0 });
	}

	onContractEnter(e) {
		e.preventDefault();
		this.setState({ contract: e.target.value });
		this.findContract(e.target.value, this.state.data);
	}

	changePage(e, index) {
		e.preventDefault();
		this.setState({ currentPage: index });
	}

	render() {
		const { temp_data, contract, currentPage, pageSize } = this.state;
		
		return(
			<div className="table-responsive">
				<div className="pagination-wrapper">
					<InputGroup>
						<Input type="text" value={contract} onChange={this.onContractEnter.bind(this)} placeholder="Contract" />
					</InputGroup>
					<PaginationCall currentPage={currentPage} handleClick={this.changePage.bind(this)} pagesCount={this.state.pagesCount} />
				</div>
				<table className="table">
					<thead className="thead-light">
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Balance</th>
						</tr>
					</thead>
					<tbody>
						{temp_data && temp_data.slice( currentPage * pageSize, (currentPage + 1) * pageSize).map((contract, i) =>
							<ContractRow detail={contract} key={i}/>
						)}{temp_data.length===0 && <div> No Contracts Found </div>}
					</tbody>
				</table>
			</div>
		);
	}	
}

Contract.defaultProps = {
	id: '',
};

const mapStateToProps = (state) => ({
	contracts: state.contracts.contractList
});

export default connect(mapStateToProps)(Contract);