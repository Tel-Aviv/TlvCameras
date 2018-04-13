import React from 'react';
import { createFragmentContainer, graphql} from 'react-relay';
import _ from 'lodash';
var BarChart = require("react-chartjs").Bar;


//
// Chart data should be shaped as follows:
//
// var chartData = {
// 	labels: ["12:00", "1:00", "2:00", "3:00", "4:00", "5:00", "6:00"],
// 	datasets: [
// 		{
// 			label: "Cars",
// 			fillColor: "rgba(220,220,220,0.2)",
// 			strokeColor: "rgba(220,220,220,1)",
// 			pointColor: "rgba(220,220,220,1)",
// 			pointStrokeColor: "#fff",
// 			pointHighlightFill: "#fff",
// 			pointHighlightStroke: "rgba(220,220,220,1)",
// 			data: [6500, 5900, 8000, 8100, 5600, 5500, 4000]
// 		},
// 		{
// 			label: "Bikes",
// 			fillColor: "rgba(151,187,205,0.2)",
// 			strokeColor: "rgba(151,187,205,1)",
// 			pointColor: "rgba(151,187,205,1)",
// 			pointStrokeColor: "#fff",
// 			pointHighlightFill: "#fff",
// 			pointHighlightStroke: "rgba(151,187,205,1)",
// 			data: [2800, 4800, 4000, 1900, 8600, 2700, 9000]
// 		},
//     {
//       label: "Motorcycles",
//       fillColor: "rgba(155,155,205,0.2)",
//       strokeColor: "rgba(151,187,205,1)",
//       pointColor: "rgba(151,187,205,1)",
//       pointStrokeColor: "#fff",
//       pointHighlightFill: "#fff",
//       pointHighlightStroke: "rgba(151,187,205,1)",
//       data: [2700, 8000, 4000, 1900, 8600, 2700, 900]
//     }
// 	]
// };

var chartOptions = {
  ///Boolean - Whether grid lines are shown across the chart
  scaleShowGridLines : true,

  //String - Colour of the grid lines
  scaleGridLineColor : "rgba(0,0,0,.05)",

  //Boolean - Whether to fill the dataset with a colour
  datasetFill : true,
}

class SummaryChart extends React.Component {

  render() {

    let totals = this.props.totals;
    let _series = totals.series.map( (ds, index) => {

      return {
        data: ds.data,
        label: ds.label,
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)"
      }
    });

    let _chartData = {
      labels: totals.labels,
      datasets: _series
    };

    return(
      <div className="col-12">
        <div className="card esbCard">
          <div className="card-header">
            <h5>
              <strong className="text-uppercase esbCaption">Traffic</strong>
            </h5>
          </div>
          <div className="card-body">
            <BarChart redraw data={_chartData} options={chartOptions}
                width="1100" height="460"/>
          </div>
        </div>
      </div>
    );
  }

};

export default createFragmentContainer(SummaryChart,
graphql`
  fragment SummaryChart_totals on Series {
    labels
    series {
      label
      data
      ruleId
    }
  }
`);
