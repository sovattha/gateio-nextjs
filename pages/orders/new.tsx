import axios, { AxiosRequestConfig } from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/orders.module.css';

type Order = {
  pair: string;
  amount: string;
  price: string;
  side: string;
};

const INITIAL_PORTFOLIO_AMOUNT = 1e4;

const Home: NextPage = () => {
  const [portfolioAmount, setPortfolioAmount] = useState(INITIAL_PORTFOLIO_AMOUNT);

  const [pair, setPair] = useState('');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');
  const [side, setSide] = useState('buy');
  const [result, setResult] = useState({});

  const [amount1, setAmount1] = useState('');
  const [pct1, setPct1] = useState('');
  const [price1, setPrice1] = useState('');

  const [amount2, setAmount2] = useState('');
  const [pct2, setPct2] = useState('');
  const [price2, setPrice2] = useState('');

  const [amount3, setAmount3] = useState('');
  const [pct3, setPct3] = useState('');
  const [price3, setPrice3] = useState('');

  const [amount4, setAmount4] = useState('');
  const [pct4, setPct4] = useState('');
  const [price4, setPrice4] = useState('');

  const [amount5, setAmount5] = useState('');
  const [pct5, setPct5] = useState('');
  const [price5, setPrice5] = useState('');

  const [orders, setOrders] = useState([] as Order[]);

  const PriceInput = (props: { price: string; setPrice(price: string): void }) => (
    <>
      <input type="text" value={props.price} onChange={(event) => props.setPrice(event.target.value)} />
      <button onClick={(event) => props.setPrice(`${+price * 2}`)}>x2</button>
      <button onClick={(event) => props.setPrice(`${+price * 4}`)}>x4</button>
      <button onClick={(event) => props.setPrice(`${+price * 10}`)}>x10</button>
      <button onClick={(event) => props.setPrice(`${+price * 20}`)}>x20</button>
      <button onClick={(event) => props.setPrice(`${+price * 50}`)}>x50</button>
    </>
  );

  const PercentageInput = (props: { pct: string; setPct: (pct: string) => void }) => (
    <>
      <input type="text" value={props.pct} onChange={(event) => props.setPct(event.target.value)} />
      <button onClick={(event) => props.setPct(`25`)}>25%</button>
      <button onClick={(event) => props.setPct(`50`)}>50%</button>
      <button onClick={(event) => props.setPct(`75`)}>75%</button>
      <button onClick={(event) => props.setPct(`100`)}>100%</button>
    </>
  );

  useEffect(() => {
    if (amount && pct1) setAmount1(`${(+amount * +pct1) / 100}`);
    if (amount && pct2) setAmount2(`${(+amount * +pct2) / 100}`);
    if (amount && pct3) setAmount3(`${(+amount * +pct3) / 100}`);
    if (amount && pct4) setAmount4(`${(+amount * +pct4) / 100}`);
    if (amount && pct5) setAmount5(`${(+amount * +pct5) / 100}`);
  }, [amount, pct1, pct2, pct3, pct4, pct5]);

  useEffect(() => {
    if (price) {
      setPrice1(`${+price * 4}`);
      setPrice2(`${+price * 10}`);
      setPrice3(`${+price * 20}`);
      setPrice4(`${+price * 50}`);
      setPct1('25');
      setPct2('25');
      setPct3('25');
      setPct4('25');
    }
    const newOrders = [];
    newOrders.push({
      pair,
      amount,
      price,
      side,
    });
    setOrders(newOrders);
  }, [amount, price, pair, side]);

  useEffect(() => {
    const newOrders = Array(5);
    if (side && pair && amount && price) {
      newOrders[0] = {
        side,
        pair,
        amount,
        price,
      };
    }
    if (side && pair && amount1 && price1) {
      newOrders[1] = {
        side: side === 'buy' ? 'sell' : 'buy',
        pair,
        amount: amount1,
        price: price1,
      };
    }
    if (side && pair && amount2 && price2) {
      newOrders[2] = {
        side: side === 'buy' ? 'sell' : 'buy',
        pair,
        amount: amount2,
        price: price2,
      };
    }
    if (side && pair && amount3 && price3) {
      newOrders[3] = {
        side: side === 'buy' ? 'sell' : 'buy',
        pair,
        amount: amount3,
        price: price3,
      };
    }
    if (side && pair && amount4 && price4) {
      newOrders[4] = {
        side: side === 'buy' ? 'sell' : 'buy',
        pair,
        amount: amount4,
        price: price4,
      };
    }
    setOrders(newOrders);
  }, [side, pair, amount, price, amount1, price1, pct1, amount2, price2, pct2, amount3, price3, pct3, amount4, price4, pct4, amount5, price5, pct5]);

  async function saveOrders() {
    for (const newOrder of orders) {
      saveOrder(newOrder);
    }
  }

  async function saveOrder(order: Order) {
    console.log(order);
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `https://${process.env.NEXT_PUBLIC_ASTRA_DB_ID}-${process.env.NEXT_PUBLIC_ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/namespaces/${process.env.NEXT_PUBLIC_ASTRA_DB_NAMESPACE}/collections/orders`,
      headers: {
        accept: 'application/json',
        'X-Cassandra-Token': process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN || '',
        'Content-Type': 'application/json',
      },
      data: {
        pair: order?.pair,
        price: order?.price,
        amount: order?.amount,
        side: order?.side,
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
          Portfolio amount: <input type="text" value={portfolioAmount} onChange={(event) => setPortfolioAmount(+event.target.value)} />
          <table className={styles.table}>
            <thead>
              <tr className={styles.tr}>
                <th className={styles.th}>Side</th>
                <th className={styles.th}>Pair</th>
                <th className={styles.th}>Amount</th>
                <th className={styles.th}>Price $</th>
                <th className={styles.th}>%</th>
                <th className={styles.th}>Total $</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.tr}>
                <td className={styles.td}>
                  <select value={side} onChange={(event) => setSide(event.target.value)}>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                </td>
                <td className={styles.td}>
                  <input type="text" value={pair} onChange={(event) => setPair(event.target.value)} />
                </td>
                <td className={styles.td}>
                  <input type="text" value={amount} onChange={(event) => setAmount(event.target.value)} />
                  <button onClick={(event) => portfolioAmount && price && setAmount(`${(portfolioAmount * 0.005) / +price}`)}>0.5%</button>
                  <button onClick={(event) => portfolioAmount && price && setAmount(`${(portfolioAmount * 0.01) / +price}`)}>1%</button>
                </td>
                <td className={styles.td}>
                  <input type="text" value={price} onChange={(event) => setPrice(event.target.value)} />
                </td>
                <td className={styles.td}></td>
                <td className={styles.td}>{+amount * +price}$</td>
              </tr>
              <tr>
                <td className={styles.td}>{side === 'buy' ? 'sell' : 'buy'}</td>
                <td className={styles.td}>{pair}</td>
                <td className={styles.td}>
                  <input type="text" value={amount1} onChange={(event) => setAmount1(event.target.value)} />
                </td>
                <td className={styles.td}>
                  <PriceInput price={price1} setPrice={setPrice1} />
                </td>
                <td className={styles.td}>
                  <PercentageInput pct={pct1} setPct={setPct1} />
                </td>
                <td className={styles.td}>{+amount1 * +price1}$</td>
              </tr>
              <tr>
                <td className={styles.td}>{side === 'buy' ? 'sell' : 'buy'}</td>
                <td className={styles.td}>{pair}</td>
                <td className={styles.td}>
                  <input type="text" value={amount2} onChange={(event) => setAmount2(event.target.value)} />
                </td>
                <td className={styles.td}>
                  <PriceInput price={price2} setPrice={setPrice2} />
                </td>
                <td className={styles.td}>
                  <PercentageInput pct={pct2} setPct={setPct2} />
                </td>
                <td className={styles.td}>{+amount2 * +price2}$</td>
              </tr>
              <tr>
                <td className={styles.td}>{side === 'buy' ? 'sell' : 'buy'}</td>
                <td className={styles.td}>{pair}</td>
                <td className={styles.td}>
                  <input type="text" value={amount3} onChange={(event) => setAmount3(event.target.value)} />
                </td>
                <td className={styles.td}>
                  <PriceInput price={price3} setPrice={setPrice3} />
                </td>
                <td className={styles.td}>
                  <PercentageInput pct={pct3} setPct={setPct3} />
                </td>
                <td className={styles.td}>{+amount3 * +price3}$</td>
              </tr>
              <tr>
                <td className={styles.td}>{side === 'buy' ? 'sell' : 'buy'}</td>
                <td className={styles.td}>{pair}</td>
                <td className={styles.td}>
                  <input type="text" value={amount4} onChange={(event) => setAmount4(event.target.value)} />
                </td>
                <td className={styles.td}>
                  <PriceInput price={price4} setPrice={setPrice4} />
                </td>
                <td className={styles.td}>
                  <PercentageInput pct={pct4} setPct={setPct4} />
                </td>
                <td className={styles.td}>{+amount4 * +price4}$</td>
              </tr>
              <tr>
                <td className={styles.td}>{side === 'buy' ? 'sell' : 'buy'}</td>
                <td className={styles.td}>{pair}</td>
                <td className={styles.td}>
                  <input type="text" value={amount5} onChange={(event) => setAmount5(event.target.value)} />
                </td>
                <td className={styles.td}>
                  <PriceInput price={price5} setPrice={setPrice5} />
                </td>
                <td className={styles.td}>
                  <PercentageInput pct={pct5} setPct={setPct5} />
                </td>
                <td className={styles.td}>{+amount5 * +price5}$</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.grid}>
          <div className={styles.card}>
            <ul>
              {orders.map((order) => (
                <li key={`${order.side} ${order.amount} ${order.pair} @ ${order.price}`}>
                  {order.side} {order.amount} {order.pair} @ {order.price}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className={styles.grid}>
          <div className={styles.card} onClick={() => saveOrders()}>
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
