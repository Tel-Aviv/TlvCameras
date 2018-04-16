// @flow
import React from 'react';
import { connect } from 'react-redux'

const Header = ({cameraId, cameraName}) => {

    let _cameraId = cameraId != 0 ?
                    <div>{cameraId}</div> :
                    null;
    let _arrowDown = cameraId ?
                    null :
                    <span className="topbar-btn has-new" data-toggle="dropdown">
                      <i className="ti-arrow-down">
                      </i>
                    </span>;

    if( !cameraName ) {
      cameraName = "Please, select a camera on the map";
    }

    return (<header className='topbar'>
              <div className='topbar-left'>
                  {_arrowDown}
                   <div>{cameraName}</div>
                   <div>{_cameraId}</div>
              </div>
            </header>
            );

};

function mapStateToProps(state) {

  return {
    cameraId: state.cameraId,
    cameraName: state.cameraName
  }

}

export default connect(mapStateToProps)(Header);
