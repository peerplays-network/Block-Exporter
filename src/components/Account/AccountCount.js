import React, { Component } from 'react'
import axios from 'axios';

export default class Test extends Component {
    state = {
        count: 0
    };

    // Fetching accounts table count over http request.
    componentDidMount() {
        axios
          .get('/api/acccountCount')
          .then(res => this.setState( { count : res.data }) );
      }

    // This method will check if the accounts table is empty.
    // warning message will be display if accounts table is empty.
    getStyle = () => {
        if(this.state.count !== 0){
            return {
                display: 'none',
            }
        } else {
            return {
                display: "flex",
                justifyContent: "center",
                color: "#d60d0d"
             }
        }
    }

    render() {
        return (
            <div>
          {/* <p>no data in the accounts table and please populate the table for the explorer to work as intended</p> */}
            <p style={this.getStyle()}>no data in the accounts table and please populate the table for the explorer to work as intended</p>
            </div>
        )
    }
}

