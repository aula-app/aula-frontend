# Aula E2E Test Suite

Comprehensive end-to-end testing using Playwright following industry best practices.

## 📁 Directory Structure

```
tests/
├── fixtures/               # Test fixtures and data
│   ├── test-fixtures.ts   # Playwright native fixtures (Page objects, contexts)
│   └── data/              # Test data management
│       └── users.ts       # User fixture management
│
├── support/               # Core utilities and configuration
│   ├── types.ts          # TypeScript type definitions
│   ├── config.ts         # Test configuration constants
│   ├── utils.ts          # Utility functions (gensym, host, etc.)
│   ├── constants.ts      # Timeouts, selectors, test IDs
│   └── test-helpers.ts   # Reusable test helper functions
│
├── helpers/              # Test helpers and factories
│   ├── entities.ts       # Entity factory functions (rooms, ideas, users)
│   ├── api-client.ts     # API client for setup/teardown
│   └── contexts/         # Test context builders
│       └── room-contexts.ts  # Room setup helpers
│
├── interactions/         # Page interaction functions
│   ├── browsers.ts       # Browser management
│   ├── navigation.ts     # Navigation helpers
│   ├── forms.ts          # Form interaction helpers
│   ├── users.ts          # User-specific interactions
│   ├── rooms.ts          # Room interactions
│   ├── ideas.ts          # Idea interactions
│   ├── boxes.ts          # Box interactions
│   ├── messages.ts       # Message interactions
│   ├── settings.ts       # Settings interactions
│   └── interface.ts      # Common UI interactions
│
├── lifecycle/            # Test lifecycle hooks
│   ├── setup-auth.ts     # Global setup (authentication)
│   ├── teardown-auth.ts  # Global teardown (cleanup)
│   ├── base-test.ts      # Base test configuration
│   └── auth-helpers.ts   # Authentication utilities
│
├── specs/                # Test specifications
│   ├── core/            # Core functionality tests
│   │   ├── rooms.spec.ts
│   │   ├── ideas.spec.ts
│   │   ├── boxes.spec.ts
│   │   ├── messages.spec.ts
│   │   ├── csv-import.spec.ts
│   │   ├── instance-offline.spec.ts
│   │   ├── settings-categories.spec.ts
│   │   └── profile-change-pass.spec.ts
│   │
│   ├── admin/           # Admin-specific tests
│   │   └── announcements.spec.ts
│   │
│   └── disabled/        # Disabled/WIP tests
│       └── not_Working/
│
├── auth-states/         # Saved authentication states (gitignored)
└── reports/            # Test reports and artifacts (gitignored)
```

## 🚀 Quick Start

### Running Tests

```bash
# Run all core tests
yarn playwright test --project=core

# Run specific test file
yarn playwright test tests/specs/core/rooms.spec.ts

# Run with UI mode (interactive)
yarn playwright test --ui

# Run with debug mode
yarn playwright test --debug

# Show test report
yarn playwright show-report tests/reports/playwright-report
```

### Running in CI

```bash
# Run all tests with retries
yarn playwright test --retries=2
```

## 📝 Writing Tests

### Using Fixtures

Tests use Playwright's native fixture system for dependency injection:

```typescript
import { test, expect } from '../../fixtures/test-fixtures';

test('My test', async ({ adminPage, userPage, userConfig }) => {
  // adminPage, userPage are automatically initialized
  // userConfig contains user data

  await test.step('First step', async () => {
    // Your test logic
  });
});
```

### Available Fixtures

- `adminPage` - Admin browser page (pre-authenticated)
- `userPage` - User browser page (pre-authenticated)
- `studentPage` - Student browser page (pre-authenticated)
- `userConfig` - User data object
- `studentConfig` - Student data object

### Using Test Steps

Always wrap logical test sections in `test.step()` for better reporting:

```typescript
test('User can create room', async ({ userPage }) => {
  await test.step('Navigate to rooms', async () => {
    await navigation.goToRooms(userPage);
  });

  await test.step('Fill room form', async () => {
    await rooms.create(userPage, roomData);
  });

  await test.step('Verify room created', async () => {
    await expect(userPage.getByText(roomData.name)).toBeVisible();
  });
});
```

### Using Test Helpers

Import from `support/test-helpers.ts` for common operations:

```typescript
import { waitForNetworkIdle, expectVisible } from '../../support/test-helpers';

await waitForNetworkIdle(page);
await expectVisible(page.getByTestId('my-element'));
```

### Using Constants

Import from `support/constants.ts` for timeouts and selectors:

