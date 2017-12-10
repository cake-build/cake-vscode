/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

 declare module 'https-proxy-agent' {
    import { Url } from 'url';

    interface IHttpsProxyAgentOptions extends Url {
		secureEndpoint?: boolean;
		rejectUnauthorized?: boolean;
	}

	class HttpsProxyAgent {
		constructor(opts: IHttpsProxyAgentOptions);
    }

	export = HttpsProxyAgent;
}