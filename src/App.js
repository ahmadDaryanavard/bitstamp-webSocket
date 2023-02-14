import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import styled from "styled-components";
import Loading from "./components/Loading";

const Div = styled.div`
  .bids-header {
    flex-direction: row;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  .asks-header {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
    margin-top: 20px;
  }
`;

function App() {
  const [currentCurrency, setCurrency] = useState("BTC/USD");
  const [loading, setLoading] = useState(true);
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  useEffect(() => {
    setLoading(true);
    const webSocket = new WebSocket("wss://ws.bitstamp.net");

    const btcUsdApi = {
      event: "bts:subscribe",
      data: { channel: "order_book_btcusd" },
    };
    const btcEurApi = {
      event: "bts:subscribe",
      data: { channel: "order_book_btceur" },
    };
    const ethBtcApi = {
      event: "bts:subscribe",
      data: { channel: "order_book_ethbtc" },
    };
    const ethUsdApi = {
      event: "bts:subscribe",
      data: { channel: "order_book_ethusd" },
    };

    webSocket.onopen = () => {
      switch (currentCurrency) {
        case "BTC/USD":
          return webSocket.send(JSON.stringify(btcUsdApi));
        case "BTC/EUR":
          return webSocket.send(JSON.stringify(btcEurApi));
        case "ETH/BTC":
          return webSocket.send(JSON.stringify(ethBtcApi));
        case "ETH/USD":
          return webSocket.send(JSON.stringify(ethUsdApi));
        default:
          return webSocket.send(JSON.stringify(btcUsdApi));
      }
    };

    webSocket.onmessage = function (event) {
      const json = JSON.parse(event.data);

      try {
        if (json.event === "data" && json.data.bids !== undefined) {
          setBids(json.data.bids.slice(0, 5));
          setAsks(json.data.asks.reverse().slice(0, 5));
          setLoading(false);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    return () => webSocket.close();
  }, [currentCurrency]);

  return (
    <Div className="container mt-5">
      <Loading shown={loading} />
      <div className="row">
        <div className=" col-lg-4 col-12">
          <Form.Select
            className="my-4"
            aria-label="Default select 1"
            onChange={(event) => setCurrency(event.target.value)}
          >
            <option value="BTC/USD">BTC/USD</option>
            <option value="BTC/EUR">BTC/EUR</option>
            <option value="ETH/BTC">ETH/BTC</option>
            <option value="ETH/USD">ETH/USD</option>
          </Form.Select>
        </div>
      </div>
      <div className="bids-header">{currentCurrency} Bids</div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {bids.map((bid, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{bid[0]}</td>
              <td>{bid[1]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div className="asks-header">{currentCurrency} Asks</div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Price</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {asks.map((ask, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{ask[0]}</td>
              <td>{ask[1]}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p>This is an example of how to use web socket in react with help of bitstamp webSocket api.</p>
      <p>We are showing realtime information about bids and asks for some specific crypto currencies.</p>
    </Div>
  );
}

export default App;
