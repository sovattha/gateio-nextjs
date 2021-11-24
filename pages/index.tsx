import axios, { AxiosRequestConfig } from 'axios';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';
import { UserOrder } from '../types/UserOrder';

const Home: NextPage = () => {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  useEffect(() => {
    fetchOrders([]); // Fetch all the orders (fetch all the pages with a recursive functions)
  }, []);

  async function fetchOrders(updatedOrders: UserOrder[], pageState?: string): Promise<UserOrder[]> {
    return new Promise<UserOrder[]>((resolve, reject) => {
      const config: AxiosRequestConfig = {
        method: 'get',
        url: `https://${process.env.NEXT_PUBLIC_ASTRA_DB_ID}-${process.env.NEXT_PUBLIC_ASTRA_DB_REGION}.apps.astra.datastax.com/api/rest/v2/namespaces/${
          process.env.NEXT_PUBLIC_ASTRA_DB_NAMESPACE
        }/collections/orders?page-size=20${pageState ? `&page-state=${pageState}` : ''}`,
        //+`&where={"orderResponseDate":{"$exists": false}}`, // Filter to show only un-triggered trades
        headers: {
          accept: 'application/json',
          'X-Cassandra-Token': process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN || '',
        },
      };
      axios(config)
        .then(function (response) {
          const orders = Object.entries(response.data.data).map(([key, value]: [string, any]) => ({
            // Transform Datastax format to MongoDB like format
            id: key,
            ...value,
          }));
          updatedOrders.push(...orders);

          const pageState = response.data.pageState;
          if (pageState) {
            fetchOrders(updatedOrders, pageState); // Recursive function
          } else {
            setOrders(updatedOrders); // We need to set orders here
            resolve(updatedOrders); // This is never read by the calling function
          }
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
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
        <p className={styles.description}>Orders</p>
        <p>
          <Link href="/orders/new">Create new order</Link>
        </p>
        <table className={styles.table}>
          <thead>
            <tr className={styles.tr}>
              <th className={styles.th}>Side</th>
              <th className={styles.th}>Amount</th>
              <th className={styles.th}>Pair</th>
              <th className={styles.th}>Price</th>
              <th className={styles.th}>Triggered</th>
            </tr>
          </thead>
          <tbody>
            {orders
              ?.sort((o1, o2) => o1.pair.localeCompare(o2.pair) || o1.price - o2.price || o1.side.localeCompare(o2.side)) // Sort by pair, then price, then side
              ?.map((order: any) => (
                <tr className={styles.tr} key={order.id}>
                  <td className={styles.td}>{order.side}</td>
                  <td className={styles.td}>{order.amount}</td>
                  <td className={styles.td}>{order.pair}</td>
                  <td className={styles.td}>{order.price}</td>
                  <td className={styles.td}>{order.orderResponseDate}</td>
                </tr>
              ))}
          </tbody>
        </table>
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
