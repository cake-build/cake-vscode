import fetch from 'node-fetch';
import { workspace } from 'vscode';
import { NUGET_SERVICE_INDEX_URL } from '../constants';
import { getFetchOptions } from './utils';

export enum NuGetServiceType {
    SearchAutocompleteService = 'SearchAutocompleteService',
    FlatContainer3 = 'PackageBaseAddress/3.0.0',
    SearchQueryService = 'SearchQueryService'
}
export async function getNugetServiceUrl(type: NuGetServiceType) : Promise<string> {
    // TODO: the url's won't change every 5 min. - should we cache the call to the services?
    const response = await fetch(NUGET_SERVICE_INDEX_URL, getFetchOptions(workspace.getConfiguration('http')));
    const json: any = await response.json();
    const resources = (json.resources as any[] || []).filter((x:any) => x['@type'] === type);
    let resource = resources.find((x: any) => (x.comment as string).toLowerCase().indexOf('primary') >= 0);
    if(!resource && resources.length > 0) {
        resource = resources[0]; 
    }

    if(!resource){
        throw new Error("Service endpoint not Found: "+type);
    }

    return resource['@id'] as string;
}