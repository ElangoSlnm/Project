import React, { Component } from 'react';
import logo from '../resource/rpx-insight-logo.png';
import ReactTable from "react-table-6";
import MyChart from './MyCharts'
import ScatterChart from './ScatterChart'

import "react-table-6/react-table.css";
import '../css/PatNum.css';

class PatNum extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            sentence: '',
            loading: false,
            chart_list: {
                'keys': [],
                'book':[],
                'corpus':[]
            },
            field: 'title_vec',
            term: 'knn',
            corpus: 0,
            limit: 10,
            total: 0,
            location:null,
            isLoading: 'true'
        };
    }
    
    fetchIpLocation() {
     
        
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(proxyurl + 'https://geoip-db.com/json')
      .then(response => response.json())
      .then(data =>
        this.setState({
          location: data,
          isLoading: false,
        })
      )
      .catch(error => this.setState({ error, isLoading: false }));
      }

    componentDidMount() {
//         this.fetchIpLocation();
        console.log('called')
    }
    
    generate_talbe(result) {
        // console.log('responce:' + JSON.stringify(result))
        let _item = []
        result.forEach((items, index) => {
            let item = items._source
            let colls='Result'
            if(this.state.corpus > 0 && index >= this.state.limit)
                colls='Corpus'
            _item.push({
                'bookId': <div className="cell">{item.bookId}</div>,
                'title': <div className="cell">{item.title}</div>,
                'authors': <div className="cell">{item.authors}</div>,
                'published_year': <div className="cell">{item.published_year}</div>,
                'num_pages': <div className="cell">{parseInt(item.num_pages)}</div>,
                'score': <div className="cell">{items._score.toFixed(2)}</div>,
                'collection': <div className="cell">{colls}</div>,
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
//         this.fetchIpLocation();
        
//         console.log("Keyword: " + this.state.sentence)
        if (this.state.sentence !== null && this.state.sentence !== '') {
            this.setState({ loading: true })
//             console.log('Api called.')
            let api = 'http://52.66.250.236:3000/search?index=books_lexical&keyword=' + this.state.sentence + '&field=' + this.state.field + '&limit=' + this.state.limit + '&term=' + this.state.term + '&num='+this.state.corpus + '&location=' + this.state.location
            // let api = 'http://prod-spark-node1:1212/patnum?index=pat-index&search_field=pat_id&patnum=' + this.state.sentence
            fetch(api)
                .then(res => res.json())
                .then(
                    (response) => {
                        if (response.status) {
                            this.generate_talbe(response.result)
                            this.setState({total:response.result.length})
                            if (response.is_knn)
                                this.setState({ chart_list:response.chart_data.scatter })
                            else{
                                let _temp = {
                                    'keys': [],
                                    'book':[],
                                    'corpus':[]
                                }
                                this.setState({ chart_list:_temp})
                            }
                                
//                             console.log('SUCCESS: ' + response.result.length)
                        } else {
//                             console.log(response.error)
                            this.setState({ loading: false })
                        }
                    },
                    (error) => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
//                         console.log('ERROR: ' + error);
                        this.setState({ loading: false })
                    }
                )
        } else {
            console.log('Empty field.')
        }
    }

    componentDidMount() {
        let test_item = JSON.parse('[{"_index": "pat-index", "_type": "_doc", "_id": "9749188", "_score": 0.88840634, "_source": {"cpc_full": "B42D15/0033", "issued_date_or_app_filing_date": "1944-02-29", "pat_id": 9749188, "title": "Insurance policy", "patnum": "US2342981A"}}, {"_index": "pat-index", "_type": "_doc", "_id": "12120408", "_score": 0.88840634, "_source": {"cpc_full": "B42D15/0033", "issued_date_or_app_filing_date": "1941-12-23", "pat_id": 12120408, "title": "Insurance policy", "patnum": "US2267507A"}}]')
        this.generate_talbe([])
    }

    set_limit(event) {
        let _val = parseInt(event.target.value)
        this.setState({ limit: _val  })
//         console.log('Limit set to:' + _val)
    }

    set_limit1(event) {
        let _val = parseInt(event.target.value)
        this.setState({ corpus: _val  })
//         console.log('Limit set to:' + _val)
    }

    set_sentence(event) {
        let _val = event.target.value
        // let _val = event.target.value.replace(/[\W_]+/g, ',').replace(/^\,$/g, '')
        this.setState({ sentence: _val })
//         console.log('Keyword set to:' + this.state.sentence)
    }

    set_field(event) {
        let _val = event.target.value
        let _term = 'text'
        if (_val.includes('vec')) {
            _term = 'knn'
        }
        this.setState({ field: event.target.value, term: _term })
        // console.log('Filed set to:' + event.target.value)
    }

    render() {
        const columns = [
            {
                Header: 'TITLE',
                accessor: 'title',
                minWidth: 100,
                headerClassName: 'table-header',
                footerClassName: 'table-header'
            },
            {
                Header: 'AUTHORS',
                accessor: 'authors',
                headerClassName: 'table-header',
                minWidth:80
            },
            {
                Header: 'PUBLICATION YEAR',
                accessor: 'published_year',
                headerClassName: 'table-header',
                maxWidth: 140
            },
            {
                Header: 'PAGES',
                accessor: 'num_pages',
                headerClassName: 'table-header',
                maxWidth: 60
            },
            {
                Header: 'SCORE',
                accessor: 'score',
                headerClassName: 'table-header',
                maxWidth: 60
            },
            {
                Header: 'COLLECTION',
                accessor: 'collection',
                headerClassName: 'table-header',
                maxWidth: 100
            }
        ]
        return (
            <div className="PatNum">
                <div className="PatNum-header">
                    {/* <img src={logo} className="rpx-insight-logo" alt="logo" /> */}
                    <div className="PatNum-title">Building a real-time similarity matching system using Embedding</div>
                </div>
                <div className="PatNum-container">
                    <form className="PatNum-cont-pane" onSubmit={() => this.search_patent(event)}>
                        <div className="left-cont-1">
                            <div className="PatNum-pane-tap">
                                <div className="left-cont">
                                    <textarea spellCheck="false" className="pat_text" placeholder="Keywords eg: System" onChange={() => this.set_sentence(event)} required value={this.state.sentence} />
                                </div>
                                <select className="select_filed" onChange={() => this.set_field(event)} required>
                                    <option className="opt" value="title_vec">Title [USE]</option>
                                    <option className="opt" value="title">Title [DB]</option>
                                    <option className="opt" value="title_syn">Title [ELASTIC]</option>
                                    <option className="opt" value="title_desc">Title + DESC + [ELASTIC]</option>
                                    <option className="opt" value="title_desc_vec">Title + DESC [USE] </option>
                                </select>
                                <input type="number" className="corpus" min="2" max="1000" placeholder="Limit" defaultValue="10" onChange={() => this.set_limit(event)} required />
                                <div className="right-cont">
                                    <input type="number" className="limit" min="0" max="1000" placeholder="corpus" onChange={() => this.set_limit1(event)} />
                                    <input type="submit" className="PatNum-search" value="search" />
                                </div>
                                
                            </div >
                            <div className="count">Total count: {this.state.total}</div>
                            <div className="PatNum-pane-tap">
                                <ReactTable data={this.state.items} columns={columns} defaultPageSize={10}
                                    pageSizeOptions={[5, 10, 50, 100, 1000]} className="PatNum-table" showPagination={true}
                                    loading={this.state.loading} filterable={false}
                                />
                            </div>
                        </div>
                        <div className="PatNum-pane-tap1">
                            <div className="ScatterChart"><ScatterChart data={this.state.chart_list} corpus={this.state.corpus}/></div>
                        </div>

                    </form>
                </div>
            </div >
        );
    }
}

export default PatNum;