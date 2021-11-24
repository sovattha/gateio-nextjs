import axios, { AxiosRequestConfig } from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const [orders, setOrders] = useState<
    {
      pair: string;
      price: number;
      amount: number;
    }[]
  >([]);
  useEffect(() => {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `https://${process.env.NEXT_PUBLIC_ASTRA_DB_ID}-${process.env.NEXT_PUBLIC_ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/namespaces/${process.env.NEXT_PUBLIC_ASTRA_DB_NAMESPACE}/collections/orders`,
      headers: {
        accept: 'application/json',
        'X-Cassandra-Token': process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN || '',
      },
    };
    axios(config)
      .then(function (response) {
        const responseData = response.data;
        // Convert the response from Datastax to a simple array similar to MongoDB
        const responseDataArray = [];
        for (const orderId in responseData.data) {
          responseDataArray.push({
            ...responseData.data[orderId],
            _id: orderId,
          });
        }
        setOrders(responseDataArray);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Gate.io trading bot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Gate.io trading bot</h1>
        <p className={styles.description}>Orders</p>
        <div className={styles.grid}>
          {orders?.map((order: any) => (
            <div className={styles.card} key={order.id}>
              <h2>{order.pair}</h2>
              <p>Price: {order.price}</p>
              <p>Amount: {order.amount}</p>
            </div>
          ))}
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
