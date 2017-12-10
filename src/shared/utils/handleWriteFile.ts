import * as fs from 'fs';
import { handleError } from '../../shared/utils';
import { workspace, window } from 'vscode';

export function getErrorMessage(filePath: string): string {
    return `Failed to write an updated ${filePath} file. Please try again.`;
}

export function writeLinesToFile({
    filePath,
    message,
    lines
}: {
    filePath: string;
    message: string;
    lines: Array<string>;
}): Promise<string | never> {
    return new Promise((resolve, reject) => {
        try {
            let stream = fs.createWriteStream(filePath, {
                flags: 'w'
            });

            lines.forEach(line => stream.write(line));

            stream.end();

            stream.on('finish', function() {
                workspace.openTextDocument(filePath).then(document => {
                    window.showTextDocument(document);
                });
                return resolve(
                    `Success! Wrote ${message} to ${filePath}. Run the script to get the package.`
                );
            });
        } catch (error) {
            return handleError(null, getErrorMessage(filePath), reject);
        }
    });
}

export function writeContentToFile({
    filePath,
    content,
    message
}: {
    filePath: string;
    content: string;
    message: string;
}): Promise<string | never> {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, err => {
            if (err) {
                return handleError(err, getErrorMessage(filePath), reject);
            }

            return resolve(
                `Success! Wrote ${message} to ${filePath}. Run the script to get the package.`
            );
        });
    });
}