```typescript
import { TIMEOUTS, TEST_IDS } from '../../support/constants';

await page.waitForSelector(TEST_IDS.ROOMS.ADD_BUTTON, { timeout: TIMEOUTS.ONE_SECOND });
```

## 🏗️ Best Practices

### 1. Test Structure

```typescript
// ✅ Good: Clear, step-by-step structure
test('User can create idea', async ({ userPage }) => {
  await test.step('Setup: Navigate to room', async () => {
    await navigation.goToRoom(userPage, 'test-room');
  });

  await test.step('Action: Create idea', async () => {
    await ideas.create(userPage, ideaData);
  });

  await test.step('Assert: Verify idea exists', async () => {
    await expect(userPage.getByText(ideaData.name)).toBeVisible();
  });
});

// ❌ Bad: No structure, unclear intent
test('idea test', async ({ userPage }) => {
  await navigation.goToRoom(userPage, 'test-room');
  await ideas.create(userPage, ideaData);
  await expect(userPage.getByText(ideaData.name)).toBeVisible();
});
```

### 2. Use Descriptive Test Names

```typescript
// ✅ Good
test('Admin can delete room and user loses access');

// ❌ Bad
test('delete room');
```

### 3. Leverage Fixtures

```typescript
// ✅ Good: Use fixtures for setup
test('test name', async ({ adminPage, userConfig }) => {
  // Page and data already initialized
});

// ❌ Bad: Manual setup in every test
test('test name', async () => {
  const page = await browser.newPage();
  const user = await createUser();
  // ...
});
```

### 4. Use Constants

```typescript
// ✅ Good
import { TIMEOUTS } from '../../support/constants';
await page.waitForTimeout(TIMEOUTS.HALF_SECOND);

// ❌ Bad: Magic numbers
await page.waitForTimeout(5000);
```

### 5. Proper Assertions

```typescript
// ✅ Good: Explicit assertions
await expect(page.getByRole('button')).toBeVisible();
await expect(page.getByRole('button')).toBeEnabled();

// ❌ Bad: No assertion
await page.getByRole('button').click();
```

## 🔧 Configuration

### Playwright Config

Key settings in `playwright.config.ts`:

- **Trace**: `retain-on-failure` - Only saves traces when tests fail
- **Screenshots**: `only-on-failure` - Captures screenshots on failure
- **Video**: `retain-on-failure` - Records video on failure
- **Retries**: 1 locally, 2 in CI - Helps with flaky tests
- **Timeout**: 30s for tests, 10s for actions

### Test Timeouts

Defined in `support/constants.ts`:

- `TIMEOUTS.HALF_SECOND` - 5s for fast operations
- `TIMEOUTS.ONE_SECOND` - 10s for standard operations
- `TIMEOUTS.THREE_SECONDS` - 30s for complex operations
- `TIMEOUTS.FIVE_SECONDS` - 15s for network operations

## 🐛 Debugging

### Debug Mode

```bash
# Run in debug mode (opens inspector)
yarn playwright test --debug

# Debug specific test
yarn playwright test tests/specs/core/rooms.spec.ts --debug
```

### View Traces

```bash
# Show report with traces
yarn playwright show-report tests/reports/playwright-report
```

### Screenshots & Videos

Automatically saved to `tests/results/` on failure.

## 📊 Reports

### HTML Report

```bash
yarn playwright show-report tests/reports/playwright-report
```

Includes:

- Test results with pass/fail status
- Execution time
- Screenshots on failure
- Video recordings
- Network logs
- Console logs

## 🔄 Global Lifecycle

### Setup (`lifecycle/setup-auth.ts`)

Runs once before all tests:

1. Creates new run-id
2. Initializes admin browser
3. Logs in admin user
4. Saves authentication state

### Teardown (`lifecycle/teardown-auth.ts`)

Runs once after all tests:

1. Cleans up test data (rooms, ideas, users, boxes)
2. Closes all browsers
3. Cleans up auth states

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Fixtures Guide](https://playwright.dev/docs/test-fixtures)
- [Page Object Model](https://playwright.dev/docs/pom)

## 🤝 Contributing

When adding new tests:

1. Use the fixture system (`test.extend`)
2. Add `test.step()` for better reporting
3. Use constants for timeouts/selectors
4. Follow naming conventions (descriptive test names)
5. Add proper assertions
6. Clean up test data (handled by global teardown)

## ⚠️ Common Issues

### Tests failing with "storageState not found"

Run setup first:

```bash
yarn playwright test --project=core
```

### Flaky tests

- Increase timeout if needed
- Use proper waits (`waitForLoadState`, `waitForSelector`)
- Add retries in CI

### Browser not closing

Check that fixtures properly clean up (they should automatically).
