import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';

class PaginationCall extends Component {
	constructor(e) {
		super();
		this.changeHandler = this.changeHandler.bind(this);
	}

	changeHandler(e, i) {
		if (typeof this.props.handleClick === 'function') {
			this.props.handleClick(e, i);
		}
	}

	withinOne(i) {
		if (i === 0 || i === this.props.currentPage || i+1 === this.props.currentPage || i-1 ===this.props.currentPage) {
			return <PaginationLink onClick={e => this.changeHandler(e, i)} href="#"> {i + 1} </PaginationLink>;
		}
		else{
			return '';
		}
	}

	render() {
		return (
			<Pagination aria-label="Page navigation example">
				<PaginationItem disabled={this.props.currentPage <= 0}>
					<PaginationLink
						onClick={e => this.changeHandler(e, this.props.currentPage - 1)}
						previous href="#"
					/>
				</PaginationItem>
				{[...Array(this.props.pagesCount)].map((page, i) =>
					<PaginationItem active={i === this.props.currentPage} key={i}>
						{ this.withinOne(i) }
					</PaginationItem>
				)}
				<PaginationItem disabled={this.props.currentPage >= this.props.pagesCount - 1}>
					<PaginationLink
						onClick={e => this.changeHandler(e, this.props.currentPage + 1)}
						next href="#"
					/>
				</PaginationItem>
			</Pagination>
		);
	}
}

export default PaginationCall;