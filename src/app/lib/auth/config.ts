export const oidc = {
  issuer: process.env.OIDC_ISSUER!,
  clientId: process.env.OIDC_CLIENT_ID!,
  clientSecret: process.env.OIDC_CLIENT_SECRET!,
  redirectUri: process.env.OIDC_CALLBACK_URL!,
  scope: 'openid email profile',
};

export const endpoints = {
  authorization: `${oidc.issuer}/protocol/openid-connect/auth`,
  token: `${oidc.issuer}/protocol/openid-connect/token`,
  endSession: `${oidc.issuer}/protocol/openid-connect/logout`,
  revocation: `${oidc.issuer}/protocol/openid-connect/revoke`,
  jwks: `${oidc.issuer}/protocol/openid-connect/certs`,
};