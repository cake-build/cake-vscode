import * as fs from 'fs';
import { handleError } from '../../shared/utils';
import { workspace, window } from 'vscode';

const getErrorMessage = (pickedCakeFile: string): string => {
    return `Failed to write an updated ${pickedCakeFile} file. Please try again.`;
};

export default function handleWriteCakeFile({ pickedFilePath, packageName, content }:
{ pickedFilePath: string; packageName: string; content: Array<string>; }): Promise<string | never> {
    return new Promise((resolve, reject) => {
        try {
            let stream = fs.createWriteStream(pickedFilePath, {
                flags: 'w'
            });

            content.forEach((line) => {
                stream.write(line)
            });
            stream.end();

            stream.on('finish', function() {
                workspace.openTextDocument(stream.path.toString()).then((document) => {
                    window.showTextDocument(document);
                });
                return resolve(`Success! Wrote ${packageName} to ${pickedFilePath}. Run the script to get the package.`);
            });
        } catch (error) {
            return handleError(null, getErrorMessage(pickedFilePath), reject);
        }
    });
}