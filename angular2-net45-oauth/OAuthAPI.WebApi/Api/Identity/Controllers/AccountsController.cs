using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security.Provider;
using OAuthAPI.Data.Identity;
using OAuthAPI.WebApi.Api.Identity.Models.BindingModels;
using OAuthAPI.WebApi.Api.Identity.Models.ViewModels;
using SendGrid;

namespace OAuthAPI.WebApi.Api.Identity.Controllers
{
    [Authorize]
    public class AccountsController : BaseApiController
    {
        //GET: api/accounts/IsAuthenticated
        [HttpGet]
        public async Task<IHttpActionResult> IsAuthenticated()
        {
            return Ok("true");
        }

        //GET: api/accounts/CreateUser
        [HttpPost, AllowAnonymous]
        public async Task<IHttpActionResult> Create(CreateUserBindingModel createUserModel)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = new ApplicationUser()
            {
                UserName = createUserModel.Username,
                Email = createUserModel.Username,
                AccountCreated = DateTimeOffset.Now,
            };


            IdentityResult addUserResult = await AppUserManager.CreateAsync(user, createUserModel.Password);

            if (!addUserResult.Succeeded)
            {
                return GetIdentityErrorResult(addUserResult);
            }

            Uri locationHeader = new Uri(Url.Link("GetUserById", new { id = user.Id }));

            return Created(locationHeader, _mapper.Map<UserViewModel>(user));

        }

        //GET: api/accounts/SendConfirmEmail
        [HttpGet]
        public async Task<IHttpActionResult> SendConfirmEmail()
        {
            var userId = User.Identity.GetUserId();
            string code = await AppUserManager.GenerateEmailConfirmationTokenAsync(userId);

            var callbackUrl = new Uri(Url. Link("ConfirmEmailRoute", new {  userId, code }));

            //we need to do this otherwise the + in the string gets replaced with a space
            var urlCode = Uri.EscapeDataString(code);
            var url = $"{callbackUrl.Scheme}://{callbackUrl.Authority}/auth/verify?userId={userId}&code={urlCode}";

            var body = $"Please confirm your account by clicking <a href=\"{url}\">here</a>";
            
            await AppUserManager.SendEmailAsync(userId, "Confirm your account", body);
                                                    
            return Ok();
        }

        //GET: api/accounts/ConfirmEmail
        [HttpGet, AllowAnonymous]
        public async Task<IHttpActionResult> ConfirmEmail(string userId = "", string code = "")
        {
            var escapedCode  = Uri.UnescapeDataString(code);
            if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(escapedCode))
            {
                ModelState.AddModelError("", "User Id and Code are required");
                return BadRequest(ModelState);
            }

            IdentityResult result = await AppUserManager.ConfirmEmailAsync(userId, code);

            if (result.Succeeded)
            {
                return Ok();
            }
            
            return GetIdentityErrorResult(result);
            
        }
        //POST: api/accounts/ChangePassword
        [HttpPost]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await AppUserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);

            if (!result.Succeeded)
            {
                return GetIdentityErrorResult(result);
            }

            return Ok();
        }

        [HttpGet, AllowAnonymous]
        public async Task<IHttpActionResult> SendForgotPassword(SendForgotPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await AppUserManager.FindByNameAsync(model.Email);

            string code = await AppUserManager.GeneratePasswordResetTokenAsync(user.Id);
            var callbackUrl = new Uri(Url.Link("ResetPassword", new { user.Id, code }));

            //we need to do this otherwise the + in the string gets replaced with a space
            var urlCode = Uri.EscapeDataString(code);
            var url = $"{callbackUrl.Scheme}://{callbackUrl.Authority}/auth/ResetPassword?userId={user.Id}&code={urlCode}";

            await AppUserManager.SendEmailAsync(user.Id, "Reset Password", "Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>");

            return Ok();
        }

        [HttpGet, AllowAnonymous]
        public async Task<IHttpActionResult> ResetPassword(ResetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var user = await AppUserManager.FindByNameAsync(model.Email);
            if (user == null)
            {
                return BadRequest("Account does not exist");
            }
            var result = await AppUserManager.ResetPasswordAsync(user.Id, model.Code, model.NewPassword);

            if (result.Succeeded)
            {
                return Ok();
            }

            return GetIdentityErrorResult(result);

        }


    }
}