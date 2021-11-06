import { DeliveryContract } from 'gate-api';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getDeliveryApi } from '../../../../../services/gate-api';
import { Error, ErrorMessage } from '../../../../../types/Error';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeliveryContract[] | ErrorMessage>
) {
  const settle = req.query.settle as 'btc' | 'usdt'; // 'btc' | 'usdt' | Settle currency
  try {
    const value = await getDeliveryApi().listDeliveryContracts(settle);
    res.status(200).json(value.body);
  } catch (err: any) {
    console.error(err);
    res.status(400).json((err as Error)?.response?.data);
  }
}
