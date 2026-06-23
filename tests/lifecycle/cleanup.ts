import path from 'path';
import fs from 'fs';

export async function cleanupTestData(opts: { keepAdminContext: boolean } = { keepAdminContext: false }): Promise<void> {
  const authStatesDir = path.join(process.cwd(), 'tests/auth-states');
  const generatedTestDataDir = path.join(process.cwd(), 'tests/generated-test-data');
  try {
    for (let dir of [authStatesDir, generatedTestDataDir]) {
      if (fs.existsSync(dir)) {
        for (const file of fs.readdirSync(dir)) {
          if (opts.keepAdminContext && file.endsWith('admin-context.json')) {
            console.info(`  ⚠️ Skipped: ${file}`);
            continue;
          }

          fs.unlinkSync(path.join(dir, file));
          console.info(`  ✅ Deleted: ${file}`);
        }
        console.info(`🧹 Cleaned up "${dir}" directory`);
      }
    }
  } catch (error) {
    console.error('❌ Error cleaning up test data:', error);
  }
}
