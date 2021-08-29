import "./App.css";
import React, { useRef, useState, useEffect } from "react";
import { ethers } from "ethers";
import axios from "axios";

import { Canvas, useFrame } from "@react-three/fiber";

function Box(props) {
  // This reference will give us direct access to the THREE.Mesh object
  const ref = useRef();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += 0.01));
  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

function CollectionList(props) {
  const stuff = props.collectionList.map((obj) => (
    <li>
      <div>{obj.name}</div>
    </li>
  ));
  return <ul>{stuff}</ul>;
}

function App() {
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
        <article>
          <Canvas>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />
          </Canvas>
        </article>
        <aside>
          <CollectionList collectionList={collectionList} />
        </aside>
        <aside>discord side</aside>
      </div>

      <p></p>
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Box position={[-1.2, 0, 0]} />
        <Box position={[1.2, 0, 0]} />
      </Canvas>
    </div>
  );
}

export default App;
