import { window } from 'vscode';
import { handleError } from '../../shared/utils';
import { NOT_MATCHING_RESULTS_FOUND } from '../../shared/messages';

export default function showPackageQuickPick(
    json: any
): Thenable<string | undefined> | Promise<never> {
    const errorMessage = NOT_MATCHING_RESULTS_FOUND;

    if (!json) {
        return handleError<Promise<never>>(
            null,
            errorMessage,
            Promise.reject.bind(Promise)
        );
    }

    const { data } = json;

    if (!data || data.length < 1) {
        return handleError<Promise<never>>(
            null,
            errorMessage,
            Promise.reject.bind(Promise)
        );
    }

    return window.showQuickPick(data);
}
