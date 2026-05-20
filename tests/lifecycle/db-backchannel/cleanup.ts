import path from 'path';
import fs from 'fs';

export async function cleanupAuthStates(opts: { keepAdminContext: boolean } = { keepAdminContext: false }): Promise<void> {
  const authStatesDir = path.join(process.cwd(), 'tests/auth-states');
  try {
    if (fs.existsSync(authStatesDir)) {
      for (const file of fs.readdirSync(authStatesDir)) {
        if (opts.keepAdminContext && file.endsWith('admin-context.json')) {
          console.info(`  ⚠️ Skipped: ${file}`);
          continue;
        }

        fs.unlinkSync(path.join(authStatesDir, file));
        console.info(`  ✅ Deleted: ${file}`);
      }
      console.info('🧹 Cleaned up auth-states directory');
    }
  } catch (error) {
    console.error('❌ Error cleaning up auth-states:', error);
  }
}
