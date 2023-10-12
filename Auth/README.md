# Authentification

## Tokens
Authorization is done through two different types of tokens:

1. **Access tokens** identify the user and allow them to perform operations that require credentials. These tokens are short-lived.
2. **Refresh tokens** do not allow the user to do anything other than to generate new access tokens. These tokens are long-lived.

The benefit of this method is increased security. In the case where your access token is stolen, it will expire soon, therefore minimizing the damage done.

If we had only one long-lasting general-purpose authorization token, it would be available to be stolen more often and the consequences would be more drastic.

## Authentification operations
This library comes standard operations for authentification. Below is a list explaining each of them:

1. **Signing-in a user** creates a new access and refresh token for the user.
2. **Refreshing an access token** with a refresh token revokes the refresh token, creates a new refresh token and creates a new access token.
3. **Revoking a token** revokes that token and it can no longer be used.
4. **Revoking all tokens for a user** revokes all tokens for a user which effectively signs them out of every device.

## How to send tokens
To authorize requests, tokens are passed in two ways:

1. **By using cookies**, we can send tokens to the server automatically with each request. This is the preferred method to send tokens
in a web application. These cookies are HTTP-only to protect them from being accessed by JavaScript attacks. For refresh tokens, the 
path attribute of the cookie should be set to only send it to a select few requests.
2. **By using headers**, we can send tokens to the server explicitly. We use the Authentification header with a Bearer value.