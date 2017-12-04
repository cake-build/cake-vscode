import { handleError } from '../../shared/utils';
import { Response } from 'node-fetch';

export default function handleVersionsResponse({response, selectedPackageName}:
  { response: Response; selectedPackageName: string; }): Promise<any> | Promise<never> {
  if (!response.ok) {
    return handleError<Promise<never>>(
      null,
      'Versioning information could not be retrieved from the NuGet repository. Please try again later.',
      Promise.reject.bind(Promise)
    );
  }

  return response.json().then((json: any) => ({ json, selectedPackageName }));
}
