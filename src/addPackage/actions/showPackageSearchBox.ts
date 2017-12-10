import { window } from 'vscode';
import { NUGET_PACKAGE_SEARCH_TERM } from '../../shared/messages';

export default function showPackageSearchBox(): Thenable<string | undefined> {
    return window.showInputBox({
        placeHolder: NUGET_PACKAGE_SEARCH_TERM,
        value: 'Cake.'
    });
}
