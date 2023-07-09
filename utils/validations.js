export function validateUsername(username) {
  // Length requirements
  if (username.length < 4 || username.length > 20) {
    return false;
  }
  // Character restrictions (alphanumeric and underscore)
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return false;
  }
  // Reserved keywords
  const reservedKeywords = ['admin', 'root', 'superuser'];
  if (reservedKeywords.includes(username.toLowerCase())) {
    return false;
  }

  return true;
}
export function validateEmail(email) {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(email);
}
