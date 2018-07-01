import { showInformationMessage, writeLinesToFile } from '../shared/utils';

import {
    fetchCakePackages,
    handleSearchResponse,
    showPackageQuickPick,
    fetchPackageVersions,
    handleVersionsResponse,
    showPackageSearchBox,
    showVersionsWithLatestQuickPick,
    handleAddinWithContent,
    handleErrorMessage
} from './actions';

export function installAddAddinCommand() {
    showPackageSearchBox()
        .then(fetchCakePackages)
        .then(handleSearchResponse)
        .then(showPackageQuickPick)
        .then(fetchPackageVersions)
        .then(handleVersionsResponse)
        .then(showVersionsWithLatestQuickPick)
        .then(handleAddinWithContent)
        .then(writeLinesToFile)
        .then(showInformationMessage)
        .then(undefined, handleErrorMessage);
}
