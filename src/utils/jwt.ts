/**
 * Parses and decodes a JWT (JSON Web Token) to extract its payload.
 * This function only decodes the token's payload without verifying its signature.
 *
 * @param {String} token - The JWT token string in format: header.payload.signature
 * @returns {Object | null} Decoded payload containing user data, or null if parsing fails
 *   - exp: Expiration timestamp
 *   - user_id: User's unique identifier
 *   - user_level: User's permission level
 *   - temp_pw: Optional flag indicating temporary password status
 */
export function parseJwt(
  token: String
): { exp: number; user_id: number; user_level: number; temp_pw?: boolean } | null {
  try {
    // Extract the payload (second) part of the JWT
    var base64Url = token.split('.')[1];

    // Convert base64url to regular base64 by replacing characters
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Decode base64 and convert to UTF-8 string using percent encoding
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          // Convert each character to percent-encoded UTF-8
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    // Parse the JSON string into an object
    return JSON.parse(jsonPayload);
  } catch (e) {
    // Return null if token is invalid or parsing fails
    return null;
  }
}
