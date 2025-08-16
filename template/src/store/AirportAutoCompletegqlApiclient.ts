import { ApolloClient, InMemoryCache } from '@apollo/client';
import { BaseURL, APIversion } from "../utility/config";
import { getAuthHeader } from '../utility/config/oAuth';
import type { AuthOdetails } from '../utility/config/oAuth';

 const AirportAutoCompletegqlApiclient = (authOdetails: AuthOdetails, endpoint?: string) => {
const defaultEndpoint = 'meta/grapghql/search';
const finalEndpoint = endpoint || defaultEndpoint;
const authToken = getAuthHeader(finalEndpoint, 'POST', authOdetails);
  const client = new ApolloClient({
    uri: `${BaseURL}${APIversion}${finalEndpoint}`,
    headers: {
      "Authorization": authToken?.Authorization,
    },
    cache: new InMemoryCache(),
  });

  return client;
};
export default AirportAutoCompletegqlApiclient;