import React from 'react';
import ReactDOM from 'react-dom/client';
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { Card, Table, Row, Col } from 'react-bootstrap'; // Importiere React-Bootstrap Komponenten


function App() {
    const [santaClausGame, setSantaClausGame] = useState(null);
    const [santaClausGamePlayer, setSantaClausGamePlayer] = useState(0); 
    const [carGame2, setCarGame2] = useState(null);
    const [carGame2Player, setCarGame2Player] = useState(0); 
    const [carGame1, setCarGame1] = useState(null);
    const [carGame1Player, setCarGame1Player] = useState(0); 
    const [astroidsGame, setAstroidsGame] = useState(null);
    const [astroidsGamePlayer, setAstroidsGamePlayer] = useState(0); 
    


  useEffect(() => {
    onSnapshot(collection(db, "santaClausGame"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data() , id: doc.id }));
      let length = data.length;
      for (let i = 0; i < data.length; i++) {
        const el = data[i];
        if(el.dontUse){
          delete data[i];
          length--;
        }        
      }
      setSantaClausGamePlayer(length);
      data.sort((a, b) => b.score - a.score);
      setSantaClausGame(data.slice(0, 10));
    });
    onSnapshot(collection(db, "carGame2"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data() , id: doc.id }));
      let length = data.length;
      for (let i = 0; i < data.length; i++) {
        const el = data[i];
        if(el.dontUse){
          delete data[i];
          length--;
        }        
      }
      setCarGame2Player(length);
      data.sort((a, b) => b.score - a.score);
      setCarGame2(data.slice(0, 10));
    });
    onSnapshot(collection(db, "carGame1"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data() , id: doc.id }));
      let length = data.length;
      for (let i = 0; i < data.length; i++) {
        const el = data[i];
        if(el.dontUse){
          delete data[i];
          length--;
        }        
      }
      setCarGame1Player(length);
      data.sort((a, b) => b.score - a.score);
      setCarGame1(data.slice(0, 10));
    });
    onSnapshot(collection(db, "astroidsGame"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data() , id: doc.id }));
      let length = data.length;
      for (let i = 0; i < data.length; i++) {
        const el = data[i];
        if(el.dontUse){
          delete data[i];
          length--;
        }        
      }
      setAstroidsGamePlayer(length);
      data.sort((a, b) => b.score - a.score);
      setAstroidsGame(data.slice(0, 10));
    });
  })

  return (
    <div className='mt-5' style={{maxWidth: '90%', margin: 'auto'}}>
      <h1 className='m-5'>Tabelle mit den 10 besten Spielern aus der Spielerecke</h1>
      <Row>
        <Col>
        <Card>
          <Card.Header><h2>Santaclaus</h2></Card.Header>
          <Card.Body>
            <h4 className="mb-4">Es { santaClausGamePlayer === 1  ? "hat" : "haben" } { santaClausGamePlayer === 0 ?  "noch keine" : santaClausGamePlayer } Spieler teilgenommen</h4>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Platzierung</th>
                  <th>Spielername</th>
                  <th>Punkte</th>
                </tr>
              </thead>
              <tbody>
                { santaClausGame?.map((player, index) => (
                  <tr key={player.id}>
                    <td>{index + 1}</td>
                    <td>{player.name}</td>
                    <td>{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header><h2>Autospiel Drifting</h2></Card.Header>
            <Card.Body>
              <h4 className="mb-4">Es { carGame2Player === 1  ? "hat" : "haben" } { carGame2Player === 0 ?  "noch keine" : carGame2Player } Spieler teilgenommen</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Platzierung</th>
                    <th>Spielername</th>
                    <th>Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  { carGame2?.map((player, index) => (
                    <tr key={player.id}>
                      <td>{index + 1}</td>
                      <td>{player.name}</td>
                      <td>{player.score}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header><h2>Autospiel Strecke</h2></Card.Header>
            <Card.Body>
              <h4 className="mb-4">Es { carGame1Player === 1  ? "hat" : "haben" } { carGame1Player === 0 ?  "noch keine" : carGame1Player } Spieler teilgenommen</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Platzierung</th>
                    <th>Spielername</th>
                    <th>Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  { carGame1?.map((player, index) => (
                    <tr key={player.id}>
                      <td>{index + 1}</td>
                      <td>{player.name}</td>
                      <td>{player.score}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header><h2>Astroids</h2></Card.Header>
            <Card.Body>
              <h4 className="mb-4">Es { astroidsGamePlayer === 1  ? "hat" : "haben" } { astroidsGamePlayer === 0 ?  "noch keine" : astroidsGamePlayer } Spieler teilgenommen</h4>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Platzierung</th>
                    <th>Spielername</th>
                    <th>Punkte</th>
                  </tr>
                </thead>
                <tbody>
                  { astroidsGame?.map((player, index) => (
                    <tr key={player.id}>
                      <td>{index + 1}</td>
                      <td>{player.name}</td>
                      <td>{player.score}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);