import React, { Component } from 'react';
import styles from './styles.css';

class SidePanel extends Component {
	closeMenu() {
		console.log('click');
		document.querySelector('.sliding-menu').style.left = '-100%';
	  }
	
	  render() {
		return (
		  <div className={`sliding-menu ${styles['sliding-menu']}`}>
			<div className="container ">
			  <div className="row d-flex justify-content-center">
					<p> COMPONENT 1 </p>
			  </div>
			</div>
			<div className="container mt-3 text-white">
			  <a
				href="javascript:void(0)"
				onClick={this.closeMenu.bind(this)}
				className="d-flex align-items-center"
			  >
				<i className="fas fa-chevron-left mr-2" />
				<span className="text-uppercase text-bold text-small">Close</span>
			  </a>
			</div>
			<div className="container mt-4">
			  
			</div>
		  </div>
		);
	  }
}

export default SidePanel; 