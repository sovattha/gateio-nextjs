import { ApiClient, DeliveryApi, SpotApi } from 'gate-api';

export function getDeliveryApi() {
  const client = new ApiClient();
  return new DeliveryApi(client);
}
export function getSpotApi(key?: string, secret?: string) {
  const client = new ApiClient();
  if (key && secret)
    client.setApiKeySecret(key, secret);
  return new SpotApi(client);
}
