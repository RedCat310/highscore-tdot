import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { collection, deleteDoc, doc, getDocs, onSnapshot, setDoc } from "firebase/firestore";
import { useState } from "react";
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
    const [loader, setLoader] = useState(false);
    const [show2, setShow2] = useState(false);
    const [modalData2, setModalData2] = useState("");
    const [password2, setPassword2] = useState("");
    const handleClose2 = () => setShow2(false);
    const [loader2, setLoader2] = useState(false);
    const [modal2DataArray, setmodal2DataArray] = useState([]);

  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, "santaClausGame"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data() , id: doc.id }));
      let length = data.length;
      for (let i = 0; i < data.length; i++) {
        const el = data[i];
        if(el.dontUse){
          data.splice(i, 1);
          length--;
        }        
      }
      setSantaClausGamePlayer(length);
      data.sort((a, b) => b.score - a.score);
      
      setSantaClausGame(data.slice(0, 10));
    });
    const unsub2 = onSnapshot(collection(db, "carGame1"), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ ...doc.data() , id: doc.id }));
      let length = data.length;
      for (let i = 0; i < data.length; i++) {
        const el = data[i];
        if(el.dontUse){
          data.splice(i, 1);
          length--;
        }        
      }
      setCarGame1Player(length);
      data.sort((a, b) => b.score - a.score);
      setCarGame1(data.slice(0, 10));
    });
    const unsub3 = onSnapshot(collection(db, "astroidsGame"), (snapshot) => {
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
    return () => {
      unsub1();
      unsub2();
      unsub3();
    }
  }, []);

  const clearGame = async (game) => {
    if(game !== "end"){
      setShow(true);
      setModalData(game);
      return;
    }
    if(password === "Rosti123!"){
      setLoader(true);
      let rawData = await getDocs(collection(db, modalData));
      let data = rawData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      for (let i = 0; i < data.length; i++) {
        await deleteDoc(doc(db, modalData, data[i].id));
      }
      await setDoc(doc(db, modalData, "example"), {
        dontUse: true,
      });
    } else {
      alert("Falsches Passwort");
    }
    setLoader(false);
    setShow(false);
    setPassword("");
    setModalData("");
  };

  const getRankings = (gameData) => {
    if(gameData){
      let rankings = [];
      let rank = 1;
      let arrLength = gameData.length;
      for (let i = 0; i < arrLength; i++) {
        if (i > 0 && gameData[i]?.score < gameData[i - 1].score) {
          rank = i + 1;
        }
        rankings.push({ ...gameData[i], rank });
      }
      return rankings;
    }else return gameData
  };

  const deletePlayer = (id, game, name, rank, score) => {
    if(id !== "end"){
      setShow2(true)
      setModalData2('Willst du wirklich Spieler: "' + name + '" mit dem Score von ' + score + ' und der Platzierung von ' + rank + ' löschen?')
      setmodal2DataArray([ id, game ])
      return
    }
    console.log(password2);
    if(password2 === "Rosti123!"){
      setLoader2(true)
      try {
        deleteDoc(doc(db, modal2DataArray[1], modal2DataArray[0]))
      } catch (error) {
        console.error(error)
      }
    }else{
      alert("Falsches Passwort");
    }
    setLoader2(false)
    setShow2(false)
    setPassword2("")
    setModalData2("")
  }

  return (
    <div className='mt-2' style={{maxWidth: '90%', margin: 'auto', height: '800px'}}>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Löschen von "{modalData}" bestätigen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            { loader ? <div className="loader">
          <div className="box1"></div>
          <div className="box2"></div>
          <div className="box3"></div>
        </div> : <><FormLabel>Passwort eingeben</FormLabel>
          <FormControl type='password' value={password} onChange={(e) => setPassword(e.target.value)} /></> }
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
      <Modal show={show2} onHide={handleClose2}>
        <Modal.Header closeButton>
          <Modal.Title>{modalData2} </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            { loader2 ? <div className="loader">
          <div className="box1"></div>
          <div className="box2"></div>
          <div className="box3"></div>
        </div> : <><FormLabel>Passwort eingeben</FormLabel>
          <FormControl type='password' value={password2} onChange={(e) => setPassword2(e.target.value)} /></> }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Close
          </Button>
          <Button variant="danger" onClick={() => deletePlayer("end")}>
            Löschen bestätigen
          </Button>
        </Modal.Footer>
      </Modal>
      <h1 style={{ textAlign: 'center', fontSize: '60px' }}>Highscores</h1>
      <h3 style={{ textAlign: 'center' }} className='mb-5'>Computer-AG -  Tag der Offenen Tür - 07.02.2025</h3>
      <Row data-bs-theme="light">
        <Col>
        <Card style={{ height: '800px' }}>
          <Card.Img variant="top" src="./santaclaus.jpg" />
          <Card.Header>
            <h2 style={{ display: 'inline' }}>Santaclaus</h2>
            <Badge  onClick={() => clearGame("santaClausGame")} bg="primary" style={{ fontSize: '15px', float: 'right' }}>{santaClausGamePlayer}</Badge>
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
                  <tr onClick={() => deletePlayer(player.id, 'santaClausGame', player.name, player.rank, player.score)} key={player.id}>
                    <td>{player.rank === 1 ? <img alt='' src='./gold.png' style={{ width: '20px' }} /> : null}
                    {player.rank === 2 ? <img alt='' src='./silber.png' style={{ width: '20px' }} /> : null}
                    {player.rank === 3 ? <img alt='' src='./bronze.png' style={{ width: '20px' }} /> : null}</td>
                    <td className={player.rank <= 3 ? 'pulse text-end' : 'text-end'}>{player.rank}.</td>
                    <td className={player.rank <= 3 ? 'pulse' : null}>{player.name}</td>
                    <td className={player.rank <= 3 ? 'pulse text-end' : 'text-end'}>{player.score}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
        </Col>
        <Col>
          <Card style={{ height: '800px' }}>
            <Card.Img variant="top" src="./cargame.png" />
            <Card.Header>
              <h2 style={{ display: 'inline' }}>JrRacing</h2>
              <Badge onClick={() => clearGame("carGame1")} bg="primary" style={{ fontSize: '15px', float: 'right' }}>{carGame1Player}</Badge>
            </Card.Header>
            <Card.Body>
              <Table style={{ fontSize: '20px' }}>
                <tbody>
                  { getRankings(carGame1)?.map((player) => (
                    <tr onClick={() => deletePlayer(player.id, 'carGame1', player.name, player.rank, player.score)} key={player.id}>
                      <td>{player.rank === 1 ? <img alt='' src='./gold.png' style={{ width: '20px' }} /> : null}
                    {player.rank === 2 ? <img alt='' src='./silber.png' style={{ width: '20px' }} /> : null}
                    {player.rank === 3 ? <img alt='' src='./bronze.png' style={{ width: '20px' }} /> : null}</td>
                      <td className={player.rank <= 3 ? 'pulse text-end' : 'text-end'}>{player.rank}.</td>
                      <td className={player.rank <= 3 ? 'pulse' : null}>{player.name}</td>
                      <td className={player.rank <= 3 ? 'pulse text-end' : 'text-end'}>{player.score}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ height: '800px' }}>
            <Card.Img variant="top" src="./astroids.jpg" />
            <Card.Header>
              <h2 style={{ display: 'inline' }}>Astroids</h2>
              <Badge onClick={() => clearGame("astroidsGame")} bg="primary" style={{ fontSize: '15px', float: 'right' }}>{astroidsGamePlayer}</Badge>
            </Card.Header>
            <Card.Body>
              <Table style={{ fontSize: '20px' }}>
                <tbody>
                  { getRankings(astroidsGame)?.map((player) => (
                    <tr onClick={() => deletePlayer(player.id, 'astroidsGame', player.name, player.rank, player.score)} key={player.id}>
                      <td>{player.rank === 1 ? <img alt='' src='./gold.png' style={{ width: '20px' }} /> : null}
                    {player.rank === 2 ? <img alt='' src='./silber.png' style={{ width: '20px' }} /> : null}
                    {player.rank === 3 ? <img alt='' src='./bronze.png' style={{ width: '20px' }} /> : null}</td>
                      <td className={player.rank <= 3 ? 'pulse text-end' : 'text-end'}>{player.rank}.</td>
                      <td className={player.rank <= 3 ? 'pulse' : null}>{player.name}</td>
                      <td className={player.rank <= 3 ? 'pulse text-end' : 'text-end'}>{player.score}</td>
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