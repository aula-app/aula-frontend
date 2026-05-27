# Aula E2E Test Suite

Comprehensive end-to-end testing using Playwright following industry best practices.

## 📁 Directory Structure

```
tests/
├── fixtures/                 # Test fixtures and data
│   ├── aula-test-fixtures.ts # Playwright fixtures (logged-in contexts, browser pages)
│   └── sql/                  # DB SQL scripts for SetUp/TearDown
│       └── *.sql             # Truncate & ReSeed DB scripts
│
├── support/                  # Core utilities and configuration
│   ├── types.ts              # TypeScript type definitions
│   ├── config.ts             # Test configuration constants
│   ├── utils.ts              # Utility functions (gensym, host, etc.)
│   ├── constants.ts          # Timeouts, selectors, test IDs
│
├── helpers/                  # Test helpers and factories
│   └── entities.ts           # Entity factory functions (rooms, ideas, users)
│
├── interactions/             # Page interaction functions
│   ├── browsers.ts           # Browser management
│   ├── navigation.ts         # Navigation helpers
│   ├── forms.ts              # Form interaction helpers
│   ├── users.ts              # User-specific interactions
│   ├── rooms.ts              # Room interactions
│   ├── ideas.ts              # Idea interactions
│   ├── boxes.ts              # Box interactions
│   ├── messages.ts           # Message interactions
│   ├── settings.ts           # Settings interactions
│   └── interface.ts          # Common UI interactions
│
├── lifecycle/                # Test lifecycle hooks
│   ├── setup-auth.ts         # Global setup (authentication cleanup and mkdir)
│   ├── teardown-auth.ts      # Global teardown (cleanup)
│   └── cleanup.ts            # Cleans up authentication data
│
├── specs/                    # Test specifications
│   ├── core/                 # Core functionality tests
│   │   ├── rooms.spec.ts
│   │   ├── ideas.spec.ts
│   │   ├── ...
│   │   ├── ...
│   │   └── *.spec.ts
│   │
│   └── disabled/             # Disabled/WIP tests
│
├── auth-states/         # Saved authentication states (gitignored)
├── generated-test-data/ # Generated data such as CSV files for import test (gitignored)
└── reports/             # Test reports and artifacts (gitignored)
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
import { test, expect } from '../../fixtures/aula-test-fixtures';

test('My test', async ({ newPageFor }) => {
  const adminPage = await newPageFor('admin');

  await test.step('First step', async () => {
    // Your test logic
  });
});
```

### Available Fixtures
- `newPageFor(username: string)` - Open a page (existing or new) for the specified user
- `seededUser` - User data that is seeded in the DB
- `seededStudent` - Student data that is seeded in the DB
- `seededRoom` - Room data that is seeded in the DB

### Using Test Steps

Always wrap logical test sections in `test.step()` for better reporting:

```typescript
test('User can create room', async ({ newPageFor }) => {
  const userPage = await newPageFor('user');

  await test.step('Create a Room', async () => {
    await navigation.goToRooms(userPage);
    await rooms.create(userPage, roomData);
  });

  await test.step('Verify room created', async () => {
    await expect(userPage.getByText(roomData.name)).toBeVisible();
  });
});
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

1. Cleans up any possibly leftover auth state files
1. Initializes browser

### Teardown (`lifecycle/teardown-auth.ts`)

Runs once after all tests:

1. Cleans up all leftover state data on filesystem

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test Fixtures Guide](https://playwright.dev/docs/test-fixtures)
- [Page Object Model](https://playwright.dev/docs/pom)

## 🤝 Contributing

When adding new tests:

1. Use the fixture system (`test.extend`)
2. Add `test.step()` for readability
3. Use constants for timeouts/selectors
4. Follow naming conventions (descriptive test names)
5. Add proper assertions

## ⚠️ Common Issues

### Flaky tests

- Increase timeout if needed
- Use proper waits (`waitForLoadState`, `waitForSelector`)
- Temporarily increase retries until debugged
