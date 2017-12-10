import { window } from 'vscode';
import { CANCEL } from '../../constants';

function _showVersionsQuickPick(
  selectedPackageName: string,
  versions: any
): Promise<any | never> {
  return new Promise((resolve, reject) => {
    window
      .showQuickPick(versions, {
        placeHolder: 'Select the version to add.'
      })
      .then((selectedVersion: string | undefined) => {
        if (!selectedVersion) {
          // User canceled.
          return reject(CANCEL);
        }
        resolve({ selectedVersion, selectedPackageName });
      });
  });
}

export function showVersionsQuickPick({
  json,
  selectedPackageName
}: {
  json: any;
  selectedPackageName: string;
}): Promise<any | never> {
  const versions = json.versions.slice().reverse();
  return _showVersionsQuickPick(selectedPackageName, versions);
}

export function showVersionsWithLatestQuickPick({
  json,
  selectedPackageName
}: {
  json: any;
  selectedPackageName: string;
}): Promise<any | never> {
  const versions = json.versions
    .slice()
    .reverse()
    .concat('Latest version (Wildcard *)');
  return _showVersionsQuickPick(selectedPackageName, versions);
}
