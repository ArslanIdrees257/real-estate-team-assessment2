export const AUTH = {
  TOKEN_EXPIRY_HOURS: 24,
  REFRESH_TOKEN_EXPIRY_DAYS: 7,
  SALT_ROUNDS: 10,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 64,
};

export const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid email or password.",
  UNAUTHORIZED: "Unauthorized access.",
  TOKEN_EXPIRED: "Session expired, please login again.",
};