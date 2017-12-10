import { showInformationMessage, writeContentToFile } from '../shared/utils';

import {
    fetchCakePackages,
    handleSearchResponse,
    showPackageQuickPick,
    fetchPackageVersions,
    handleVersionsResponse,
    showPackageSearchBox,
    showVersionsQuickPick,
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
        .then(showVersionsQuickPick)
        .then(handleModuleWithContent)
        .then(writeContentToFile)
        .then(showInformationMessage)
        .then(undefined, handleErrorMessage);
}
