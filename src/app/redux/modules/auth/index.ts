export function getToken(): string|null {
  return localStorage.getItem('token');
}

export function saveAuth(authResult: auth0.Auth0DecodedHash, profile: auth0.Auth0UserProfile) {
  localStorage.setItem('token', authResult.idToken);
  localStorage.setItem('refresh', authResult.refreshToken);
  localStorage.setItem('profile', JSON.stringify(profile));
}
