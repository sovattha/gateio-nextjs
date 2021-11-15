import axios, { AxiosRequestConfig } from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../../styles/orders.module.css';

const Home: NextPage = () => {
  const [pair, setPair] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [side, setSide] = useState('buy');
  const [result, setResult] = useState({});

  async function saveOrder() {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `https://${process.env.NEXT_PUBLIC_ASTRA_DB_ID}-${process.env.NEXT_PUBLIC_ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/namespaces/${process.env.NEXT_PUBLIC_ASTRA_DB_NAMESPACE}/collections/orders`,
      headers: {
        accept: 'application/json',
        'X-Cassandra-Token': process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN || '',
        'Content-Type': 'application/json',
      },
      data: {
        pair,
        price,
        amount,
        side,
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
          <div className={styles.card} onClick={() => saveOrder()}>
            <button>Submit</button>
          </div>
          <div>
            <code>{JSON.stringify(result)}</code>
          </div>
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
