﻿using WebCommons.IO;

namespace WebCommons.Bundling
{
	/// <summary>
	/// Defines bundles and manages their operations.
	/// </summary>
	public class CustomBundleManager
	{
		/// <summary>
		/// If false, the bundle file will be recreated every time.
		/// </summary>
		public static bool IsCachingEnabled { get; set; } = true;

		/// <summary>
		/// The directory where bundles will be saved.
		/// </summary>
		protected string Directory = "";

		/// <summary>
		/// Map of placeholders and values. Values will replace the placeholders in the content.
		/// </summary>
		protected Dictionary<string, string> Values = new();

		/// <summary>
		/// List of bundles.
		/// </summary>
		protected List<CustomBundle> Bundles = new();

		/// <summary>
		/// Gets a bundle by name.
		/// </summary>
		/// <exception cref="Exception">Thrown if the bundle was not found.</exception>
		public CustomBundle GetBundle(string name)
		{
			CustomBundle bundle = this.Bundles.FirstOrDefault(b => b.Name == name);
			if (bundle == null) { throw new Exception("Bundle not found"); }
			return bundle;
		}

		/// <summary>
		/// Merges the bundle's files and saves the contents.
		/// </summary>
		/// <returns>The file stream of the bundle.</returns>
		public FileStream Bundle(CustomBundle bundle)
		{
			SystemFile cachedFile = new(this.Directory + "/" + bundle.Name);

			// If caching is enabled, use existing file
			if (cachedFile.Exists() && IsCachingEnabled) {
				return cachedFile.ReadAsStream();
			}

			// Build the bundle
			string contents = bundle.GetContents();

			// Replace placholders with values
			foreach (KeyValuePair<string, string> v in this.Values) {
				contents = contents.Replace(v.Key, v.Value);
			}

			// Create the bundle file and return the stream
			contents = this.Transform(contents);
			cachedFile.Write(contents);
			return cachedFile.ReadAsStream();
		}

		/// <summary>
		/// Transforms the contents before saving them.
		/// </summary>
		public virtual string Transform(string content)
		{
			return content;
		}
	}
}