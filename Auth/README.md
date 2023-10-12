# Authorization

## Tokens
Authorization is done through two different types of tokens:

- **Access tokens** identify the user and allow them to perform operations that require credentials. These tokens are short-lived.
- **Refresh tokens** do not allow the user to do anything. Their sole purpose is to generate new access tokens. These tokens are long-lived.

## How to send cookies
To authorize requests, tokens are passed in two ways:

1. **By using cookies**, we can send tokens to the server automatically with each request. This is the preferred method to send tokens
in a web application. These cookies are HTTP-only to protect them from being accessed by JavaScript attacks.
2. **By using headers**, we can send tokens to the server explicitly. We use the Authentification header with a Bearer value.

## When to send access and refresh tokens
The access token should be sent to requests that require authorization.

The refresh token should only be sent to one specific endpoint used to create a new access token. If the both tokens are always sent
together, it increases the chances of an attacker stealing the refresh token. If you are using the cookie method to send the refresh token,
make sure that the cookie's path attribute is set so that it doesn't get sent to every request.

## The benefit
The benefit of this method is increased security. In the case where your access token is stolen, it will expire soon, therefore minimizing the damage done.

If we had only one long-lasting general-purpose authorization token, it would be a much bigger security risk for it to be stolen.


## TODO
- Encrypt the token before storing it in the database
- On refresh, invalidate the refresh token and create a new one
- Refresh token expire in 30 days
- Method to revoke all tokens for a user /api/auth/revoke/all send refresh token
- signin creates new refresh token
- Instead of sending dates, sending "expiresIn" which represent ms. This prevents misreading of date formats
