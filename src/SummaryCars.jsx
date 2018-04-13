import React from 'react';
import { createFragmentContainer, graphql} from 'react-relay';

const SummaryCars = ({totals}) =>  {

    let count = totals.cars;

    return (<div className="col-lg-4">
              <div className="card card-body">
                  <h6>Cars</h6>
                  <br />
                  <p className="fs-28 fw-100">{count}</p>
                  <div className="text-gray fs-12">
                    <i className="ti-stats-up text-success mr-1" aria-hidden="true"></i>
                    12% increase from last day
                  </div>
              </div>
            </div>);


}

export default createFragmentContainer(SummaryCars,
graphql`
  fragment SummaryCars_totals on Camera
  {
    id
    cars
  }
`);
