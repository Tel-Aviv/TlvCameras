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

    let devices = this.props.devices;
    let cameraId = this.props.cameraId;
    let cameraName;
    let lng;
    let lat;

    let _devices = devices.map( (device,index) => {

      if( device.cameraId == cameraId ) {
        lng = device.lng;
        lat = device.lat;
        cameraName = device.name;
      }

      return <Marker
                key={index}
                lat={device.lat}
                lng={device.lng}
                draggable={false}
                onClick={ () => this.cameraClicked(device.cameraId, device.name) }
            />

    });

    return (<Gmaps
                width={'360px'}
                height={'160px'}
                lat={lat}
                lng={lng}
                zoom={16}
                loadingMessage={'Loading cameras...'}
                params={params}
                onMapCreated={this.onMapCreated}>

                {_devices}

              </Gmaps>
            )

  }

}

export default connect()(GMap);
// export default createFragmentContainer(connect()(GMap),
// graphql`
//   fragment GMap_devices on Device
//   {
//     name
//     cameraId
//     lat
//     lng
//   }
// `);
