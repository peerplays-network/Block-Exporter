import React,  { Component } from 'react';
import { Button, Card, CardText, CardBody, Col } from 'reactstrap';
import styles from './styles.css';
import axios from 'axios';

//leaving this page with bootstrap until it is decided what data is displayed in this page
class Directory extends Component {
	constructor() {
		super();
		this.state = {
			resources: [],
			categories:[],
		};
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		axios.get('/api/resources', {
		}).then(response => {
			const resources = response.data;
			const categories = this.state.categories;
			categories.push(resources.map((resource, i) => {
				if(!categories.includes(resource.category)) {
					return resource.category;
				}
			}));
			const catgo = categories[0].filter((v, i) => categories[0].indexOf(v) === i);
			console.log('out loop', resources, categories, catgo);
			this.setState({ resources: resources});
			this.setState({ categories: catgo});
		}).catch(error => console.log('error fetching transactions', error));
	}

	renderResource(resource, i) {
		return( 
			<Card key={i}>
				<CardBody>
					<Button href={resource.url} active>{resource.name}</Button>
					<CardText>{resource.description}</CardText>
				</CardBody>
			</Card>
		);
	}

	renderResources(category, resources) {
		return resources.map((resource, i) => {
			if(resource.category===category) {
				return this.renderResource(resource, i);
			}
		});
	}

	render() {
		const {resources, categories } = this.state;

		return (
			<div className="container">
				<h1 className={`${styles['header-contrast-text']} ${styles['header-background']} display-5 text-center pt-2 pb-3 mt-5`}>
					<span className="fa fa-map-signs">&nbsp;</span>Useful Resources</h1>
				<Col >
					{categories.map((category, i) => {
						return ( 
							<div key="i"> 
								<h1 className={'display-5 text-center pt-2 pb-3 mt-5'}>
									<span>&nbsp;</span> {category}
								</h1>
								{this.renderResources(category, resources, i)}
							</div>
						);
                  	})}
				</Col>
			</div>
		);
	}
}

export default Directory;