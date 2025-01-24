import React from 'react';
import ReactDOM from 'react-dom/client';
import { collection, deleteDoc, doc, getDocs, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { Card, Table, Row, Col, Badge, Modal, Button, FormControl, FormLabel } from 'react-bootstrap'; // Importiere React-Bootstrap Komponenten
import './style.css'



function App() {
    const [santaClausGame, setSantaClausGame] = useState(null);
    const [santaClausGamePlayer, setSantaClausGamePlayer] = useState(0); 
    const [carGame1, setCarGame1] = useState(null);
    const [carGame1Player, setCarGame1Player] = useState(0); 
    const [astroidsGame, setAstroidsGame] = useState(null);
    const [astroidsGamePlayer, setAstroidsGamePlayer] = useState(0); 
    const [show, setShow] = useState(false);
    const [modalData, setModalData] = useState("");
    const [password, setPassword] = useState("");
    const handleClose = () => setShow(false);

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
          data.splice(i, 1);
          length--
        }        
      }
      setAstroidsGamePlayer(length);
      data.sort((a, b) => b.score - a.score);
      setAstroidsGame(data.slice(0, 10));
    });
  })

  const clearGame = async (game) => {
    if(game !== "end"){
      setShow(true)
      setModalData(game)
      return;
    }
    if(password == "Rosti123!"){
      let rawData = await getDocs(collection(db, modalData))
      let data = rawData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      for (let i = 0; i < data.length; i++) {
        await deleteDoc(doc(db, modalData, data[i].id))
      }
      await setDoc(doc(db, modalData, "example"), {
        dontUse: true,
      })
    }else{
      alert("Falsches Passwort");
    }
    setShow(false)
    setPassword("")
    setModalData("")
  }

  const getRankings = (gameData) => {
    if(gameData){
      let rankings = [];
      let rank = 1;
      let arrLength = gameData.length === 10 ? gameData.length : gameData.length - 1
      for (let i = 0; i < arrLength; i++) {
        if (i > 0 && gameData[i]?.score < gameData[i - 1].score) {
          rank = i + 1;
        }
        rankings.push({ ...gameData[i], rank });
      }
      return rankings;
    }else return gameData
  };

  return (
    <div className='mt-2' style={{maxWidth: '90%', margin: 'auto', height: '800px'}}>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Löschen von "{modalData}" bestätigen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormLabel>Passwort eingeben</FormLabel>
         <FormControl type='password' value={password} onChange={(e) => setPassword(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger" onClick={() => clearGame("end")}>
            Löschen bestätigen
          </Button>
        </Modal.Footer>
      </Modal>
      <h1 style={{ textAlign: 'center', fontSize: '60px' }}>Highscores</h1>
      <h3 style={{ textAlign: 'center' }} className='mb-5'>Computer-AG -  Tag der Offenen Tür - 07.02.2025</h3>
      <Row data-bs-theme="light">
        <Col>
        <Card style={{ height: '800px' }}>
          <Card.Img variant="top" src="./game-test.jpg" style={{ height: '200px', width: '550px' }} />
          <Card.Header>
            <h2 style={{ display: 'inline' }}>Santaclaus</h2>
            <Badge  onClick={() => clearGame("santaClausGame")} bg="primary" style={{ fontSize: '20px', float: 'right' }}>{santaClausGamePlayer}</Badge>
          </Card.Header>
          <Card.Body>
            {/* <h4 className="mb-4">Es { santaClausGamePlayer === 1  ? "hat" : "haben" } { santaClausGamePlayer === 0 ?  "noch keine" : santaClausGamePlayer } Spieler teilgenommen</h4> */}
            <Table  style={{ fontSize: '20px' }}>
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
                    {player.rank === 1 ? <img alt='' src='./gold.png' style={{ width: '40px' }} /> : null}
                    {player.rank === 2 ? <img alt='' src='./silber.png' style={{ width: '40px' }} /> : null}
                    {player.rank === 3 ? <img alt='' src='./bronze.png' style={{ width: '40px' }} /> : null}
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
          <Card style={{ height: '800px' }}>
            <Card.Img variant="top" src="./game-test.jpg" style={{ height: '200px', width: '550px' }}/>
            <Card.Header>
              <h2 style={{ display: 'inline' }}>Autospiel</h2>
              <Badge onClick={() => clearGame("carGame1")} bg="primary" style={{ fontSize: '20px', float: 'right' }}>{carGame1Player}</Badge>
            </Card.Header>
            <Card.Body>
              <Table style={{ fontSize: '20px' }}>
                <tbody>
                  { getRankings(carGame1)?.map((player) => (
                    <tr key={player.id}>
                      {player.rank === 1 ? <img alt='' src='./gold.png' style={{ width: '40px' }} /> : null}
                      {player.rank === 2 ? <img alt='' src='./silber.png' style={{ width: '40px' }} /> : null}
                      {player.rank === 3 ? <img alt='' src='./bronze.png' style={{ width: '40px' }} /> : null}
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
          <Card style={{ height: '800px' }}>
            <Card.Img variant="top" src="./game-test.jpg" style={{ height: '200px', width: '550px' }}/>
            <Card.Header>
              <h2 style={{ display: 'inline' }}>Astroids</h2>
              <Badge onClick={() => clearGame("astroidsGame")} bg="primary" style={{ fontSize: '20px', float: 'right' }}>{astroidsGamePlayer}</Badge>
            </Card.Header>
            <Card.Body>
              <Table style={{ fontSize: '20px' }}>
                <tbody>
                  { getRankings(astroidsGame)?.map((player) => (
                    <tr key={player.id}>
                      {player.rank === 1 ? <img alt='' src='./gold.png' style={{ width: '40px' }} /> : null}
                      {player.rank === 2 ? <img alt='' src='./silber.png' style={{ width: '40px' }} /> : null}
                      {player.rank === 3 ? <img alt='' src='./bronze.png' style={{ width: '40px' }} /> : null}
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
      <footer className="page-footer font-small blue pt-4">
        <div className="footer-copyright text-center py-3">Erstellt von Luis Klembt, 9c</div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);