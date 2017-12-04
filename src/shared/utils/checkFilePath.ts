import { handleError, getFilePath } from './';

export default function checkFilePath(startPath: string, fileExtensionMatcher: RegExp): Promise<Array<string> | never> {
    return getFilePath(startPath, fileExtensionMatcher)
        .then<Array<string> | Promise<never>>((foundFiles: Array<string>) => {
            if (foundFiles.length < 1) {
                return handleError<Promise<never>>(
                    null,
                    'Cannot find any .cake file on the root of your project! Please try again.',
                    Promise.reject.bind(Promise)                    
                );
            }
            return foundFiles;
        });
}