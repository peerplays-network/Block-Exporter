import React, { Component } from 'react';
import {Container, Card, CardContent, Table, TableBody, TableRow, TableCell, Button} from '@material-ui/core';
import {NavigateBefore as PreviousIcon, NavigateNext as NextIcon} from '@material-ui/icons';
import styles from './styles.css';

export default class BlockItem extends Component {
	renderBlockTable() {
		const {currentBlock, witnessName} = this.props;
		const time = new Date(currentBlock.timestamp).toLocaleDateString() + ' ' + new Date(currentBlock.timestamp).toLocaleTimeString();

		return (
			<Container className={`${styles['block-item-container']}`} maxWidth="lg"> 
				<Card>
					<h1 className={`${styles['header-contrast-text']} ${styles['header-background']}`}>
						<span className={`fa fa-cube ${styles['header-icon']}`}>&nbsp;</span>
						Block {currentBlock.block_number}
					</h1>
					<div className={`${styles['block-item-buttons']}`}>
						<Button size="medium" variant="contained"
							disabled={this.props.prevDisabled}
							onClick={this.props.prevBlockClicked}>
							<PreviousIcon/>
						</Button>
						<Button size="medium" variant="contained"
							disabled={this.props.nextDisabled}
							onClick={this.props.nextBlockClicked}>
							<NextIcon/>
						</Button>
					</div>
					<CardContent>
						<Table responsive>
							<TableBody>
								<TableRow hover>
									<TableCell className={`${styles['text-bold']}`}>Time: </TableCell>
									<TableCell className={`${styles['text-center']}`}>{time.toString()}</TableCell>
								</TableRow>
								<TableRow hover>
									<TableCell className={`${styles['text-bold']}`}>Witness Name: </TableCell>
									<TableCell className={`${styles['text-center']}`}>{witnessName}</TableCell>
								</TableRow>
								<TableRow hover>
									<TableCell className={`${styles['text-bold']}`}>Witness Id: </TableCell>
									<TableCell className={`${styles['text-center']}`}>{currentBlock.id}</TableCell>
								</TableRow>
								<TableRow hover>
									<TableCell className={`${styles['text-bold']}`}>Transaction Count: </TableCell>
									<TableCell className={`${styles['text-center']}`}>{currentBlock.transaction_count}</TableCell>
								</TableRow>
								<TableRow hover>
									<TableCell className={`${styles['text-bold']}`}>Operation Count: </TableCell>
									<TableCell className={`${styles['text-center']}`}>{currentBlock.operation_count}</TableCell>
								</TableRow>
								<TableRow hover>
									<TableCell className={`${styles['text-bold']}`}>Previous Block Hash: </TableCell>
									<TableCell className={`${styles['text-center']}`}>{currentBlock.previous_block_hash}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</Container>
		);
	}

	renderErrorOrLoading() {
		if(this.props.error)
			return <h1 className={`${styles['text-center']}`}>Unable to load block, please try again</h1>;
		else {
			return (
				<div> </div>
			);
		}
	}

	render() {
		return (
			!!this.props.currentBlock ? this.renderBlockTable() : this.renderErrorOrLoading()
		);
	}
}