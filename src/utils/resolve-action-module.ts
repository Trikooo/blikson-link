import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Recursively resolves the correct .ts file for a given action/subaction path.
 * - If a segment is a file, returns it (no further subactions allowed).
 * - If a segment is a directory, continues into it.
 * - If the path ends on a directory, loads index.ts.
 *
 * @param basePath Absolute path to the model directory (e.g., /.../models/parcels)
 * @param segments Array of action/subaction segments (e.g., ['create', 'tracking-note'])
 * @returns Absolute path to the .ts file to import
 */
export function resolveActionModule(basePath: string, segments: string[]): string {
  let currentPath = basePath;
  // Iterate through each segment of the action path
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const filePath = join(currentPath, `${segment}.ts`); // e.g., .../create.ts
    const dirPath = join(currentPath, segment); // e.g., .../create/

    // 1. Check if the segment is a file (e.g., create.ts)
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      // If there are more segments after this, it's an error (can't have subactions after a file)
      if (i !== segments.length - 1) {
        throw new Error(`Subaction provided but '${segment}.ts' is a file`);
      }
      // Found the file, return its path
      return filePath;
    }

    // 2. Check if the segment is a directory (e.g., create/)
    if (existsSync(dirPath) && statSync(dirPath).isDirectory()) {
      // Continue into the directory for the next segment
      currentPath = dirPath;
      continue;
    }

    // 3. If neither file nor directory exists, the action/subaction is invalid
    throw new Error(`Action or subaction '${segment}' not found`);
  }

  // 4. If we end on a directory (no more segments), try to load index.ts in that directory
  const indexPath = join(currentPath, "index.ts");
  if (existsSync(indexPath) && statSync(indexPath).isFile()) {
    return indexPath;
  }

  // 5. If no valid file is found, throw an error
  throw new Error("No valid action file found");
}
