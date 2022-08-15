import { logger } from '../../shared'
/**
 * Writes an error to the logger but rejects with the given message
 *
 * @param {Error} err
 * @param {string} displayMessage
 * @param {Function} rejector - function to use for rejecting
 */
export function handleError<T>(
  err: any,
  displayMessage: string,
  rejector: (reason?: any) => T
): T {
  logger.logError(displayMessage);
  if(err){
    if(typeof(err) == "object") {
      err = JSON.stringify(err);
    }
    logger.logToOutput(err);
  }
  return rejector(displayMessage);
}

export function getDirErrorMessage(verb: string, directoryPath: string): string {
    return `Could not ${verb} the directory at ${directoryPath}. Please try again.`;
}

export function getFileErrorMessage(verb: string, fileFullPath: string): string {
    return `Could not ${verb} the file at ${fileFullPath}. Please try again.`;
}