import React, { Component, Fragment } from 'react';
import styles from './styles.css';

export default class SidePanelItem extends Component {
	constructor(e) {
		super(e);
		this.state = {
			active: '',
			name: '',
		};
	}

	activateButton(id, name) {
		this.setState({ active: id, name: name });
		this.props.changeSize(id, name);
	}

	renderButtons(props, minSize) {
		return (
			<Fragment>
				<div className="col-2 offset-1">
					{this.props.minSize !== 'small' ? <button onClick={() => this.activateButton(this.props.id, 'small')} disabled className={`${styles['disabled-widget-size']} btn btn-sm`}>S</button> 
						: <button onClick={() => this.activateButton(this.props.id, 'small')} className={props.visible === true && props.size === 'small' ? `${styles['enabled-widget-size-active']} btn btn-sm` : `${styles['enabled-widget-size']} btn btn-sm`}>S</button>
					}
				</div>
				<div className="col-2 offset-1">
					{this.props.minSize === 'large' ? <button onClick={() => this.activateButton(this.props.id, 'medium')} className={`${styles['disabled-widget-size']} btn btn-sm`} disabled>M</button>
						:  <button onClick={() => this.activateButton(this.props.id, 'medium')} className={props.visible === true && props.size === 'medium' ? `${styles['enabled-widget-size-active']} btn btn-sm` : `${styles['enabled-widget-size']} btn btn-sm`}>M</button> 
					}
				</div>
				<div className="col-2 offset-1">
					<button onClick={() => this.activateButton(this.props.id, 'large')} className={props.visible === true && props.size === 'large' ? `${styles['enabled-widget-size-active']} btn btn-sm` : `${styles['enabled-widget-size']} btn btn-sm`}>L</button>
				</div>
			</Fragment>
		);
	}

	render() {
		return (
			<tr>
				<td> 
					<div className="row text-center">
						<div className={`${styles['sidepanel-contrast-text']} col-8`}   >
							{this.props.name}
							<div className="row text-center mt-2">
								{this.renderButtons(this.props, this.props.minSize)}
							</div>
						</div>
						<div className={`${styles['icon-center']} col-4`}>
							{this.props.img ? <i className={`${this.props.img} ${styles['side-image']}`}/>  : <span className={`${styles['dot']}`}></span>}
						</div>
					</div>
				</td>
			</tr>
		);
	}
}