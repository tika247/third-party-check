/**
 * to distinguish intentional console.log from the unexpected for debugging
 * @param {string} str
 * @returns {void}
 */
export const consoleLog = (str: string | Error): void => console.log(str);
/**
 * for debugging
 * @param {number} second
 * @returns {Promise}
 * @example await sleep(3);
 */
export const sleep = (second: number) => new Promise((resolve) => setTimeout(resolve, second * 1000));
