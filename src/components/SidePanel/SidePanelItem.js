import React, { Component, Fragment } from 'react';
import styles from './styles.css';

export default class SidePanelItem extends Component {

	renderButtons(props, minSize) {
		return (
			<Fragment>
				<div className="col-2 offset-1">
					{this.props.minSize !== 'small' ? <button onClick={() => props.changeSize(this.props.id, 'small')} disabled className="btn btn-sm">S</button> 
						: <button onClick={() => props.changeSize(this.props.id, 'small')} className="btn btn-sm">S</button>
					}
				</div>
				<div className="col-2 offset-1">
					{this.props.minSize === 'large' ? <button onClick={() => props.changeSize(this.props.id, 'medium')} className="btn btn-sm" disabled>M</button>
						:  <button onClick={() => props.changeSize(this.props.id, 'medium')} className="btn btn-sm">M</button> 
					}
				</div>
				<div className="col-2 offset-1">
					<button onClick={() => props.changeSize(this.props.id, 'large')} className="btn btn-sm">L</button>
				</div>
			</Fragment>
		);
	}

	render() {
		return (
			<tr>
				<td> 
					<div className="row text-center">
						<div className="col-8">
							{this.props.name}
							<div className="row text-center mt-2">
								{this.renderButtons(this.props, this.props.minSize)}
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