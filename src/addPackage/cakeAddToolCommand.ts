import { showInformationMessage, writeLinesToFile } from '../shared/utils';

import {
    fetchCakePackages,
    handleSearchResponse,
    showPackageQuickPick,
    fetchPackageVersions,
    handleVersionsResponse,
    showPackageSearchBox,
    showVersionsWithLatestQuickPick,
    handleToolWithContent,
    handleErrorMessage
} from './actions';

export function installAddToolCommand() {
    showPackageSearchBox()
        .then(fetchCakePackages)
        .then(handleSearchResponse)
        .then(showPackageQuickPick)
        .then(fetchPackageVersions)
        .then(handleVersionsResponse)
        .then(showVersionsWithLatestQuickPick)
        .then(handleToolWithContent)
        .then(writeLinesToFile)
        .then(showInformationMessage)
        .then(undefined, handleErrorMessage);
}
