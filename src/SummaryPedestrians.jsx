// @flow
import React from 'react';
import { createFragmentContainer, graphql} from 'react-relay';

const SummaryPedestrians = ({totals}) => {

  let count = totals.observation.pedestrians;

  return (<div className="card card-body">
              <h6>Pedestrians</h6>
                <br />
                <p className="fs-28 fw-100">{count}</p>
                <div className="text-gray fs-12">
                  <i className="ti-stats-down text-danger mr-1"></i>
                  4% decrease from last hour
                </div>
            </div>);

};

export default createFragmentContainer(SummaryPedestrians,
graphql`
  fragment SummaryPedestrians_totals on Camera
  {
    observation {
      pedestrians
      when_observed
    }
  }
`);
