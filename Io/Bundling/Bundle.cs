﻿using WebCommons.IO;

namespace WebCommons.Bundling
{
	/// <summary>
	/// Defines files that are merged into one.
	/// </summary>
	public class CustomBundle
	{
		/// <summary>
		/// The name of the bundle file.
		/// </summary>
		public string Name { get; set; }

		/// <summary>
		/// The bundle file type see <see cref="FileType"/>.
		/// </summary>
		public FileType.Type FileType { get; set; }

		/// <summary>
		/// Utility caching value. This value does nothing. Use at your own discretion.
		/// </summary>
		public TimeSpan? CacheDuration { get; set; }

		/// <summary>
		/// The file chunks of the bundle.
		/// </summary>
		public List<CustomBundleChunk> Chunks { get; set; } = new();

		public CustomBundle(string name, TimeSpan? cacheDuration = null)
		{
			this.Name = name;
			this.CacheDuration = cacheDuration;
		}

        /// <summary>
        /// Gets the contents of all the chunks.
        /// </summary>
        public string GetContents()
		{
			string contents = "";
			HashSet<string> mergedFiles = new();

			// For each chunk
			foreach (CustomBundleChunk chunk in this.Chunks) {
				// Initialize the chunk content as the prefix
				string chunkContent = chunk.Prefix;

				// For each file to merge
				foreach (string f in chunk.GetFilesToMerge()) {
					// Skip it if it was already merged
					if (mergedFiles.Contains(f)) continue;
					mergedFiles.Add(f);
					// Read the content and merge them
					SystemFile file = new(f);
					string fileContents = File.ReadAllText(file.Path);
					chunkContent += "\n" + fileContents;
				}

				// If the chunk is to be appened, add it at the end of the merge contents
				if (chunk.Append) contents += chunkContent + chunk.Suffix;
				// Otherwise, add it at the beginning
				else contents = chunkContent + chunk.Suffix + contents;
			}

			return contents;
		}
	}
}