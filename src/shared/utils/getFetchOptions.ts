import * as url from 'url';
import createHttpsProxyAgent = require('https-proxy-agent');
import { DEFAULT_RESPONSE_TIMEOUT } from '../../constants';

// Cache a few things since this stuff will rarely change, and there's no need to recreate an agent
// if no change has occurred, etc.
let lastProxy = '';
let lastProxyStrictSSL: boolean | undefined;
let lastHttpsProxyAgent: any;

interface IProxyConfiguration {
    proxy?: string;
    proxyAuthorization?: string | null;
    proxyStrictSSL?: boolean;
    readonly [key: string]: any;
}

export default function getFetchOptions(configuration?: IProxyConfiguration) {
    const { proxy, proxyAuthorization, proxyStrictSSL } =
        configuration || ({} as IProxyConfiguration);
    const fetchOptions: any = { timeout: DEFAULT_RESPONSE_TIMEOUT };

    if (!proxy) {
        lastProxy = '';
        return fetchOptions; // no proxy, so ignore everything but timeout
    }

    if (proxy === lastProxy && proxyStrictSSL === lastProxyStrictSSL) {
        fetchOptions.agent = lastHttpsProxyAgent;
    } else {
        const parsedProxy = url.parse(proxy);
        if(!parsedProxy.host || !parsedProxy.port) {
            return fetchOptions;
        }

        const useStrictSSL = !!proxyStrictSSL; // coerce to boolean just in case

        fetchOptions.agent = createHttpsProxyAgent({
            host: <string>parsedProxy.host,
            port: <string>parsedProxy.port,
            secureEndpoint: useStrictSSL,
            rejectUnauthorized: useStrictSSL
        });

        lastHttpsProxyAgent = fetchOptions.agent;
        lastProxyStrictSSL = proxyStrictSSL;
        lastProxy = proxy;
    }

    if (proxyAuthorization) {
        fetchOptions.headers = {
            'Proxy-Authorization': proxyAuthorization
        };
    }

    return fetchOptions;
}
