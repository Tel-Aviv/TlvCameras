import React from 'react';
import { connect } from 'react-redux'
import { Gmaps, Marker, InfoWindow, Circle } from 'react-gmaps';
import { createFragmentContainer, graphql} from 'react-relay';
import environment from './Environment';

const coords = {
  lat: 32.11,
  lng: 34.80
};

const params = {
  v: '3.exp',
  key: 'AIzaSyA-d98pGdPlRGw4OxvmCg8X4FoykxBYhLE'
};

class GMap extends React.Component {

  constructor() {

    super();

    this.cameraClicked = this.cameraClicked.bind(this);
  }

  cameraClicked(cameraId: integer,
                cameraName: String) {
    console.log(cameraId)

    this.props.dispatch({
      type: 'CAMERA_ID_CHANGED',
      data: {
        cameraId: cameraId,
        cameraName: cameraName
      }

    });

  }

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true,
      clickableIcons: false,
      fullscreenControl: true,
      zoomControl: false
    });
  }

  render() {

    let device = this.props.devices;
    const cameraName = device.name;
    const lng = device.lat; // !!! opposite coordinates
    const lat = device.lng; // !!! opposite coordinates

    return (<div className="col-lg-3">
              <Gmaps
                width={'300px'}
                height={'160px'}
                lat={lat}
                lng={lng}
                zoom={16}
                loadingMessage={'Loading cameras...'}
                params={params}
                onMapCreated={this.onMapCreated}>

                <Marker
                  lat={lat}
                  lng={lng}
                  draggable={false}
                  onClick={ () => this.cameraClicked(device.cameraId, device.name) }
                />
                <Marker
                  lat={32.14}
                  lng={34.82}
                  draggable={false}
                  onClick={ () => this.cameraClicked(device.cameraId, device.name) }
                />

              </Gmaps>
            </div>)

  }

}

export default createFragmentContainer(connect()(GMap),
graphql`
  fragment GMap_devices on Device
  {
    name
    cameraId
    lat
    lng
  }
`);
