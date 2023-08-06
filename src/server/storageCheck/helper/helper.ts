/**
 * to add error message
 * @param {string} str
 * @returns {void}
 */
export const adjustedErrorMessage = (errorMessage: string | null, addMessage: string): string => {
  return errorMessage ? `${errorMessage}\n\n------------------------------------------------------\n\n${addMessage}` : addMessage;
};
