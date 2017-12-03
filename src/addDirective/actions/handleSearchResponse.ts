import { Response } from 'node-fetch';

export default function handleSearchResponse(response: Response | never): Promise<any> | Promise<never> {
  if (!response.ok) {
    return Promise.reject(
      'The NuGet repository returned a bad response. Please try again later.'
    );
  }

  return response.json();
}
