import * as qs from 'querystring';
import fetch from 'node-fetch';
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

    return await fetch(
        `${searchUrl}?${queryParams}`,
        getFetchOptions(workspace.getConfiguration('http'))
    );
}
