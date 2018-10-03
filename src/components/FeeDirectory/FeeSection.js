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
		console.log(current_fees);
		return (
		  	<div
				style={{
					background: isOpen ? '#fff' : '#f5f5f5',
					border: '1px solid #666',
					padding: '5px 10px',
				}}
			>
				<div onClick={onClick.bind(this)} style={{ cursor: 'pointer' }}>
			  		{label}
			  		<div style={{ float: 'right' }}>
						{!isOpen && <span>&#9650;</span>}
						{isOpen && <span>&#9660;</span>}
			  		</div>
				</div>
				{isOpen && (
					<div
						style={{
							background: '#f5f5f5',
							border: '1px solid #666',
							marginTop: 10,
							padding: '10px 20px',
						}}
					>
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