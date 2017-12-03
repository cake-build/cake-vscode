import { window, workspace } from 'vscode';
import fetch from 'node-fetch';
import { Response } from 'node-fetch';
import { NUGET_VERSIONS_URL, CANCEL } from '../../constants';
import { getFetchOptions } from '../../shared/utils';

export default function fetchPackageVersions(selectedPackageName: string, versionsUrl: string = NUGET_VERSIONS_URL): Promise<any> | Promise<never> {
    if (!selectedPackageName) {
        // User has canceled the process.
        return Promise.reject(CANCEL);
    }

    window.setStatusBarMessage('Loading package versions...');

    return new Promise((resolve) => {
        fetch(`${versionsUrl}${selectedPackageName}/index.json`, getFetchOptions(workspace.getConfiguration('http')))
            .then((response: Response) => {
                window.setStatusBarMessage('');
                resolve({ response, selectedPackageName });
            });
    });
}