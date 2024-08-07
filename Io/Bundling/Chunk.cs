﻿using WebCommons.IO;

namespace WebCommons.Bundling
{
    /// <summary>
    /// Defines the files of a bundle chunk.
    /// The files in a chunk are listed in this order:
    /// <list type="bullet">
    ///     <item><see cref="Files">Specific files</see> first.</item>
    ///     <item>For each <see cref="Directories">directory</see> and its subdirectories, all files matching each <see cref="Patterns">pattern</see>.</item>
    /// </list>
    /// </summary>
    public class CustomBundleChunk
    {
        /// <summary>
        /// List of files to be added first.
        /// </summary>
        public string[] Files { get; set; } = Array.Empty<string>();

        /// <summary>
        /// List of directories to be added after specific files.
        /// For each directory and its subdirectories, we add all files matching each pattern.
        /// <example>/Content/CSS</example>
        /// </summary>
        public string[] Directories { get; set; } = Array.Empty<string>();

        /// <summary>
        /// List of patterns.
        /// <example>*.css</example>
        /// </summary>
        public string[] Patterns { get; set; } = Array.Empty<string>();

        /// <summary>
        /// List of patterns to exclude files.
        /// <example>*.test.css</example>
        /// </summary>
        public string[] ExcludedPatterns { get; set; } = Array.Empty<string>();

        /// <summary>
        /// Prepends a string before the chunk contents.
        /// </summary>
        public string Prefix { get; set; } = string.Empty;

        /// <summary>
        /// Appends a string to the chunk contents.
        /// </summary>
        public string Suffix { get; set; } = string.Empty;

        /// <summary>
        /// Determines if the chunk will be prepended or appended to the whole of the contents merged before it.
        /// </summary>
        public bool Append { get; set; } = true;

        /// <summary>
        /// Gets all the chunk file paths.
        /// </summary>
        public List<string> GetFilesToMerge()
        {
            List<string> filesToMerge = this.Files.ToList();

            // For each directory
            foreach (string directory in this.Directories) {
                string dir = SystemFile.MapPath(directory);

                // For each pattern
                foreach (string pattern in this.Patterns) {
                    // Find all files matching the pattern
                    string[] directoryFiles = Directory.GetFiles(dir, pattern, SearchOption.AllDirectories);
                    directoryFiles = directoryFiles.Where(filePath => {
                        return !this.ExcludedPatterns.Any(exc => filePath.EndsWith(exc, StringComparison.OrdinalIgnoreCase));
                    }).ToArray();

                    // For each file found
                    foreach (string f in directoryFiles) {
                        // Clean the path value
                        string file = f.Replace(@"\", "/");
                        file = file.Substring(file.IndexOf(directory));
                        // Skip it if it has already been added
                        if (filesToMerge.Contains(file)) continue;
                        // Add it
                        filesToMerge.Add(file);
                    }
                }
            }

            return filesToMerge;
        }
    }

    public static class CustomBundleChunkExtensions
    {
        #region JS

        /// <summary>
        /// Adds the Drawdown JS library for markdown text formatting.
        /// </summary>
        public static void AddJsDrawdown(this List<CustomBundleChunk> chunks)
		{
			chunks.Add(new CustomBundleChunk() {
                Files = new string[] { "/Commons/ThirdParty/Drawdown/drawdown.js" }
            });
		}

		/// <summary>
		/// Adds the Fuse JS library for fuzzy searching through lists.
		/// </summary>
		public static void AddJsFuse(this List<CustomBundleChunk> chunks)
		{
			chunks.Add(new CustomBundleChunk() {
                Files = new string[] { "/Commons/ThirdParty/Fuse/fuse.js" }
            });
		}

		/// <summary>
		/// Adds the React JS library for creating UI components.
		/// </summary>
		/// <param name="env">Can be "dev" or "prod".</param>
		public static void AddJsReact(this List<CustomBundleChunk> chunks, string env = "dev")
		{
			chunks.Add(new CustomBundleChunk() {
                Files = new string[] { $"/Commons/ThirdParty/React/{env}.js" }
            });
		}

		/// <summary>
		/// Adds the common JS framework files.
		/// </summary>
		public static void AddJsCommons(this List<CustomBundleChunk> chunks)
		{
			chunks.Add(new CustomBundleChunk() {
                Directories = new string[] { "/Commons" },
                Patterns = new string[] { "*.base.js", "*.js", "*.base.jsx", "*.jsx" }
            });
		}

        #endregion

        #region CSS

		/// <summary>
		/// Adds the commons CSS framework files.
		/// </summary>
		public static void AddCssCommons(this List<CustomBundleChunk> chunks)
		{
			chunks.Add(new CustomBundleChunk() {
				Patterns = new string[] { "*.scss" },
				Directories = new string[] { "/Commons" },
			});
		}

		#endregion
    }
}