import axios, { AxiosRequestConfig } from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../../styles/orders.module.css';

type Order = {
  pair: string;
  amount: string;
  price: string;
  side: string;
};

const Home: NextPage = () => {
  const [pair, setPair] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [side, setSide] = useState('buy');
  const [result, setResult] = useState({});

  const [amount1, setAmount1] = useState(0);
  const [pct1, setPct1] = useState(2);  
  const [price1, setPrice1] = useState(0);
  
  const [amount2, setAmount2] = useState(0);
  const [pct2, setPct2] = useState(4);  
  const [price2, setPrice2] = useState(0);
  
  const [amount3, setAmount3] = useState(0);
  const [pct3, setPct3] = useState(10);  
  const [price3, setPrice3] = useState(0);
    
  const [amount4, setAmount4] = useState(0);
  const [pct4, setPct4] = useState(0);  
  const [price4, setPrice4] = useState(0);
    
  const [amount5, setAmount5] = useState(0);
  const [pct5, setPct5] = useState(0);  
  const [price5, setPrice5] = useState(0);
  
  const [orders, setOrders] = useState([] as Order[]);

  useEffect(() => {
    setAmount1(+amount * +pct1);
    const newOrders = [];
    newOrders.push({
      pair,
      amount,
      price,
      side,
    });
    setOrders(newOrders);
  }, [pair, amount, price, side])

  async function saveOrders() {
    for (const newOrder of orders) {
      saveOrder(newOrder);
    }
  }

  async function saveOrder(order: Order) {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `https://${process.env.NEXT_PUBLIC_ASTRA_DB_ID}-${process.env.NEXT_PUBLIC_ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/namespaces/${process.env.NEXT_PUBLIC_ASTRA_DB_NAMESPACE}/collections/orders`,
      headers: {
        accept: 'application/json',
        'X-Cassandra-Token': process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN || '',
        'Content-Type': 'application/json',
      },
      data: {
        pair: order.pair,
        price: order.price,
        amount: order.amount,
        side: order.side,
      },
    };
    axios(config)
      .then(function (response) {
        const responseData = response.data;
        console.log(responseData);
        setResult(responseData);
      })
      .catch(function (error) {
        console.log(error);
        setResult(error);
      });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Gate.io trading bot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Gate.io trading bot</h1>
        <p className={styles.description}>Create a new order</p>
        <div className={styles.grid}>
          <div className={styles.card}>
            <label>Pair:</label>
            <input type="text" value={pair} onChange={(event) => setPair(event.target.value)} />
          </div>
          <div className={styles.card}>
            <label>Amount:</label>
            <input type="text" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </div>
          <div className={styles.card}>
            <label>Price:</label>
            <input type="text" value={price} onChange={(event) => setPrice(event.target.value)} />
          </div>
          <div className={styles.card}>
            <label>Side:</label>
            <select value={side} onChange={(event) => setSide(event.target.value)}>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
        </div>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>Target 1</h3>
            {side === 'buy' ? 'sell' : 'buy'}{' '}
            <label>Percentage:</label>
            <input type="text" value={pct1} onChange={(event) => setPct1(+event.target.value)}  />
            <label>Amount:</label>
            <input type="text" value={amount1} onChange={(event) => setAmount1(+event.target.value)}  />
            <label> @ Price:</label>
            <input type="text" value={amount1} onChange={(event) => setPrice1(+event.target.value)}  />
          </div>
          <div className={styles.card} onClick={() => saveOrders()}>
            <button>Submit</button>
          </div>
          <div>
            <code>{JSON.stringify(result)}</code>
          </div>
        </div>
        <div className={styles.grid}>
          {orders.map(order => <div className={styles.card}>
            {order.side} {order.amount} {order.pair} @ {order.price}
          </div>)}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
