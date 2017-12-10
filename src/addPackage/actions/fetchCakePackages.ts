import * as qs from 'querystring';
import fetch from 'node-fetch';
import { Response } from 'node-fetch';
import { getFetchOptions } from '../../shared/utils';
import { window, workspace } from 'vscode';
import {
    CAKE_SEARCH_PAGE_SIZE,
    NUGET_SEARCH_URL,
    CANCEL
} from '../../constants';
import {
    NUGET_SEARCHING_PACKAGES
} from '../../shared/messages';

export default function fetchCakePackages(
    value: string | undefined,
    searchUrl: string = NUGET_SEARCH_URL,
    take: string = CAKE_SEARCH_PAGE_SIZE
): Promise<Response> | Promise<never> {
    if (!value) {
        // User has canceled the process.
        return Promise.reject(CANCEL);
    }

    window.setStatusBarMessage(NUGET_SEARCHING_PACKAGES);

    const queryParams = qs.stringify({
        q: value,
        prerelease: 'true',
        take: take
    });

    return fetch(
        `${searchUrl}?${queryParams}`,
        getFetchOptions(workspace.getConfiguration('http'))
    );
}
