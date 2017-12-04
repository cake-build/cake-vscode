/**
 * Writes an error to the console but rejects with a nicer error message for the user.
 * 
 * @param {Error} err
 * @param {string} displayMessage
 * @param {Function} rejector - the function to use for rejecting
 */
export default function handleError<T>(err: any, displayMessage: string, rejector: (reason?: any) => T): T {
    console.error(err || displayMessage);
    return rejector(displayMessage);
}