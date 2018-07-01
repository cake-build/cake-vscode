import { window } from 'vscode';
import { CANCEL } from './../../constants';
import { INFORM_UNKNOWN_ERROR } from '../../shared/messages';

export function handleErrorMessage(err: any): void {
    window.setStatusBarMessage('');
    if (err !== CANCEL) {
        window.showErrorMessage(
            err.message ||
                err ||
                INFORM_UNKNOWN_ERROR
        );
    }
}
