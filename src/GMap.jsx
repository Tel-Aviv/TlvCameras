import React from 'react';
import { Gmaps, Marker, InfoWindow, Circle } from 'react-gmaps';
import { createFragmentContainer, graphql} from 'react-relay';

const coords = {
  lat: 32.11,
  lng: 34.80
};

const params = {
  v: '3.exp',
  key: 'AIzaSyA-d98pGdPlRGw4OxvmCg8X4FoykxBYhLE'
};

class GMap extends React.Component {

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true,
      clickableIcons: false,
      fullscreenControl: true,
      zoomControl: false
    });
  }

  onClick(e) {
    //console.log('onClick', e);
    console.log(this.cameraId);
  }

  render() {

    let devices = this.props.devices;

    return (<div className="col-lg-3">
              <Gmaps
                width={'300px'}
                height={'160px'}
                lat={coords.lat}
                lng={coords.lng}
                zoom={16}
                loadingMessage={'Loading cameras...'}
                params={params}
                onMapCreated={this.onMapCreated}>
                <Marker
                  lat={coords.lat}
                  lng={coords.lng}
                  draggable={false}
                  cameraId={11}
                  onClick={this.onClick} />
                <Marker
                  lat={32.14}
                  lng={34.82}
                  draggable={false}
                  cameraId={12}
                  onClick={this.onClick} />

              </Gmaps>
            </div>)

  }

}

export default createFragmentContainer(GMap,
graphql`
  fragment GMap_devices on Device
  {
    name
    cameraId
    lat
    lng
  }
`);
