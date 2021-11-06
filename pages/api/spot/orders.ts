import { Order, SpotApi } from 'gate-api';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSpotApi } from '../../../services/GateApi';
import { Error, ErrorMessage } from '../../../types/Error';

type ListOrdersOpts = Parameters<SpotApi['listOrders']>[2];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Order[] | ErrorMessage>
) {
  try {
    const from = Math.round(
      new Date(req.query?.from as string).getTime() / 1000
    );
    const to = Math.round(new Date(req.query?.to as string).getTime() / 1000);
    const side = req.query?.side as ListOrdersOpts['side'];
    const currencyPair = req.query?.currencyPair as Parameters<SpotApi['listOrders']>[0] || ''; // string | Retrieve results with specified currency pair. It is required for open orders, but optional for finished ones.
    const status = req.query.status as Parameters<SpotApi['listOrders']>[1] || 'finished'; // 'open' | 'finished' | List orders based on status  `open` - order is waiting to be filled `finished` - order has been filled or cancelled
    const opts: ListOrdersOpts = {
      page: 1, // number | Page number
      limit: 100, // number | Maximum number of records to be returned. If `status` is `open`, maximum of `limit` is 100
      account: '', // string | Specify operation account. Default to spot and margin account if not specified. Set to `cross_margin` to operate against margin account
      from, // number | Start timestamp of the query
      to, // number | Time range ending, default to current time
      side, // 'buy' | 'sell' | All bids or asks. Both included if not specified
    };
    const authorization = req.headers.authorization || '';
    const [key, secret] = authorization.split(':');
    const value = await getSpotApi(key, secret).listOrders(
      currencyPair,
      status,
      opts
    );
    res.status(200).json(value.body);
  } catch (err: any) {
    console.error(err);
    res.status(400).json((err as Error)?.response?.data);
  }
}
