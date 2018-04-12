import React from 'react';

class SummaryPedestrians extends React.Component {

  render() {
    return (<div className="col-lg-4">
              <div className="card card-body">
                <h6>Pedestrians</h6>
              </div>
              <div className="text-gray fs-12">
                <i className="ti-stats-down text-danger mr-1"></i>
                8% decrease from last hour
              </div>
            </div>);
  }

}

export default SummaryPedestrians;
