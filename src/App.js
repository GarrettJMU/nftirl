import "./App.css";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import apiService from "./utils/apiService";

import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100vh",
  height: "100vw",
  display: "block",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

function CollectionList(props) {
  const stuff = props.collectionList.map((obj) => (
    <div className="collectionContainer">
      <img
        className="collectionImage"
        src={obj.image_url}
        key={obj.slug}
        alt={obj.name}
      />
    </div>
  ));
  return <div>{stuff}</div>;
}

function App() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDJRU8JuKpJa2ZWPgpg7_jRKGv6HrQc2s0",
  });

  const [map, setMap] = useState(null);
  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const [userAddress, setUserAddress] = useState("");
  const [collectionList, setCollectionList] = useState([]);

  useEffect(() => {
    const web3 = async () => {
      // If you don't specify a //url//, Ethers connects to the default
      // (i.e. ``http:/\/localhost:8545``)
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      await provider.send("eth_requestAccounts", []);
      // The provider also allows signing transactions to
      // send ether and pay to change state within the blockchain.
      // For this, we need the account signer...
      const signer = provider.getSigner();
      let userAddress = await signer.getAddress();

      apiService.createAccount(userAddress)

      setUserAddress(userAddress);
      try {
        const osApiUrl = `https://api.opensea.io/api/v1/collections?asset_owner=${userAddress}&format=json&limit=300&offset=0`;
        axios.get(osApiUrl).then((res) => {
          let collectionList = res.data;
          setCollectionList(collectionList);
          console.log(collectionList);
        });
      } catch (error) {
        throw error;
      }
    };
    web3();
  }, []);

  return (
    <div className="App">
      <header className="App-header">{userAddress}</header>
      <div className="pageBody">
        <aside>
          <CollectionList collectionList={collectionList} />
        </aside>
        <article>
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}>
              {/* Child components, such as markers, info windows, etc. */}
              <></>
            </GoogleMap>
          ) : (
            <></>
          )}
        </article>
        <aside>discord side</aside>
      </div>

      <p></p>
    </div>
  );
}

export default App;
