# Authentication concepts

## Tokens
Authorization is done through two different types of tokens:

1. **Access tokens** identify the user and allow them to perform operations that require certain permissions. These tokens are short-lived.
2. **Refresh tokens** do not allow the user to do anything other than to generate new access tokens. These tokens are long-lived.

The benefit of this method is increased security. In the case where your access token is stolen, it will expire eventually, therefore minimizing security risks.

If we had only one long-lasting general-purpose authorization token, it would be available to be stolen more often and the consequences would be more drastic.

## How to send tokens
To authorize requests, tokens are passed in two ways:

1. **By using cookies**, we can send tokens to the server automatically with each request. This is the preferred method to send tokens
in a web application. These cookies are HTTP-only to protect them from being accessed by JavaScript attacks. For refresh tokens, the 
path attribute of the cookie should be set to only send it to a select few requests.
2. **By using headers**, we can send tokens to the server explicitly. We use the authentication header with a Bearer value.

## Authentication operations
This library comes standard operations for authentication. Below is a list explaining each of them:

1. **Signing-in a user** creates a new access and refresh token for the user.
2. **Refreshing an access token** with a refresh token revokes the refresh token, creates a new refresh token and a new access token.
3. **Revoking a token** revokes that token and it can no longer be used.
4. **Revoking all tokens for a user** revokes all tokens for a user which effectively signs them out of every device.

# Authentication setup

## Back-end

1. Create your own implementation of the user DB entity.
	```
	public class MyUser : CommonUser { }
	```
1. Create your own implementation of the user DTO.
	```
	public class MyUserDto : CommonUserDto { }
	```
2. Create your own implementation of the authentication database.
	```
	public class MyDbContext : CommonDbContextWithAuth<MyUser> { }
	```
3. Create your implementation of the authentication service.
	```
	public class MyAuthService : CommonAuthService<MyUser>
    {
        public MyAuthService(CommonDbContextWithAuth<MyUser> db, Controller? controller = null) : base(db, controller) { }
    }
	```
4. If you need to validate custom permissions on top of determining if the user is authenticated or not, create your implementation of the authentication filter that identifies users and the permissions filter that validates their permissions.
	```
	public class MyAuthFilter : AuthFilter<MyDbContext, MyUser>
    {
        public override bool ValidatePermissions(ActionExecutingContext context, string[] allowedPermissions, TUser user) {
            // Custom logic here
        }
    }
	```
5. In the startup configuration, add the authentication filter.
 	```
	builder.Services.AddControllersWithViews(options => {
        options.Filters.Add<AuthFilter<MyDbContext, MyUser>>(1);
    });
	```
6. You can retrieve the user that was authenticated at any time.
    ```
	context.HttpContext.GetUser();
    context.HttpContext.GetUser<MyUser>();
	```
7. Add the permission attribute on any endpoint that requires authentication.
    ```
    public class MyController : CommonController {
        [HttpGet]
        [Permit] // Permits any authenticated user
        public ContentResult Read() { ... }
        
        [HttpPut]
        [Permit("admin", "superadmin")] // Permits users with permission "admin" and "superadmin"
        public ContentResult Create() { ... }

        [HttpDelete]
        [Permit("superadmin")] // Permits users with permission "superadmin"
        public ContentResult Delete() { ... }
    }
	```
8. Create the endpoints that manage authentication. 
    ```
    [ApiController]
    public class MyAuthController : CommonController
    {
        private MyAuthService Service { get; set; }

        public AuthApiController()
        {
            this.Service = new MyAuthService(new MyDbContext(), this);
        }

        /// <summary>
        /// Signs in a user and fetch their data.
        /// </summary>
        [HttpPost]
        [JsonRoute("api/auth/signin", Name = "api.auth.signin")]
        [ProducesResponseType(typeof(UserDto), 200)]
        public ContentResult Signin([FromBody] SigninModel model)
        {
            try {
                User user = this.Service.Signin(model.Email, model.Password);
                UserDto dto = new(user, Details.High);
                return this.Response.AsJson(dto);
            } catch (ResponseException ex) {
                return this.Response.AsJson(ex);
            } catch (Exception ex) {
                return this.Response.AsJson(ex);
            }
        }

        /// <summary>
        /// Creates a new access token for a user with their refresh token.
        /// </summary>
        [HttpPost]
        [JsonRoute("api/auth/refresh", Name = "api.auth.refresh")]
        [ProducesResponseType(typeof(UserDto), 200)]
        public ContentResult Refresh([FromBody] AuthTokenModel model)
        {
            try {
                Guid token;
                if (model.Token.HasValue) {
                    token = model.Token.Value;
                } else if (this.OperationContext.User?.AccessToken != null) {
                    token = this.OperationContext.User.AccessToken.Id;
                } else {
                    throw new BadRequestException();
                }

                User user = this.AuthService.RefreshToken(token);
                UserDto dto = new(user, Details.High);
                return this.Response.AsJson(dto);
            } catch (ResponseException ex) {
                return this.Response.AsJson(ex);
            } catch (Exception ex) {
                return this.Response.AsJson(ex);
            }
        }

        /// <summary>
        /// Creates a new access token for a user with their refresh token.
        /// </summary>
        [HttpPost]
        [JsonRoute("api/auth/revoke", Name = "api.auth.revoke")]
        [ProducesResponseType(typeof(UserDto), 200)]
        public ContentResult Revoke([FromBody] AuthTokenModel model)
        {
            try {
                Guid token;
                if (model.Token.HasValue) {
                    token = model.Token.Value;
                } else if (this.OperationContext.User?.AccessToken != null) {
                    token = this.OperationContext.User.AccessToken.Id;
                } else {
                    throw new BadRequestException();
                }

                this.AuthService.RevokeToken(token);
                return this.Response.AsJson();
            } catch (ResponseException) {
                return this.Response.AsJson();
            } catch (Exception) {
                return this.Response.AsJson();
            }
        }
    }
    ```

## Front-end