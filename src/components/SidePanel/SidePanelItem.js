import React, { Component } from 'react';
import styles from './styles.css';

export default class SidePanelItem extends Component {
	render() {
		return (
			<tr>
				<td> 
					<div className="row text-center">
						<div className="col-8">
							{this.props.name}
							<div className="row text-center mt-2">
								<div className="col-2 offset-1">
									<button onClick={() => this.props.changeSize(this.props.id, 'small')} className="btn btn-sm">S</button>
								</div>
								<div className="col-2 offset-1">
									<button onClick={() => this.props.changeSize(this.props.id, 'medium')} className="btn btn-sm">M</button>
								</div>
								<div className="col-2 offset-1">
									<button onClick={() => this.props.changeSize(this.props.id, 'large')} className="btn btn-sm">L</button>
								</div>
							</div>
						</div>
						<div className="col-4">
							{this.props.img ? <img className={`${styles['side-image']}`} src={this.props.img} alt=""/>  : <span className={`${styles['dot']}`}></span>}
						</div>
					</div>
				</td>
			</tr>
		);
	}
}