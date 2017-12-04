import { window, workspace } from 'vscode';
import * as qs from 'querystring';
import fetch from 'node-fetch';
import { Response } from 'node-fetch';
import { CAKE_SEARCH_PAGE_SIZE, NUGET_SEARCH_URL } from '../../constants';
import { getFetchOptions } from '../../shared/utils';

export default function fetchCakePackages(input: string, searchUrl: string = NUGET_SEARCH_URL): | Promise<Response> | Promise<never> {
  // const input = DEFAULT_CAKE_NAME;
  // const searchUrl = NUGET_SEARCH_URL;

  window.setStatusBarMessage('Searching Cake packages on NuGet...');

  const queryParams = qs.stringify({
    q: input,
    prerelease: 'true',
    take: CAKE_SEARCH_PAGE_SIZE
  });

  return fetch(
    `${searchUrl}?${queryParams}`,
    getFetchOptions(workspace.getConfiguration('http'))
  );
}
