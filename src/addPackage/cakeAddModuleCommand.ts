import { showInformationMessage, writeLinesToFile } from '../shared/utils';

import {
    fetchCakePackages,
    handleSearchResponse,
    showPackageQuickPick,
    fetchPackageVersions,
    handleVersionsResponse,
    showPackageSearchBox,
    showVersionsWithLatestQuickPick,
    handleModuleWithContent,
    handleErrorMessage
} from './actions';

export function installAddModuleCommand() {
    showPackageSearchBox()
        .then(fetchCakePackages)
        .then(handleSearchResponse)
        .then(showPackageQuickPick)
        .then(fetchPackageVersions)
        .then(handleVersionsResponse)
        .then(showVersionsWithLatestQuickPick)
        .then(handleModuleWithContent)
        .then(writeLinesToFile)
        .then(showInformationMessage)
        .then(undefined, handleErrorMessage);
}
