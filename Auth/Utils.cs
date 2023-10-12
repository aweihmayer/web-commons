using System.Security.Cryptography;
using WebCommons.Db;

namespace WebCommons.Auth
{
    public static class AuthUtils
    {
        /// <summary>
        /// Carrying an extra salt inside of the source slightly improves security in case data is compromised.
        /// </summary>
        private const string SALT = "WQ33ijFDOoyDHF41XvZQ";

        /// <summary>
        /// Encrypts a value with a salt as SHA512.
        /// </summary>
        public static string Encrypt(string value, string? salt = null)
        {
            string encrypted = value + salt + SALT;
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(encrypted);
            using SHA512 alg = SHA512.Create();
            byte[] hash = alg.ComputeHash(bytes);
            string hashedString = string.Empty;
            foreach (byte x in hash) { hashedString += String.Format("{0:x2}", x); }
            return hashedString;
        }

        public static string Encrypt(Guid value, string? salt = null)
        {
            return Encrypt(value.ToString(), salt);
        }

        /// <summary>
        /// Determines if a value matches its encrypted value.
        /// </summary>
        public static bool VerifyEncryptedValue(string value, string encryptedValue, string? salt = null)
        {
            return (encryptedValue == Encrypt(value, salt));
        }

        /// <summary>
        /// Determines if a value matches its encrypted value.
        /// </summary>
        /// <param name="user">The user whose password we want to validate.</param>
        public static bool VerifyEncryptedValue(string value, CommonUser user)
        {
            if (string.IsNullOrEmpty(user.Password) || string.IsNullOrEmpty(user.Salt)) { return false; }
            return VerifyEncryptedValue(value, user.Password, user.Salt);
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