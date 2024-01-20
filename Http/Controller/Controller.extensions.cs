using Microsoft.AspNetCore.Mvc;
using System.Net;
using WebCommons;

public static class ControllerExtensions
{
    /// <summary>
    /// Determines if the model is valid.
    /// </summary>
    /// <returns>True if the model is valid.</returns>
    /// <exception cref="BadRequestException">Thrown as a bad request (400) if the model is not valid.</exception>
    public static bool ModelMustBeValid(this Controller controller)
    {
        if (controller.ModelState.IsValid) return true;
        throw new BadRequestException();
    }

    #region View response

    public static ViewResult View(this Controller controller, Exception ex)
    {
        return controller.View(500);
    }

    public static ViewResult View(this Controller controller, ResponseException ex)
    {
        return controller.View(ex.StatusCode);
    }

    public static ViewResult View(this Controller controller, HttpStatusCode code)
    {
        return controller.View((int) code);
    }

    public static ViewResult View(this Controller controller, int code)
    {
        controller.Response.StatusCode = code;
        return controller.View();
    }

    #endregion
}