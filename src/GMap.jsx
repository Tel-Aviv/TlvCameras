import React from 'react';
import { Gmaps, Marker, InfoWindow, Circle } from 'react-gmaps';
import { createFragmentContainer, graphql} from 'react-relay';
import environment from './Environment';

const mutation = graphql`
  mutation GMap_Mutation (
    $cameraId: Int!
  )
  {
    currentCamera(cameraId: $cameraId)
  }
`

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

  cameraClicked(cameraId: integer) {
    console.log(cameraId)
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
                  onClick={ () => this.cameraClicked(11) }
                />
                <Marker
                  lat={32.14}
                  lng={34.82}
                  draggable={false}
                  cameraId={12}
                  onClick={ () => this.cameraClicked(12) }
                />

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
