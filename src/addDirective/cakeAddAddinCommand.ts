import { window } from 'vscode';
import { CANCEL } from './../constants';
import { showInformationMessage } from '../shared/utils';

import {
    fetchCakePackages,
    handleSearchResponse,
    showPackageQuickPick,
    fetchPackageVersions,
    handleVersionsResponse,
    showPackageSearchBox,
    showVersionsQuickPick,
    handleAddinWithContent,
    handleWriteCakeFile
} from './actions';

export function installAddAddinCommand() {
    showPackageSearchBox()
        .then(fetchCakePackages)
        .then(handleSearchResponse)
        .then(showPackageQuickPick)
        .then(fetchPackageVersions)
        .then(handleVersionsResponse)
        .then(showVersionsQuickPick)
        .then(handleAddinWithContent)
        .then(handleWriteCakeFile)
        .then(showInformationMessage)
        .then(undefined, (err: any) => {
            window.setStatusBarMessage('');
            if (err !== CANCEL) {
                window.showErrorMessage(err.message || err || 'We encountered an unknown error! Please try again.');
            }
        });
}
