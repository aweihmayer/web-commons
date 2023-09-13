# Authorization

## Tokens
Authorization is done through two different types of tokens:

- **Access tokens** identify the user and allow them to perform operations that require credentials. These tokens are short-lived.
- **Refresh tokens** do not allow the user to do anything. Their sole purpose is to generate new access tokens. These tokens are long-lived.

## The benefit
The benefit of this method is increased security. In the case where your access token is stolen, it will expire soon, therefore minimizing the damage done.

If we had only one long-lasting general-purpose authorization token, it would be a much bigger security risk for it to be stolen.

## How tokens are used
To authorize requests, tokens are passed in two ways:

1. **By using cookies**, we can send tokens to the server automatically with each request. This is the preferred method to send tokens in a web application. These cookies are HTTP-only to protect them from JavaScript attacks.
2. **By using headers**, we can send tokens to the server explicitly.

We should not be sending the two tokens at once. The refresh token should only be sent when the access token has expired.
