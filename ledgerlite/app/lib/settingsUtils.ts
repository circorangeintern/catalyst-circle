/**
 * Validates strength of password for security forms.
 * @param password The target password string.
 * @returns Error string or empty string if valid.
 */
export function validatePassword(password: string): string {
  if (!password.trim()) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password))
    return "Password must include an uppercase letter.";
  if (!/[a-z]/.test(password))
    return "Password must include a lowercase letter.";
  if (!/\d/.test(password)) return "Password must include a number.";
  if (!/[^A-Za-z0-9]/.test(password))
    return "Password must include a special character.";
  return "";
}

/**
 * Validates feedback fields (Subject & Message).
 * @param subject Subject text.
 * @param message Message content.
 * @returns Object containing error strings.
 */
export function validateFeedback(subject: string, message: string) {
  const subjectError = !subject.trim()
    ? "Subject is required."
    : subject.trim().length < 3
      ? "Subject must be at least 3 characters."
      : "";

  const messageError = !message.trim()
    ? "Message is required."
    : message.trim().length < 10
      ? "Message must be at least 10 characters."
      : "";

  return { subjectError, messageError };
}
