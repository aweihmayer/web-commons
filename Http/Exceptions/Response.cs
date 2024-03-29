﻿using System.Net;

namespace WebCommons
{
    public class ResponseException : Exception
    {
        public HttpStatusCode StatusCode { get; set; }
        public bool HasDefaultMessage { get; set; } = false;

        public ResponseException(HttpStatusCode statusCode, string? message = null) : base(message) {
            this.StatusCode = statusCode; 
            if (string.IsNullOrEmpty(message)) this.HasDefaultMessage = true;
        }
    }
}