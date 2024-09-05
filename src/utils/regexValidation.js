/**
 * 
 * @param {string} email 
 * @returns {boolean}
 * @description Validate email
 */
export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Password must be at least 6 characters
export function validatePassword(password) {
  const passwordRegex = /^.{6,}$/;
  return passwordRegex.test(password);
}

