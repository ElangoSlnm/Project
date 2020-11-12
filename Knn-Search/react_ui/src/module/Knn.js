import React, { Component } from 'react';
import logo from '../resource/rpx-insight-logo.png';
import '../css/Knn.css';
import MyChart from './MyCharts'

class Knn extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            loading: false
        };
    }

    render() {
        return (
            <div className="Knn">
                <div className="Knn-header">
                    <img src={logo} className="rpx-insight-logo" alt="logo" />
                    <div className="Knn-title">Books Knn Search</div>
                </div>
                <div className="Knn-container">
                    <div className="Knn-cont-pane" >
                        <div className="Knn-pane-tap">
                            <div>
                                <form className="left-cont" onSubmit={() => this.search_patent(event)}>
                                    <textarea type="text" className="pat_num" placeholder="Patnum eg: US10191335B2, US10179761B2" onChange={() => this.set_sentence(event)} required />
                                    <input type="submit" className="Knn-search" value="search" />
                                </form>
                            </div>
                        </div>
                        <div className="Knn-pane-tap">
                            <MyChart/>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Knn;