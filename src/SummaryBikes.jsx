// @flow
import React from 'react';
import { createFragmentContainer, graphql} from 'react-relay';

const SummaryBikes = ({totals}) => {

    let count = totals.observation.bikes;

    return (<div className="card card-body">
                <h6>Bikes</h6>
                  <br />
                  <p className="fs-28 fw-100">{count}</p>
                  <div className="text-gray fs-12">
                    <i className="ti-stats-down text-danger mr-1"></i>
                    8% decrease from last hour
                  </div>
              </div>);

}

export default createFragmentContainer(SummaryBikes,
graphql`
  fragment SummaryBikes_totals on Camera
  {
    observation {
      bikes
      when_observed
    }
  }
`);
