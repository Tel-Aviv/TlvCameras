import React from 'react';
import { createFragmentContainer, graphql} from 'react-relay';

const SummaryMotorcycles = ({totals}) =>  {

    let count = totals.observation.motorcycles;

    return (<div className="card card-body">
                <h6>Motocyrcles</h6>
                  <br />
                  <p className="fs-28 fw-100">{count}</p>
                  <div className="text-gray fs-12">
                    <i className="ti-stats-down text-danger mr-1"></i>
                    8% decrease from last hour
                  </div>
              </div>);


}

export default createFragmentContainer(SummaryMotorcycles,
graphql`
  fragment SummaryMotorcycles_totals on Camera
  {
    observation {
      motorcycles
      when_observed
    }
  }
`);
