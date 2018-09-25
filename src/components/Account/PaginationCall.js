import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import Account from './Account.css';

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
                        <PaginationLink onClick={e => this.changeHandler(e, i)} href="#">
                            {i + 1}
                        </PaginationLink>
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