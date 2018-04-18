// @flow
import React from 'react';
import { withRouter } from 'react-router-dom'
import { compose, withProps, withHandlers } from 'recompose';
import { graphql, createFragmentContainer } from 'react-relay';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';
import { MarkerWithLabel } from 'react-google-maps/lib/components/addons/MarkerWithLabel';

import CameraMarker from './CameraMarker';

const centerMap = {
  lat: 32.11,
  lng: 34.80
};

const mapOptions = {
  disableDefaultUI: true,
  clickableIcons: false,
  fullscreenControl: true,
  zoomControl: true
};

const CamerasMap = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyA-d98pGdPlRGw4OxvmCg8X4FoykxBYhLE&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `160px`, width: `440px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers( () => {
    return {
      cameraClicked: (cameraId: number,
                      cameraName: string) => {
        console.log('clicked');
      }
    }
  }),
  withScriptjs,
  withGoogleMap
)( (props) => {

  const devices = props.devices;

  return <GoogleMap
    defaultZoom={14}
    defaultCenter={centerMap}
    options={mapOptions}>

    {
      devices.list.map( (device, index) => {

        // return <CameraMarker key={index} device={device} />;
        const markerCoords = {
          lat: device.lat,
          lng: device.lng
        };

        return <MarkerWithLabel
                    key={index}
                    position={markerCoords}
                    labelAnchor={new google.maps.Point(0, 0)}
                    onClick={ () => { props.cameraClicked(device.cameraId, device.name) }}
                    labelStyle={{backgroundColor: "yellow", fontSize: "14px", padding: "4px"}}
                >
                  <div>{device.name}</div>
                </MarkerWithLabel>
      })
    }

  </GoogleMap>
});

export default createFragmentContainer(withRouter(CamerasMap),
graphql`
  fragment CamerasMap_devices on Devices
  {
    list {
      ...CameraMarker_device @relay(mask: false)
    }
  }
`);
