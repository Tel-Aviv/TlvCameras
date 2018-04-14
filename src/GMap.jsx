import React from 'react';
import { Gmaps, Marker, InfoWindow, Circle } from 'react-gmaps';

const coord = {
  lat: 51.52,
  lng: -0.08
};

const params = {
  //v: '3.exp',
  key: 'AIzaSyA-d98pGdPlRGw4OxvmCg8X4FoykxBYhLE'
};

class GMap extends React.Component {

  onMapCreated(map) {
    map.setOptions({
      disableDefaultUI: true
    });
  }

  render() {

    return (<div className="col-lg-3">
              <Gmaps
                params = {params}
                width={'150px'}
                height={'100px'}
                lat={coord.lat}
                lng={coord.lon}
                onMapCreated={this.onMapCreated}
                zomm={12}>

              </Gmaps>

            </div>)

  }

}

export default GMap;
