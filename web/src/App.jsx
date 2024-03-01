import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [allWaves, setAllWaves] = useState([]);
  const [message, setMessage] = useState(''); // Declare a state variable...

  const contractAddress = "0x481f89361cbF230663d679b2001Abf6918101C95";
  const contractABI = abi.abi;
  
  const getAllWaves = async () => {
    const { ethereum } = window;

    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        const waves = await wavePortalContract.getAllWaves();

        const wavesCleaned = waves.map(wave => {
          return {
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message,
          };
        });

        setAllWaves(wavesCleaned);
      } else {
        console.log("Objeto Ethereum inexistente!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const wave = async () => {
      try {
        const { ethereum } = window;


        if(!message || message == ""){
          alert("É necessário adicionar uma mensagem")
          return;
        }
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

          let count = await wavePortalContract.getTotalWaves();
          console.log("Recuperado o número de tchauzinhos...",       
          count.toNumber());
  
          const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
          console.log("Minerando...", waveTxn.hash);

          await waveTxn.wait();
          console.log("Minerado -- ", waveTxn.hash);

          count = await wavePortalContract.getTotalWaves();
          console.log("Total de tchauzinhos recuperado...",               
          count.toNumber());
          
        } else {
          console.log("Objeto Ethereum não encontrado!");
        }
      } catch (error) {
        console.log(error)
      }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("MetaMask nao encontrada!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Conectado", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }
  
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Garanta que possua a Metamask instalada!");
        return;
      } else {
        console.log("Temos o objeto ethereum", ethereum);
      }
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Encontrada a conta autorizada:", account);
        setCurrentAccount(account)
      } else {
        console.log("Nenhuma conta autorizada foi encontrada")
      }
    } catch (error) {
      console.log(error);
    }

    
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getAllWaves();
  }, [])

  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("newWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("newWave", onNewWave);
      }
    };
  }, []);


  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Olá Pessoal!
        </div>

        <div className="bio">
        Conecte sua Ethereum wallet e me manda um tchauzinho!
        </div>
      

        <div classr="column">
          <label>
            Mensagem:    
              <input
              value={message} 
              onChange={e => setMessage(e.target.value)} 
            />
          </label>
          <div/>
          <button className="waveButton" onClick={wave}>
             <span className="wave-text-button">
                Mandar Tchauzinho
             </span>
          </ button>
        </div>


        {!currentAccount && (
      
          <button className="waveButton" onClick={connectWallet}>
            <span className="wave-text-button">Conectar carteira</span>
          </button>
        )}


        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Endereço: {wave.address}</div>
              <div>Data/Horário: {wave.timestamp.toString()}</div>
              <div>Mensagem: {wave.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
