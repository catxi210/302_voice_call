import { getApiKey } from "@/lib/utils";
import { RealtimeClient } from "@openai/realtime-api-beta"

const getRealtimeClient = () => {
  const LOCAL_RELAY_SERVER_URL: string = process.env.NEXT_PUBLIC_WSS_API_URL || '';
  return new RealtimeClient({
    url: `${LOCAL_RELAY_SERVER_URL}/v1/realtime`,
    apiKey: getApiKey(),
    dangerouslyAllowAPIKeyInBrowser: true,
  })
}
export default getRealtimeClient;
