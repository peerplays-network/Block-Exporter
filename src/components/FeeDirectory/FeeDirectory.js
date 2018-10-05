import React, { Component } from 'react';
import FeeSection from './FeeSection';
import axios from 'axios'; 
import { Input, InputGroup, InputGroupAddon} from 'reactstrap';
import styles from './styles.css';

class FeeDirectory extends Component {
	constructor(props) {
		super(props);
    
		const openSections = {};
		this.onGroupClick = this.onGroupClick.bind(this);
		this.state = { openSections, fee: [], groupedData: [], searchFee:'' };
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
		if(this.props.id !== undefined) 
		{
			this.props.calculateComponentHeight(this.props.id, gridHeight);
		}
	}

	onFeeTextChanged(e) {
		e.preventDefault();
		this.setState({ searchFee: e.target.value });
		this.findFee(e.target.value, this.state.groupedData['All']);
	}

	findFee(searchFee, data) {
		var temp_data = [];
		//if the data.id matches accountName add to data
		for (var operation in data) {
			if (data[operation].friendly_name.indexOf(searchFee) >= 0 ) 
				temp_data.push(data[operation]);
		}
		if (temp_data.length <= 0)
			temp_data = data;
		this.setState({ fee: temp_data });
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
          	state: { openSections, searchFee },
		} = this;
		const fullPage = this.props.id === undefined;
		return (
			<div className="container" style={{height:'320px'}}>
				{fullPage && <InputGroup className={`${styles['input-group']}`}>
					<InputGroupAddon className={`${styles['input-group-prepend']}`} addonType="prepend"><span className={`fa fa-search ${styles['icon']}`}></span></InputGroupAddon>
					<Input type="text" value={searchFee} onChange={this.onFeeTextChanged.bind(this)} placeholder="Operation" />
				</InputGroup>}
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
								fullPage={fullPage}
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
							fullPage={fullPage}
							fee={child}
						/>
					))}
				</div>}
			</div>
		);
	}
}

export default FeeDirectory;