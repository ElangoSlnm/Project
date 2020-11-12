import React, { Component } from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Legend, ScatterSeries, Tooltip } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';
import addHighchartsMore from 'highcharts/highcharts-more';
import '../css/Chart.css'

addHighchartsMore(Highcharts);

class ScatterChart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [
                {
                    minTiming: 760,
                    '25thPercentile': 801,
                    medianTiming: 848,
                    '75thPercentile': 895,
                    maxTiming: 965
                }
            ]
        }
    }
    

    render() {

        const num = this.props.corpus
        const title = this.props.data.title

        const tooltipFormatter = function (tooltip) {
            if (this.series.name === undefined)
                return;
            let pos = 0
            if (this.series.name === 'Corpus'){
                pos = (parseInt(title.length) - parseInt(num)) + parseInt(this.point.index)
            }else if(this.series.name === 'Books'){
                pos = this.point.index + 1
            }else {
                pos = 0
            }
            return `<strong>${title[pos]}</strong>`
          }

        return (
            <div>
                <HighchartsChart>
                    <Chart zoomType="xy" onClick={this.handleClick} />
                    <Title>Book Knn search result</Title>

                    <Legend  backgroundColor={ Highcharts.defaultOptions.chart.backgroundColor}>
                        <Legend.Title>Legend</Legend.Title>
                    </Legend>

                    <XAxis>
                        <XAxis.Title>X Coord</XAxis.Title>
                    </XAxis>

                    <YAxis>
                        <YAxis.Title>Y Coord</YAxis.Title>
                        <ScatterSeries color={"#2466f3"} name="Books" data={this.props.data.book} onHide={this.handleHide} onShow={this.handleShow}/>
                        <ScatterSeries color={"#6892ec"} symbol="circle" name="Corpus" data={this.props.data.corpus} onHide={this.handleHide} onShow={this.handleShow}/>
                        <ScatterSeries color={"red"} size={20} name="Keyword" data={[this.props.data.keys]} onHide={this.handleHide} onShow={this.handleShow}/>
                    </YAxis>
                    <Tooltip padding={10} hideDelay={250} shape="square" split formatter={tooltipFormatter}/>
                </HighchartsChart>
            </div>
        );
    }
}
export default withHighcharts(ScatterChart, Highcharts); // Injecting the Highcharts object
