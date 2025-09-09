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
   * Clean up the tests/temp directory
   */
  static async cleanupTempDirectory(): Promise<void> {
    const tempDir = 'tests/temp';
    
    const filesToClean = [
      'admin-context.json',
      'alice-context.json', 
      'bob-context.json',
      'mallory-context.json',
      'burt-context.json',
      'rainer-context.json',
      'run-id.txt',
      'temp-upload.txt',
      'users.csv',
    ];

    for (const file of filesToClean) {
      await fs.rm(path.join(tempDir, file), { force: true });
    }
  }

  /**
   * Clean up old files from root directory (legacy cleanup)
   */
  static async cleanupOldRootFiles(): Promise<void> {
    const rootFilesToClean = [
      'admin-context.json',
      'alice-context.json',
      'bob-context.json', 
      'mallory-context.json',
      'burt-context.json',
      'rainer-context.json',
      'run-id.txt',
    ];

    for (const file of rootFilesToClean) {
      await fs.rm(file, { force: true });
    }
  }

  /**
   * Clean up old test result directories from root (if they exist)
   */
  static async cleanupTestReports(): Promise<void> {
    const dirsToClean = [
      'playwright-report',
      'test-results',
    ];

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
      await fs.mkdir('tests/temp', { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }
  }
}