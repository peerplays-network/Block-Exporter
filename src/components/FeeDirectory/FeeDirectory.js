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
		this.state = { openSections, fee: [], groupedData: [], searchFee:'', key: '' };
	}

	componentDidUpdate(prevProps, prevState) {
		if(prevProps.size !== this.props.size)
			this.setState({openSections: {}});
	}

	fetchData() {
		//API call to search for operations
		axios.get('api/operations', {
		}).then(response => {
			let alphabet = ('abcdefghijklmnopqrstuvwxyz').split('');
			const group = [];
			alphabet.forEach((item, index) => {
				if(!group[item])
					group[item] = [];
			});
			const operations = response.data.sort((a, b)=>a.friendly_name.localeCompare(b.friendly_name));
			const billy = operations.reduce((r, e)=>{
				const key = e.friendly_name[0];
				if(!r[key])
					r[key]=[];
				r[key].push(e);
				return r;
			}, {});
			//group.map(obj => billy.find(o => o.id === obj.id) || obj);
			alphabet.forEach((value) => {
				group[value] = (billy[value] || group[value]);
			});
			group['All']=response.data;
			this.setState({ fee: response.data, groupedData: group});
		}).catch(error => {console.log('error fetching operations data', error);});
	}

	componentDidMount() {
		this.fetchData();
		const gridHeight=23;
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
		let temp_data = [];
		//if the data.id matches accountName add to data
		for (let operation in data) {
			if (data[operation].friendly_name.indexOf(searchFee) >= 0 ) 
				temp_data.push(data[operation]);
		}
		// if (temp_data.length <= 0)
		// 	temp_data = data;
		this.setState({ fee: temp_data });
	}

	onGroupClick(key) {
		const fees = this.state.groupedData[key.key];
		this.setState({
			fee: fees,
			key: key
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

	onClickSmall(e) {
		if(this.state.key !== 'All' && this.state.groupedData['All'] !== undefined) {
			this.setState({
				fee: this.state.groupedData['All'],
				key: 'All',
			});
		}
	}
    
	render() 
	{
		const {
			onClick,
          	state: { openSections, searchFee },
		} = this;
		const fullPage = this.props.id === undefined;
		return (
			<div className="container" style={{height:'375px', width: '100%'}}>
				{!!this.props.history ? 
					<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-2 pb-3 mt-5`}>
						<span className="fa fa-file-invoice-dollar">&nbsp;</span>Fee Schedule</h1>
					: null}
				{fullPage && <InputGroup className={`${styles['input-group']}`}>
					<InputGroupAddon className={`${styles['input-group-prepend']}`} addonType="prepend"><span className={`fa fa-search ${styles['icon']}`}></span></InputGroupAddon>
					<Input type="text" value={searchFee} onChange={this.onFeeTextChanged.bind(this)} placeholder="Operation" />
				</InputGroup>}
				{this.props.size==='large' && <div className="row">
					<div className={`${styles['group-cover']} col-13`} >
						<div className={`${styles['group-headings']} col-4`}>
							<div className={`row`}
								style={{
									background: '#fff'
								}}>
								{Object.entries(this.state.groupedData)
									.map(([key, value], i) => {
										if(value.length>0) {
											return (
												<div className={`${styles['feeButton']}`} key={i} onClick={(i)=>this.onGroupClick({key})}>
													<strong>{key}</strong>
												</div>
											);
										}
										else{
											return (
												<div className={`${styles['feeButtonDead']}`} key={i}>
													<strong>{key}</strong>
												</div>
											);
										}
									})}
							</div>
						</div>

						<div className={`${styles['group']} col-12`} >
							{this.state.fee && this.state.fee.map(child => (
								<FeeSection
									key={child.id}
									isOpen={!!openSections[child.friendly_name]}
									label={child.friendly_name}
									onClick={onClick.bind(this)}
									fullPage={fullPage}
									fee={child}
									size={this.props.size}
								/>
							))}{this.state.fee.length===0 && <div> No Fee Found </div>}
						</div>
					</div>
				</div>}
				{this.props.size!=='large' && <div>
					{this.onClickSmall()}
					{this.state.fee && this.state.fee.map(child => (
						<FeeSection
							key={child.id}
							isOpen={!!openSections[child.friendly_name]}
							label={child.friendly_name}
							onClick={onClick.bind(this)}
							fullPage={fullPage}
							fee={child}
							size={this.props.size}
						/>
					))}{this.state.fee.length===0 && <div> No Fee Found </div>}
				</div>}
			</div>
		);
	}
}

export default FeeDirectory;