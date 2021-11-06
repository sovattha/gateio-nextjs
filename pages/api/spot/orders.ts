import { Order, SpotApi } from 'gate-api';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSpotApi } from '../../../services/gate-api';
import { Error, ErrorMessage } from '../../../types/Error';

type ListOrdersOpts = Parameters<SpotApi['listOrders']>[2];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Order | Order[] | ErrorMessage>
) {
  try {
    if (req.method === 'GET') {
      const value = await listOrders(req);
      res.status(200).json(value.body);
    } else if (req.method === 'POST') {
      const value = await createOrder(req);
      res.status(200).json(value.body);
    }
  } catch (err: any) {
    console.error(err);
    res.status(400).json((err as Error)?.response?.data);
  }
}

async function createOrder(req: NextApiRequest) {
  const order = Object.assign(new Order(), req.body); // Order | 
  const authorization = req.headers.authorization || '';
  const [key, secret] = authorization.split(':');
  const value = await getSpotApi(key, secret).createOrder(order);
  return value;
}

async function listOrders(req: NextApiRequest) {
  const from = Math.round(
    new Date(req.query?.from as string).getTime() / 1000
  );
  const to = Math.round(new Date(req.query?.to as string).getTime() / 1000);
  const side = req.query?.side as ListOrdersOpts['side'];
  const currencyPair = req.query?.currencyPair as Parameters<SpotApi['listOrders']>[0] || ''; // string | Retrieve results with specified currency pair. It is required for open orders, but optional for finished ones.
  const status = req.query.status as Parameters<SpotApi['listOrders']>[1] || 'finished'; // 'open' | 'finished' | List orders based on status  `open` - order is waiting to be filled `finished` - order has been filled or cancelled
  const opts: ListOrdersOpts = {
    page: 1,
    limit: 100,
    account: '',
    from,
    to,
    side, // 'buy' | 'sell' | All bids or asks. Both included if not specified
  };
  const authorization = req.headers.authorization || '';
  const [key, secret] = authorization.split(':');
  const value = await getSpotApi(key, secret).listOrders(
    currencyPair,
    status,
    opts
  );
  return value;
}

