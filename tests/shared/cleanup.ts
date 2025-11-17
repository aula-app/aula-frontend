/**
 * Test cleanup utilities
 */
import fs from 'fs/promises';
import path from 'path';

export class TestCleanup {
  /**
   * Clean up all test artifacts
   */
  static async cleanupAll(): Promise<void> {
    const cleanupTasks = [
      this.cleanupTempDirectory(),
      this.cleanupAuthStates(),
      this.cleanupOldRootFiles(),
      this.cleanupTestReports(),
    ];

    const results = await Promise.allSettled(cleanupTasks);

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        console.warn(`Cleanup task ${index} failed:`, result.reason);
      }
    });
  }

  /**
   * Clean up the tests/auth-states directory
   */
  static async cleanupTempDirectory(): Promise<void> {
    const tempDir = 'tests/auth-states';

    try {
      const files = await fs.readdir(tempDir);

      for (const file of files) {
        // Skip .gitignore and other dotfiles
        if (!file.startsWith('.')) {
          await fs.rm(path.join(tempDir, file), { force: true, recursive: true });
        }
      }

      console.log(`✅ Cleaned up ${files.filter((f) => !f.startsWith('.')).length} files from ${tempDir}`);
    } catch (error) {
      // Directory might not exist, ignore
      console.log(`ℹ️ ${tempDir} directory does not exist or is already clean`);
    }
  }

  /**
   * Clean up the tests/auth-states directory
   */
  static async cleanupAuthStates(): Promise<void> {
    const authStatesDir = 'tests/auth-states';

    try {
      const files = await fs.readdir(authStatesDir);

      for (const file of files) {
        // Skip .gitignore and other dotfiles
        if (!file.startsWith('.')) {
          await fs.rm(path.join(authStatesDir, file), { force: true, recursive: true });
        }
      }

      console.log(`✅ Cleaned up ${files.filter((f) => !f.startsWith('.')).length} files from ${authStatesDir}`);
    } catch (error) {
      // Directory might not exist, ignore
      console.log(`ℹ️ ${authStatesDir} directory does not exist or is already clean`);
    }
  }

  /**
   * Clean up old files from root directory (legacy cleanup)
   */
  static async cleanupOldRootFiles(): Promise<void> {
    // Pattern to match old test artifacts in root
    const patterns = ['*-context.json', 'run-id.txt'];

    for (const pattern of patterns) {
      try {
        const files = await fs.readdir('.');
        const matchedFiles = files.filter((file) => {
          if (pattern.includes('*')) {
            const regex = new RegExp('^' + pattern.replace('*', '.*') + '$');
            return regex.test(file);
          }
          return file === pattern;
        });

        for (const file of matchedFiles) {
          await fs.rm(file, { force: true });
        }
      } catch {
        // Ignore errors
      }
    }
  }

  /**
   * Clean up old test result directories from root (if they exist)
   */
  static async cleanupTestReports(): Promise<void> {
    const dirsToClean = ['playwright-report', 'test-results'];

    for (const dir of dirsToClean) {
      try {
        await fs.rm(dir, { recursive: true, force: true });
      } catch {
        // Ignore if directory doesn't exist
      }
    }
  }

  /**
   * Ensure temp directory exists
   */
  static async ensureTempDirectory(): Promise<void> {
    try {
      await fs.mkdir('tests/auth-states', { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }
  }
}
