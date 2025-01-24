import React from 'react';
import ReactDOM from 'react-dom/client';
import { collection, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { Card, Table, Row, Col, Badge } from 'react-bootstrap'; // Importiere React-Bootstrap Komponenten
import './style.css'



function App() {
    const [santaClausGame, setSantaClausGame] = useState(null);
    const [santaClausGamePlayer, setSantaClausGamePlayer] = useState(0); 
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

  const getRankings = (gameData) => {
    if(gameData){
      let rankings = [];
      let rank = 1;
      for (let i = 0; i < gameData.length - 1; i++) {
        if (i > 0 && gameData[i]?.score < gameData[i - 1].score) {
          rank = i + 1;
        }
        rankings.push({ ...gameData[i], rank });
      }
      return rankings;
    }else return gameData
  };

  return (
    <div className='mt-5' style={{maxWidth: '90%', margin: 'auto', height: '800px'}}>
      <h1 style={{ textAlign: 'center', fontSize: '60px' }}>Highscores</h1>
      <h3 style={{ textAlign: 'center' }} className='mb-5'>Computer-AG -  Tag der Offenen Tür - 07.02.2025</h3>
      <Row data-bs-theme="light">
        <Col>
        <Card>
          <Card.Img variant="top" src="./game-test.jpg" />
          <Card.Header>
            <h2 style={{ display: 'inline' }}>Santaclaus</h2>
            <Badge bg="primary" style={{ fontSize: '20px', float: 'right' }}>{santaClausGamePlayer}</Badge>
          </Card.Header>
          <Card.Body>
            {/* <h4 className="mb-4">Es { santaClausGamePlayer === 1  ? "hat" : "haben" } { santaClausGamePlayer === 0 ?  "noch keine" : santaClausGamePlayer } Spieler teilgenommen</h4> */}
            <Table  style={{ fontSize: '30px' }}>
              {/* <thead>
                <tr>
                  <th>Platzierung</th>
                  <th>Spielername</th>
                  <th>Punkte</th>
                </tr>
              </thead> */}
              <tbody>
                { getRankings(santaClausGame)?.map((player) => (
                  <tr key={player.id}>
                    <td className={player.rank <= 3 ? 'pulse' : null}>{player.rank}</td>
                    <td className={player.rank <= 3 ? 'pulse' : null}>{player.name}</td>
                    <td className={player.rank <= 3 ? 'pulse' : null}>{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        </Col>
        <Col>
          <Card>
            <Card.Img variant="top" src="./game-test.jpg" />
            <Card.Header>
              <h2 style={{ display: 'inline' }}>Autospiel</h2>
              <Badge bg="primary" style={{ fontSize: '20px', float: 'right' }}>{carGame1Player}</Badge>
            </Card.Header>
            <Card.Body>
              <Table style={{ fontSize: '30px' }}>
                <tbody>
                  { getRankings(carGame1)?.map((player) => (
                    <tr key={player.id}>
                      <td className={player.rank <= 3 ? 'pulse' : null}>{player.rank}</td>
                      <td className={player.rank <= 3 ? 'pulse' : null}>{player.name}</td>
                      <td className={player.rank <= 3 ? 'pulse' : null}>{player.score}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Img variant="top" src="./game-test.jpg" />
            <Card.Header>
              <h2 style={{ display: 'inline' }}>Astroids</h2>
              <Badge bg="primary" style={{ fontSize: '20px', float: 'right' }}>{astroidsGamePlayer}</Badge>
            </Card.Header>
            <Card.Body>
              <Table style={{ fontSize: '30px' }}>
                <tbody>
                  { getRankings(astroidsGame)?.map((player) => (
                    <tr key={player.id}>
                      <td className={player.rank <= 3 ? 'pulse' : null}>{player.rank}</td>
                      <td className={player.rank <= 3 ? 'pulse' : null}>{player.name}</td>
                      <td className={player.rank <= 3 ? 'pulse' : null}>{player.score}</td>
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