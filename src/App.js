import logo from './logo.svg';
import './App.css';
import React, { useRef, useState, useCallback } from 'react'

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100vh',
  height: '100vw',
  display: 'block',
};

const center = {
  lat: -3.745,
  lng: -38.523
};



function App() {

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDJRU8JuKpJa2ZWPgpg7_jRKGv6HrQc2s0"
  })
  
  const [map, setMap] = useState(null)
  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        asdf
      </header>
      <div className="pageBody">
        <article>
          {
            isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                { /* Child components, such as markers, info windows, etc. */}
                <></>
              </GoogleMap>
            ) : <></>
          }
        </article>
        <aside>
          <iframe src="https://discord.com/widget?id=789556424640430121&theme=dark" allowtransparency="true" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
        </aside>
      </div>

    </div>
  );
}

export default App;
