import { window } from 'vscode';
import { CANCEL } from '../../constants';

export default function showVersionsQuickPick({json, selectedPackageName}: {json: any; selectedPackageName: string;}): Promise<any | never> {
  const versions = json.versions
    .slice()
    .reverse()
    .concat('Latest version (Wildcard *)');

  return new Promise((resolve, reject) => {
    // const lastestWithVersions = ['Lastest', ...versions];
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
