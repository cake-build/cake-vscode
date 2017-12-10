import { Response } from 'node-fetch';
import { NUGET_BAD_RESPONSE } from '../../shared/messages';

export default function handleSearchResponse(
    response: Response | never
): Promise<any> | Promise<never> {
    if (!response.ok) {
        return Promise.reject(
            NUGET_BAD_RESPONSE
        );
    }

    return response.json();
}
