import React from 'react';

class SummaryCars extends React.Component {

  render() {
    return (<div className="col-lg-4">
              <div className="card card-body">
                <h6>Cars</h6>
                <br />
                <p className="fs-28 fw-100">112</p>
                <div className="text-gray fs-12">
                  <i className="ti-stats-up text-success mr-1" aria-hidden="true"></i>
                </div>
              </div>
            </div>);
  }

}

export default SummaryCars;
