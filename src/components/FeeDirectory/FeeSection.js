import React, { Component } from 'react';
import styles from './styles.css';

class FeeSection extends Component {
	onClick() {
		this.props.onClick(this.props.label);
	};
	
	render() {
		const {
		  onClick,
		  props: { isOpen, label, fullPage}
		} = this;
		const current_fees = JSON.parse(this.props.fee.current_fees);
		return (
		  	<div>
			  	{!fullPage && <div className={`${styles['operation-layout']} row`}
					style={{
						background: isOpen ? '#fff' : '#f5f5f5'
					}}>
					<div className="col-sm-10" onClick={onClick.bind(this)} style={{ cursor: 'pointer' }}>
						{label}
					</div>
					<div className={`${styles['arrow']} col-sm-1`} onClick={onClick.bind(this)}>
						{!isOpen && <span>&#9650;</span>}
						{isOpen && <span>&#9660;</span>}
					</div>
					{isOpen && (
						<div className={`${styles['fee-layout']}`}>
							{Object.keys(current_fees).map(function(key, value) {
								return (<div>
									<span>{key}</span>
									<span> : </span>
									<span>{Object.keys(JSON.parse(current_fees[key])).length === 0 && JSON.parse(current_fees[key]).constructor === Object ? current_fees[key] : 'No Information Available'}</span>
								</div>
								);
							})}
						</div>
					)}
				</div>}
				{fullPage && <div className={`${styles['operation-layout']}`}
					style={{
						background: isOpen ? '#fff' : '#f5f5f5'
					}}>
					<div onClick={onClick.bind(this)} style={{ cursor: 'pointer' }}>
						{label}
						<div style={{float: 'right'}} onClick={onClick.bind(this)}>
							{!isOpen && <span>&#9650;</span>}
							{isOpen && <span>&#9660;</span>}
						</div>
					</div>
					{isOpen && (
						<div className={`${styles['fee-layout']}`}>
							{Object.keys(current_fees).map(function(key, value) {
								return (<div>
									<span>{key}</span>
									<span> : </span>
									<span>{current_fees[key]}</span>
								</div>
								);
							})}
						</div>
					)}
				</div>}
		  	</div>
		);
	}
}

export default FeeSection;