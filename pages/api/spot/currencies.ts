import { Currency } from 'gate-api';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSpotApi } from '../../../services/gate-api';
import { Error, ErrorMessage } from '../../../types/Error';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Currency[] | ErrorMessage>
) {
  try {
    const value = await getSpotApi().listCurrencies();
    res.status(200).json(value.body);
  } catch (err: any) {
    console.error(err);
    res.status(400).json((err as Error)?.response?.data);
  }
}
