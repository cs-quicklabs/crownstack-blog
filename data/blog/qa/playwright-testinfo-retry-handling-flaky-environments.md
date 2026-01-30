---
title: 'How To Use Playwright testInfo.retry To Deal With Flaky Environments'
date: '2025-12-12'
lastmod: '2025-12-12'
tags: ['qa', 'guide', 'playwright', 'testing']
draft: false
summary: 'Learn how to use Playwright testInfo.retry property to handle flaky tests and unstable environments in your test automation'
layout: PostSimple
images: []
authors: ['puneet-yadav']
---

![Playwright Retry](/static/images/blogs/qa/playwright-testinfo-retry-handling-flaky-environments/playwright-retry.png 'Playwright Retry')

## Introduction

When working with unstable test environments, you may encounter flaky tests that fail intermittently. To ensure you don't get false negative results, you need to rerun failed tests. Playwright makes this easy by allowing you to pass the `--retries` flag when running your tests.

However, sometimes you need more control over how retries work. That's where `testInfo.retry` comes in handy. `testInfo` provides useful information about the current test run, and the `retry` property tells you which retry attempt you're on (0 for the first run, 1 for the first retry, and so on).

## Skipping Certain Tests If Retried

In some scenarios, you might not want to retry certain tests when running your automation suite. For example, when working with a large suite (1500+ tests), you may want to skip retries for specific tests that are known to be resource-intensive or time-consuming. The solution is to use `testInfo.retry` to conditionally skip tests during retry attempts.

Here's how you can skip a test if it's being retried:

```jsx
const { test, expect } = require('@playwright/test')

test('My test', async ({}, testInfo) => {
  if (testInfo.retry > 0) {
    test.skip()
  }

  expect(1).toBe(2) // This will fail
})
```

When the test is run:

- The test fails initially because 1 is not 2
- On retry, `testInfo.retry` is updated and equals 1 (or higher for subsequent retries)
- The condition `testInfo.retry > 0` checks if this is a retry attempt and skips the test accordingly

## Adding a Delay to Your Test If Retried

When your test environment is experiencing high load or instability, you can add progressive delays using `testInfo.retry`. This allows you to increase wait times based on the retry attempt number, giving the environment more time to stabilize.

```jsx
const { test, expect } = require('@playwright/test')

function waitFor(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

test.describe('My test suite', () => {
  test.beforeEach(async ({}, testInfo) => {
    await waitFor(testInfo.retry * 2000) // 2 seconds per retry
  })

  test('My test', async () => {
    expect(1).toBe(2) // This will fail
  })
})
```

When the test is run:

- The initial run doesn't wait because `0 * 2000 = 0` milliseconds
- If the test fails, the first retry will wait for 2 seconds because `1 * 2000 = 2000` milliseconds
- Subsequent retries will wait proportionally longer (4 seconds for retry 2, 6 seconds for retry 3, etc.)
- Adjust the multiplier (2000 in this example) to whatever duration works best for your environment

## Cleaning Up Data After Test Retries

`testInfo.retry` can also be used to clean up data. For example, if you want to delete certain data created by retries but keep what's created by the initial run, you could write the code this way:

```jsx
const { test, expect } = require('@playwright/test')

async function cleanUpEnvironment() {
  // Your cleanup logic here
  console.log('Cleaning up environment...')
}

test.describe('My test suite', () => {
  test.afterEach(async ({}, testInfo) => {
    if (testInfo.retry) {
      await cleanUpEnvironment()
    }
  })

  test('My test', async () => {
    // Your test logic that creates data
    expect(1).toBe(2) // This will fail
  })
})
```

This way, cleanup only happens after retry attempts, not after the initial run. This is useful when you want to preserve data from successful initial runs but clean up failed retry attempts.

## Creating Unique Test Data Per Retry

You can also utilize `testInfo.retry` to create unique identifiers for test data. This is particularly useful when you need to track which data was created during which retry attempt, or when you want to ensure test isolation by using unique values for each retry.

For example, you could create unique test data based on the retry number:

```jsx
test('Test with unique data per retry', async ({ page }, testInfo) => {
  const uniqueId = `test-data-retry-${testInfo.retry}`

  await page.fill('#username', `user-${testInfo.retry}`)
  await page.fill('#email', `test-${testInfo.retry}@example.com`)

  // Your test logic here
})
```

This approach ensures that each retry attempt uses distinct data, preventing conflicts and making it easier to debug issues specific to a particular retry attempt.

## Conclusion

Using `testInfo.retry` in Playwright gives you powerful control over how your tests behave during retry attempts. Whether you need to skip certain tests, add delays for unstable environments, or clean up test data, `testInfo.retry` provides the flexibility you need.

Remember, retries are a tool to handle flaky environments, but they shouldn't be used to mask real issues. Always investigate why tests are failing and fix the root cause when possible.

The official Playwright docs for retries can be found [here](https://playwright.dev/docs/test-retries)!

**Happy Testing!**

## References:

- [Playwright Test Retries Documentation](https://playwright.dev/docs/test-retries)
- [Playwright testInfo API](https://playwright.dev/docs/api/class-testinfo)
