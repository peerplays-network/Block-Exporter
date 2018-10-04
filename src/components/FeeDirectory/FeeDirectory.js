import React, { Component } from 'react';
import FeeSection from './FeeSection';
import axios from 'axios'; 
import styles from './styles.css';

class FeeDirectory extends Component {
	constructor(props) {
		super(props);
    
		const openSections = {};
		this.onGroupClick = this.onGroupClick.bind(this);
		this.state = { openSections, fee: [], groupedData: [] };
	}

	fetchData() {
		//API call to search for Account
		axios.get('api/operations', {
		}).then(response => {
			const group = response.data.sort((a, b)=>a.friendly_name.localeCompare(b.friendly_name))
				.reduce((r, e)=>{
					const key = e.friendly_name[0];
					if(!r[key])
						r[key]=[];
					r[key].push(e);
					return r;
				}, {});
			group['All']=response.data;
			this.setState({ fee: response.data, groupedData: group});
		}).catch(error => {console.log('error fetching account data', error);});
	}
	
	componentDidMount() {
		this.fetchData();
		const gridHeight=40;
		this.props.calculateComponentHeight(this.props.id, gridHeight);
	}

	onGroupClick(key) {
		const fees = this.state.groupedData[key.key];
		this.setState({
			fee: fees
		});
	}

	onClick(label) {
		const {
			state: { openSections }
		} = this;
    
		const isOpen = !!openSections[label];
    
		this.setState({
			openSections: {
				[label]: !isOpen
			}
		});
	}
    
	render() 
	{
		const {
			onClick,
          	state: { openSections },
		} = this;
		
		return (
			<div className="container" style={{height:'320px'}}>
				{this.props.size==='large' && <div className="row">
					<div className={`${styles['group-headings']} col-sm-2`}>
						{Object.entries(this.state.groupedData)
							.map(([key, value], i) => {
								return (
									<div key={i} onClick={(i)=>this.onGroupClick({key})}>
										<strong>{key}</strong>
									</div>
								);
							})}
					</div>

					<div className={`${styles['group']} col-sm-10`} >
						{this.state.fee.map(child => (
							<FeeSection
								key={child.id}
								isOpen={!!openSections[child.friendly_name]}
								label={child.friendly_name}
								onClick={onClick.bind(this)}
								fee={child}
							/>
						))}
					</div>
				</div>}
				{this.props.size!=='large' && <div>
					{this.state.fee.map(child => (
						<FeeSection
							key={child.id}
							isOpen={!!openSections[child.friendly_name]}
							label={child.friendly_name}
							onClick={onClick.bind(this)}
							fee={child}
						/>
					))}
				</div>}
			</div>
		);
	}
}

export default FeeDirectory;