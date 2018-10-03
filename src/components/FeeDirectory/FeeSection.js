import React, { Component } from 'react';
import styles from './styles.css';

class FeeSection extends Component {
	onClick() {
		this.props.onClick(this.props.label);
	};
	
	render() {
		const {
		  onClick,
		  props: { isOpen, label}
		} = this;
	
		const current_fees = JSON.parse(this.props.fee.current_fees);
		return (
		  	<div className={`${styles['operation-layout']}`}
				style={{
					background: isOpen ? '#fff' : '#f5f5f5'
				}}>
				<div onClick={onClick.bind(this)} style={{ cursor: 'pointer' }}>
			  		{label}
			  		<div style={{ float: 'right' }}>
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
		  	</div>
		);
	}
}

export default FeeSection;