import React from 'react';
import { createFragmentContainer, graphql} from 'react-relay';

const SummaryCars = ({totals}) =>  {

    let count = totals.observation.cars;

    return (<div className="card card-body">
                  <h6>Cars</h6>
                  <br />
                  <p className="fs-28 fw-100">{count}</p>
                  <div className="text-gray fs-12">
                    <i className="ti-stats-up text-success mr-1" aria-hidden="true"></i>
                    12% increase from last hour
                  </div>
              </div>);
}

export default createFragmentContainer(SummaryCars,
graphql`
  fragment SummaryCars_totals on Camera
  @argumentDefinitions(
    Id: { type: "Int", defaultValue: 1 }
  )
  {
    observation {
      cars
      when_observed
    }
  }
`);
