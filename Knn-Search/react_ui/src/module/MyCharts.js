import React, { Component } from 'react';
import { withHighcharts, HighchartsChart, Chart, XAxis, YAxis, Title, Subtitle, Legend, LineSeries, BoxPlotSeries } from 'react-jsx-highcharts';
import Highcharts from 'highcharts';
import addHighchartsMore from 'highcharts/highcharts-more';
import '../css/Chart.css'

addHighchartsMore(Highcharts);

class StudentBoxPlot extends Component {
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
    const data = this.state.data[0];

    return (
      <HighchartsChart colors={['#2f7ed8', '#77a1e5']}>
        <Title>Title</Title>
        <Subtitle>Sup title</Subtitle>
        <XAxis min={-1} max={1}>
          <XAxis.Title>L2</XAxis.Title>
        </XAxis>
        <YAxis id="number">
          <YAxis.Title>l1</YAxis.Title>
          <BoxPlotSeries id="1" name="L1" data={this.props.data.data} />
        </YAxis>
      </HighchartsChart >
    );
  }
}
export default withHighcharts(StudentBoxPlot, Highcharts); // Injecting the Highcharts object
