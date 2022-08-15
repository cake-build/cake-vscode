import { window, workspace } from 'vscode';
import fetch from 'node-fetch';
import { logger } from '../../shared'
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

    try {
        window.setStatusBarMessage(NUGET_LOADING_VERSIONS);
        if(!versionsUrl) {
            versionsUrl = await getNugetServiceUrl(NuGetServiceType.FlatContainer3);
        }

        versionsUrl = versionsUrl.replace(/\/?$/,`/${selectedPackageName}/index.json`)
        logger.logInfo(`Fetching package versions for package '${selectedPackageName}' using URL: ${versionsUrl}`);
        const response = await fetch(
            versionsUrl,
            getFetchOptions(workspace.getConfiguration('http'))
        );
        
        window.setStatusBarMessage('');
        return { response, selectedPackageName };
    } catch (e: any) {
        logger.logError("Error fetching package versions from NuGet for package: "+selectedPackageName);
        logger.logToOutput(e);
        throw e;
    }
}
