using Microsoft.AspNetCore.Http;
using System.Security.Cryptography;

namespace WebCommons.Auth
{
    public static class CommonAuthExtensions
    {
        /// <summary>
        /// Carrying an extra salt inside of the source slightly improves security in case data is compromised.
        /// </summary>
        private const string SALT = "WQ33ijFDOoyDHF41XvZQ";

        public static void SetUser(this HttpContext context, object? user)
        {
            if (user == null) return;
            else context.Items["user"] = user;
        }

        public static object? GetUser(this HttpContext context)
        {
            return context.Items["user"];
        }

        public static T? GetUser<T>(this HttpContext context)
        {
            return (T)context.Items["user"];
        }

        /// <summary>
        /// Encrypts a value with a salt as SHA512.
        /// </summary>
        public static string Encrypt(this string value, string? salt = null)
        {
            string encrypted = value + salt + SALT;
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(encrypted);
            using SHA512 alg = SHA512.Create();
            byte[] hash = alg.ComputeHash(bytes);
            string hashedString = string.Empty;
            foreach (byte x in hash) hashedString += String.Format("{0:x2}", x);
            return hashedString;
        }

        /// <summary>
        /// <see cref="Encrypt(string, string?)"/>
        /// </summary>
        public static string Encrypt(this Guid value, string? salt = null)
        {
            return value.ToString().Encrypt(salt);
        }

        /// <summary>
        /// Determines if a value matches its encrypted value.
        /// </summary>
        public static bool VerifyEncryption(this string encryptedValue, string value, string? salt = null)
        {
            return encryptedValue == value.Encrypt(salt);
        }

        /// <summary>
        /// Generate a random alphanumeric string. The string includes lower and upper case characters.
        /// </summary>
        public static string GenerateSalt(int length = 10)
        {
            char[] chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".ToCharArray();
            Random random = new();
            return new string(Enumerable.Repeat(chars, length).Select(s => s[random.Next(s.Length)]).ToArray());
        }
    }
}
