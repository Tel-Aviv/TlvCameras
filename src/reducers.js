// @flow
import _ from 'lodash';

const INITIAL_STATE = {
  cameraId: 0,
  cameraName: ''
};

const reducers = (state = INITIAL_STATE, action) => {

  switch( action.type ) {

    case 'CAMERA_ID_CHANGED': {
      state = _.assign({}, state, {
        cameraId: action.data.cameraId,
        cameraName: action.data.cameraName
      });
    }
    break;

  };

  return state;

};

export default reducers;
