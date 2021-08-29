import "./App.css";
import React, { useRef, useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";
import apiService from "./utils/apiService";
import Globe from 'react-globe.gl';
import * as d3 from "d3";


import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100vh",
  height: "100vw",
  display: "block",
};

const center = {
  lat: 42.360081,
  lng: -71.058884,
};

function CollectionList(props) {
  const stuff = props.collectionList.map((obj) => (
    <img
      className="collectionImage"
      src={obj.image_url}
      key={obj.slug}
      alt={obj.name}
    />
  ));
  return <div className="collectionsContainer">{stuff}</div>;
}

function App() {
  const [search, setSearch] = useState("");
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

      apiService.createAccount(userAddress);

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
  const globeEl = useRef();
  const [popData, setPopData] = useState([]);

  useEffect(() => {
    // load data
    fetch('/world_population.csv').then(res => res.text())
        .then(csv => d3.csvParse(csv, ({ lat, lng, pop }) => ({ lat: +lat, lng: +lng, pop: +pop })))
        .then(setPopData);
  }, []);

  useEffect(() => {
    // Auto-rotate
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.1;
  }, []);

  const weightColor = d3.scaleSequentialSqrt(d3.interpolateYlOrRd)
      .domain([0, 1e7]);

  return (
    <div className="App">
      <div className="navbar">
        <button onclick={() => alert(1)} className="walletConnectButton">
          WALLET CONNECT
        </button>
      </div>
      <header className="App-header">
        <div className="searchDiv">
          <input
            className="searchBar"
            type="text"
            placeholder="eg. Los Angeles, CA"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input className="searchButton" type="submit" />
        </div>
      </header>

      <div className="pageBody">
        <aside className="collections">
          <CollectionList collectionList={collectionList} />
        </aside>
        <article>
                <Globe
                    ref={globeEl}
                    globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                    bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                    backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
                    hexBinPointsData={popData}
                    hexBinPointWeight="pop"
                    hexAltitude={d => d.sumWeight * 6e-8}
                    hexBinResolution={4}
                    hexTopColor={d => weightColor(d.sumWeight)}
                    hexSideColor={d => weightColor(d.sumWeight)}
                    hexBinMerge={true}
                    enablePointerInteraction={true}
                    onGlobeClick={(event, point) => {
                        console.log(point);
                    }}
                />
        </article>
        <aside>discord side</aside>
      </div>

      <p></p>
    </div>
  );
}

export default App;
