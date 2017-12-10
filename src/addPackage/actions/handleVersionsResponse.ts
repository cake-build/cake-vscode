import { Response } from 'node-fetch';
import { handleError } from '../../shared/utils';
import { NUGET_BAD_VERSIONING } from '../../shared/messages';

export default function handleVersionsResponse({
    response,
    selectedPackageName
}: {
    response: Response;
    selectedPackageName: string;
}): Promise<any> | Promise<never> {
    if (!response.ok) {
        return handleError<Promise<never>>(
            null,
            NUGET_BAD_VERSIONING,
            Promise.reject.bind(Promise)
        );
    }

    return response.json().then((json: any) => ({ json, selectedPackageName }));
}
