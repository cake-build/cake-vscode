import { window, workspace } from 'vscode';
import fetch from 'node-fetch';
import { getFetchOptions } from '../../shared/utils';
import { CANCEL } from '../../constants';
import { NUGET_LOADING_VERSIONS } from '../../shared/messages';
import { getNugetServiceUrl, NuGetServiceType } from '../../shared/nugetServiceUrl';

export default async function fetchPackageVersions(
    selectedPackageName: string | undefined,
    versionsUrl?: string
): Promise<any | never> {
    if (!selectedPackageName) {
        // User has canceled the process.
        return Promise.reject(CANCEL);
    }

    window.setStatusBarMessage(NUGET_LOADING_VERSIONS);
    if(!versionsUrl) {
        versionsUrl = await getNugetServiceUrl(NuGetServiceType.FlatContainer3);
    }

    const response = await fetch(
        versionsUrl.replace(/\/?$/,`/${selectedPackageName}/index.json`),
        getFetchOptions(workspace.getConfiguration('http'))
    );
    
    window.setStatusBarMessage('');
    return { response, selectedPackageName };
}
