import React, { Component } from 'react';
import logo from '../resource/rpx-insight-logo.png';
import ReactTable from "react-table-6";
import "react-table-6/react-table.css";
import '../css/Home.css';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            sentence: null,
            field: 'tit_vector',
            limit: null,
            loading: false
        };
    }

    generate_talbe(result) {
        // console.log('responce:' + JSON.stringify(result))
        let _item = []
        result.forEach((items, index) => {
            let item = items._source
            _item.push({
                'cpc_full': <div className="cell">{item.cpc_full}</div>,
                'issued_date_or_app_filing_date': <div className="cell">{item.issued_date_or_app_filing_date}</div>,
                'pat_id': <div className="cell">{item.pat_id}</div>,
                'title': <div className="cell">{item.title}</div>,
                'patnum': <div className="cell"><a href={"https://analyst.rpxcorp.com/#/patent/" + item.patnum} className="link" target="new">{item.patnum}</a></div>,
                'score': <div className="cell">{items._score.toFixed(2)}</div>
            })
        })

        this.setState({
            isLoaded: true,
            items: _item,
            loading: false
        });
    }

    search_patent(event) {
        event.preventDefault()
        console.log("Keyword: " + this.state.sentence + "; Search Field: " + this.state.field + "; Limit: " + this.state.limit)
        if (this.state.sentence !== null && this.state.field !== null && this.state.limit !== null) {
            this.setState({ loading: true })
            console.log('Api called.')
            let api = 'http://prod-spark-node1:1212/search?index=pat-index&keyword=' + this.state.sentence + '&search_field=' + this.state.field + '&limit=' + this.state.limit
            fetch(api)
                .then(res => res.json())
                .then(
                    (response) => {
                        if (response.status) {
                            this.generate_talbe(response.result)
                            console.log('SUCCESS: ' + response.result.length)
                        } else {
                            console.log(response.error)
                            this.setState({ loading: false })
                        }
                    },
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                        console.log('ERROR: ' + error);
                        this.setState({ loading: false })
                    }
                )
        } else {
            console.log('Empty field.')
        }
    }

    componentDidMount() {
        let test_item = JSON.parse('[{"_index": "pat-index", "_type": "_doc", "_id": "9749188", "_score": 0.88840634, "_source": {"cpc_full": "B42D15/0033", "issued_date_or_app_filing_date": "1944-02-29", "pat_id": 9749188, "title": "Insurance policy", "patnum": "US2342981A"}}, {"_index": "pat-index", "_type": "_doc", "_id": "12120408", "_score": 0.88840634, "_source": {"cpc_full": "B42D15/0033", "issued_date_or_app_filing_date": "1941-12-23", "pat_id": 12120408, "title": "Insurance policy", "patnum": "US2267507A"}}]')
        let _item = []
        this.generate_talbe(_item)
    }

    set_limit(event) {
        this.setState({ limit: event.target.value })
        // console.log('Limit set to:' + event.target.value)
    }

    set_sentence(event) {
        this.setState({ sentence: event.target.value })
        // console.log('Keyword set to:' + event.target.value)
    }

    set_field(event) {
        this.setState({ field: event.target.value })
        // console.log('Filed set to:' + event.target.value)
    }

    render() {
        const columns = [
            {
                Header: 'ID #',
                accessor: 'pat_id',
                headerClassName: 'table-header',
                maxWidth: 120
            },
            {
                Header: 'PATNUM',
                accessor: 'patnum',
                maxWidth: 170,
                headerClassName: 'table-header',
                footerClassName: 'table-header'
            },
            {
                Header: 'TITLE',
                accessor: 'title',
                headerClassName: 'table-header',
            },
            {
                Header: 'ISSUED/FILING DATE',
                accessor: 'issued_date_or_app_filing_date',
                headerClassName: 'table-header',
                maxWidth: 180
            },
            {
                Header: 'CPC FULL',
                accessor: 'cpc_full',
                headerClassName: 'table-header',
                maxWidth: 150
            },
            {
                Header: 'SCORE',
                accessor: 'score',
                headerClassName: 'table-header',
                maxWidth: 80
            }]
        return (
            <div className="App">
                <div className="App-header">
                    <img src={logo} className="rpx-insight-logo" alt="logo" />
                    <div className="App-title">Patent Knn Search</div>
                </div>
                <div className="App-container">
                    <form className="App-cont-pane" onSubmit={() => this.search_patent(event)}>
                        <div className="App-pane-tap">
                            <div className="left-cont">
                                <input type="text" className="key_work" placeholder="search keyword" onChange={() => this.set_sentence(event)} required />
                            </div>
                            <div className="right-cont">
                                <select className="select_filed" onChange={() => this.set_field(event)} required>
                                    <option className="opt" value="tit_vector">Title</option>
                                    <option className="opt" value="abs_vector">Abstract</option>
                                    <option className="opt" value="tit_abs_vector">Title + Abstract</option>
                                </select>
                                <input type="number" className="limit" min="1" max="1000" placeholder="Limit" onChange={() => this.set_limit(event)} required />
                            </div>
                        </div>
                        <div className="App-pane-tap">
                            <input type="submit" className="App-search" value="search" />
                        </div>
                        <div className="App-pane-tap">
                            <ReactTable data={this.state.items} columns={columns} defaultPageSize={5}
                                pageSizeOptions={[5, 10, 50, 100, 1000]} className="App-table" showPagination={true}
                                loading={this.state.loading} filterable={false}
                            />
                        </div>
                    </form>
                </div>
            </div >
        );
    }
}

export default Home;