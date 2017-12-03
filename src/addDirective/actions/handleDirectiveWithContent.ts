import * as fs from 'fs';
import * as byline from 'byline';
import { handleError } from '../../shared/utils';
import { workspace, window } from 'vscode';

import { checkFilePath, showFileQuickPick } from '../../shared/utils';
import { CAKE_FILE_EXTENSION_MATCHER, CAKE_ADDIN_DIRECTIVE, CAKE_TOOL_DIRECTIVE, ADD } from '../../constants';

function getErrorMessage(verb: string, cakeFileFullPath: string): string {
    return `Could not ${verb} the file at ${cakeFileFullPath}. Please try again.`;
}

export function containsDirectiveWithPackage(str: string, directive: string, packageName: string): boolean {
    return str.startsWith(directive) && str.indexOf(packageName) !== -1;
}

export function getFileContentWithDirective(pickedFilePath: string, directive: string, packageName: string, directiveLine: string) : Promise<any> {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(pickedFilePath, { encoding: 'utf8' });
        const stream = byline(fileStream);
        let content: Array<string> = [];
        let containDirective = false;
        stream.on('data', (line) => {
            if (!containDirective && containsDirectiveWithPackage(line.toString(), directive, packageName)) {
                content.push(directiveLine);
                containDirective = true;
            }
            else {
                content.push(line.toString() + '\n');
            }
        });
        stream.on('error', (err) => {
            return handleError(err, getErrorMessage('read', pickedFilePath), reject)
        });
        stream.on('end', () => {
            if (!containDirective) {
                content.unshift(directiveLine);
            }
            resolve({
                pickedFilePath,
                packageName,
                content
            })
        });
    });
}

export function handleDirectiveWithFileContent(
    directive: string, selectedVersion: string, selectedPackageName: string): Promise<any> | Promise<never> {

    const rootPath = workspace.rootPath == null ? '' :  workspace.rootPath;
    return checkFilePath(rootPath, CAKE_FILE_EXTENSION_MATCHER)
        .then((result: any): string | Thenable<string> => {
            if (result.length === 1) {
                return result[0];
            }

            return showFileQuickPick(result, ADD);
        }).then((pickedCakeFile: any) => {
            const isLatestVersion = selectedVersion.startsWith('Latest version');
            const withVersion = !isLatestVersion ? `&version=${selectedVersion}` : '';
            const directiveLine = `${directive} nuget:?package=${selectedPackageName}${withVersion}\n`;

            return getFileContentWithDirective(pickedCakeFile, directive, selectedPackageName, directiveLine);
        });
}

export function handleAddinWithContent({ selectedVersion, selectedPackageName }:
    { selectedVersion: string, selectedPackageName: string }): Promise<any> | Promise<never> {
        return handleDirectiveWithFileContent(CAKE_ADDIN_DIRECTIVE, selectedVersion, selectedPackageName);
}

export function handleToolWithContent({ selectedVersion, selectedPackageName }:
    { selectedVersion: string, selectedPackageName: string }): Promise<any> | Promise<never> {
        return handleDirectiveWithFileContent(CAKE_TOOL_DIRECTIVE, selectedVersion, selectedPackageName);
}