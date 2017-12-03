import { window } from 'vscode';
import { handleError } from '../../shared/utils';

export default function showPackageQuickPick(json: any): Thenable<string | undefined> | Promise<never> {
  const errorMessage = 'No matching results found. Please try again.';

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
