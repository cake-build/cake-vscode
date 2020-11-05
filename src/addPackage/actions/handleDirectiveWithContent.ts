import * as fs from 'fs';
import * as byline from 'byline';
import { handleError } from '../../shared/utils';
import { workspace } from 'vscode';
import {
    checkCakeFilesPath,
    getFileErrorMessage,
    showFileQuickPick
} from '../../shared/utils';
import {
    CAKE_ADDIN_DIRECTIVE,
    CAKE_TOOL_DIRECTIVE,
    CAKE_MODULE_DIRECTIVE,
    ADD
} from '../../constants';

function _containsDirectiveWithPackage(
    str: string,
    directive: string,
    packageName: string
): boolean {
    return str.startsWith(directive) && str.indexOf(packageName) !== -1;
}

function _getFileContentWithDirective(
    pickedFilePath: string,
    directive: string,
    packageName: string,
    directiveLine: string
): Promise<any> {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(pickedFilePath, {
            encoding: 'utf8'
        });
        const stream = byline(fileStream, { keepEmptyLines: true });
        let content: Array<string> = [];
        let containDirective = false;
        stream.on('data', line => {
            if (
                !containDirective &&
                _containsDirectiveWithPackage(
                    line.toString(),
                    directive,
                    packageName
                )
            ) {
                content.push(directiveLine);
                containDirective = true;
            } else {
                content.push(line.toString() + '\n');
            }
        });
        stream.on('error', err => {
            return handleError(
                err,
                getFileErrorMessage('read', pickedFilePath),
                reject
            );
        });
        stream.on('end', () => {
            if (!containDirective) {
                content.unshift(directiveLine);
            }
            resolve({
                filePath: pickedFilePath,
                message: packageName,
                lines: content
            });
        });
    });
}

function _handleDirectiveWithFileContent(
    directive: string,
    selectedVersion: string,
    selectedPackageName: string
): Promise<any> | Promise<never> {
    const rootPath = workspace.rootPath == null ? '' : workspace.rootPath;
    return checkCakeFilesPath(rootPath)
        .then((result: any): string | Thenable<string> => {
            if (result.length === 1) {
                return result[0];
            }

            return showFileQuickPick(result, ADD);
        })
        .then((pickedCakeFile: any) => {
            const isLatestVersion = selectedVersion.startsWith(
                'Latest version'
            );
            const withVersion = !isLatestVersion
                ? `&version=${selectedVersion}`
                : '';
            const directiveLine = `${directive} nuget:?package=${selectedPackageName}${withVersion}\n`;

            return _getFileContentWithDirective(
                pickedCakeFile,
                directive,
                selectedPackageName,
                directiveLine
            );
        });
}

export function handleAddinWithContent({
    selectedVersion,
    selectedPackageName
}: {
    selectedVersion: string;
    selectedPackageName: string;
}): Promise<any> | Promise<never> {
    return _handleDirectiveWithFileContent(
        CAKE_ADDIN_DIRECTIVE,
        selectedVersion,
        selectedPackageName
    );
}

export function handleToolWithContent({
    selectedVersion,
    selectedPackageName
}: {
    selectedVersion: string;
    selectedPackageName: string;
}): Promise<any> | Promise<never> {
    return _handleDirectiveWithFileContent(
        CAKE_TOOL_DIRECTIVE,
        selectedVersion,
        selectedPackageName
    );
}

export function handleModuleWithContent({
    selectedVersion,
    selectedPackageName
}: {
    selectedVersion: string;
    selectedPackageName: string;
}): Promise<any> | Promise<never> {
    return _handleDirectiveWithFileContent(
        CAKE_MODULE_DIRECTIVE,
        selectedVersion,
        selectedPackageName
    )
}
