import { window, workspace } from 'vscode';
import fetch from 'node-fetch';
import { Response } from 'node-fetch';
import { getFetchOptions } from '../../shared/utils';
import { NUGET_VERSIONS_URL, CANCEL } from '../../constants';
import { NUGET_LOADING_VERSIONS } from '../../shared/messages';

export default function fetchPackageVersions(
    selectedPackageName: string | undefined,
    versionsUrl: string = NUGET_VERSIONS_URL
): Promise<any> | Promise<never> {
    return new Promise((resolve, reject) => {
        if (!selectedPackageName) {
            // User has canceled the process.
            return reject(CANCEL);
        }

        window.setStatusBarMessage(NUGET_LOADING_VERSIONS);

        fetch(
            `${versionsUrl}${selectedPackageName}/index.json`,
            getFetchOptions(workspace.getConfiguration('http'))
        ).then((response: Response) => {
            window.setStatusBarMessage('');
            resolve({ response, selectedPackageName });
        });
    });
}
