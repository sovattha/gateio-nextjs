import { ApiClient, DeliveryApi, SpotApi } from 'gate-api';

export function getDeliveryApi() {
  const client = new ApiClient();
  return new DeliveryApi(client);
}
export function getSpotApi(authenticated?: boolean) {
  if (!process.env.KEY || !process.env.SECRET)
    throw new Error('KEY or SECRET environment variables must be specified');
  const client = new ApiClient();
  if (authenticated)
    client.setApiKeySecret(process.env.KEY, process.env.SECRET);
  return new SpotApi(client);
}
