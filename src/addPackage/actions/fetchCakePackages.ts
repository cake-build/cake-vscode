import * as qs from 'querystring';
import fetch from 'node-fetch';
import { logger } from '../../shared'
import { Response } from 'node-fetch';
import { getFetchOptions } from '../../shared/utils';
import { window, workspace } from 'vscode';
import {
    CAKE_SEARCH_PAGE_SIZE,
    CANCEL
} from '../../constants';
import { NUGET_SEARCHING_PACKAGES } from '../../shared/messages';
import { getNugetServiceUrl, NuGetServiceType } from '../../shared/nugetServiceUrl';

export default async function fetchCakePackages(
    value: string | undefined,
    searchUrl?: string,
    take: string = CAKE_SEARCH_PAGE_SIZE
): Promise<Response | never> {
    if (!value) {
        // User has canceled the process.
        return Promise.reject(CANCEL);
    }

    if(!searchUrl){
        searchUrl = await getNugetServiceUrl(NuGetServiceType.SearchAutocompleteService);
    }

    window.setStatusBarMessage(NUGET_SEARCHING_PACKAGES);

    const queryParams = qs.stringify({
        q: value,
        prerelease: 'true',
        take: take
    });

    try {
        const fullUrl = `${searchUrl}?${queryParams}`;
        logger.logInfo(`Fetching available packages for query '${value}' using URL: ${fullUrl}`);
        return await fetch(
            fullUrl,
            getFetchOptions(workspace.getConfiguration('http'))
        );
    } catch (e: any) {
        logger.logError("Error fetching available packages from NuGet for query: "+value);
        logger.logToOutput(e);
        throw e;
    }
}
