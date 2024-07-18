---
title: 'Playwright Best Practices: Tips and Techniques for Effective Test Automation'
date: '2024-07-18'
lastmod: '2024-07-18'
tags: ['testing', 'playwright']
draft: false
summary: 'This is guide to follow best practices for automation testing using Playwright'
layout: PostSimple
images: []
authors: ['shashank-jaiswal']
---

![Playwright](/static/images/blogs/testing/playwright-best-practices-tips-and-techniques-for-effective-test-automation/playwright.png 'Playwright')

## Introduction

Automating websites and apps can be challenging, but Playwright from Microsoft makes it a breeze. It helps testers automate tasks across different web browsers like a pro. To nail it with Playwright, you must use the best tricks and strategies. This blog is all about breaking it down in simple terms: how to pick the right elements easily, keep your tests organized neatly, handle those tricky timing issues smartly, and smoothly fit tests into your development process.

These practices will make your tests run like a well-oiled machine, find problems quicker, and help you build top-notch software with Playwright. So, whether you’re a seasoned tester or just diving in, buckle up as we take you through the essentials of using Playwright to ace your automation game!

## Foundational Steps in Test Planning: Defining Clear Coverage Goals

Before you dive into code, take a moment to figure out your testing goals. Ask yourself: Are you focusing on the main stuff, specific user paths, or unusual situations? Knowing this helps you decide which tests to do first and use your resources smartly. When you set clear testing goals from the start, you're building a strong base for testing that really works for your project. This not only makes your software better but also makes testing quicker and more effective.

## Importance of Having a Strong Framework

In tools like Playwright, a framework acts as a solid foundation by organizing tests into manageable sections. This makes them easier to handle and understand with clear names and comments. Frameworks also save time by reusing actions across tests and ensuring that one test's failure doesn't disrupt others. Overall, frameworks streamline automated testing, making it more reliable and efficient for software development.

Below are the Key Considerations for Creating an Effective Automation Framework

### 1. Page Object Model (POM)

Page Object Model (POM) is a design pattern used in test automation to enhance code maintainability and readability. It involves creating a separate class or module for each web page or component of an application. This class encapsulates the page's elements and functionality, allowing tests to interact with the page through high-level methods. POM promotes reusability and reduces code duplication by centralizing page-specific logic within dedicated classes or modules.

```jsx
//Page Class

class LoginPage {
  constructor(page) {
    this.page = page
  }

  async open() {
    await this.page.goto('https://example.com/login')
  }

  async login(username, password) {
    await this.page.fill('#username', username)
    await this.page.fill('#password', password)
    await this.page.click('[data-testid="login-button"]')
  }
}

module.exports = LoginPage
```

```jsx
//Test class where we are using Page class

const { test, expect } = require('@playwright/test')
const { LoginPage } = require('./LoginPage')

test('Login functionality', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.open()
  await loginPage.login('your-username', 'your-password')

  // Assertion for successful login
  await expect(page.locator('h1')).toHaveText('Welcome')
})
```

### 2. Use of **.json files for Data-driven testing**

Using `.json` files in Playwright for data-driven testing simplifies managing login details. In `users.json`, we define `validUser` and `invalidUser` with usernames and passwords. These are used in `login.test.js` for tests: `userData.validUser` for successful logins and `userData.invalidUser` for failed logins. This keeps data organized, makes tests clear, and allows for easy updates. It's flexible and works well with different data sources, ensuring efficient testing in Playwright.

```json
// Creating .json file and storing all positive and negative Test data
{
  "validUser": {
    "username": "testuser",
    "password": "password123"
  },
  "invalidUser": {
    "username": "invaliduser",
    "password": "wrongpassword"
  }
}
```

```jsx
//Using above .json data in Test class

const { test, expect } = require('@playwright/test')
const { LoginPage } = require('./LoginPage')
const userData = require('./users.json')

test('Login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.open()
  await loginPage.login(userData.validUser.username, userData.validUser.password)

  // Assertion for successful login
  await expect(page.locator('h1')).toHaveText('Welcome')
})

test('Login with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page)

  await loginPage.open()
  await loginPage.login(userData.invalidUser.username, userData.invalidUser.password)

  // Assertion for invalid login message
  await expect(page.locator('[data-testid="error-message"]')).toHaveText('Invalid credentials')
})
```

### 3. Use of **.env files for setting up environment variables**

Automation frameworks prioritize security and maintainability using `.env` files. These files securely store sensitive data like passwords separately from code. They manage environment-specific settings (e.g., URLs, database connections) without altering core scripts, reducing errors. `.env` files improve code readability by keeping sensitive information out of test scripts, aiding collaboration and updates. Excluded from version control, they ensure secure development practices. In summary, `.env` files are essential for robust automation frameworks, safeguarding data, simplifying environment management, and enhancing testing efficiency.

Below are High-level steps to setup `.env` files

1. Create a package named `env` Within this package, create `.env.EnvironmentName` files according to your specific requirements.

env/
├── `.env.Development`
├── `.env.Staging`
└── `.env.Production`

![Env Variable 1](/static/images/blogs/testing/playwright-best-practices-tips-and-techniques-for-effective-test-automation/env-variable-1.png 'Env Variable 1')

2. Store environment-specific sensitive data in dedicated `.env.EnvironmentName` files under the `env` package. This practice ensures secure and organized management of configuration settings across different environments.

![Env Variable 2](/static/images/blogs/testing/playwright-best-practices-tips-and-techniques-for-effective-test-automation/env-variable-2.png 'Env Variable 2')

3. To set the path of the `.env` file in `playwright.config.js`, use the dotenv package to load environment-specific configurations. Update the configuration as follows

![Env Variable 3](/static/images/blogs/testing/playwright-best-practices-tips-and-techniques-for-effective-test-automation/env-variable-2.png 'Env Variable 3')

### 4. Use of Custom Commands

Custom commands in an automation framework help by creating reusable functions for common actions. They make tests clearer, easier to maintain, and more organized, allowing you to handle repetitive tasks, manage test data, and streamline complex workflows.

```jsx
Cypress.Commands.add('login', (username, password) => {
  cy.get('input[name="username"]').type(username)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
})

// Usage
cy.login('user123', 'pass123')
```

### 5. Use of .yml files

In Playwright, `.yml` files for GitHub Actions or other CI tools manage test workflows. They set up environments, run test scripts, and define conditions for test execution. This automation supports continuous integration by running tests on code changes and reporting results.

```yaml
name: Playwright Tests

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run Playwright tests
        run: npx playwright test
```

### 6. Use of Third Party Reporters like Allure

Allure reports provide detailed, interactive, and visually appealing test execution reports in various formats, helping testers and stakeholders easily analyze and understand test results.

![Report](/static/images/blogs/testing/playwright-best-practices-tips-and-techniques-for-effective-test-automation/report.png 'Report')

## Use of Assertion with Clarity

Assertions in Playwright are crucial for validating that web applications meet expected behaviors and conditions during tests. They check various elements, attributes, or states, ensuring that your application functions correctly. Assertions help confirm that elements are visible, text content matches expectations, or URLs and page titles are correct.
Write clear and straightforward tests to check if things are working as expected. Make sure your tests reflect what users would expect.

A few examples are listed below

```jsx
// Check if the h1 element contains the text "Welcome"
await expect(page.locator('h1')).toHaveText('Welcome')
// Check if the button is visible
await expect(page.locator('button#submit')).toBeVisible()
// Check if the input field is enabled
await expect(page.locator('input#username')).toBeEnabled()
// Check if the page URL is correct
await expect(page).toHaveURL('https://example.com/home')
// Check if the page title is "Home Page"
await expect(page).toHaveTitle('Home Page')
// Check if the link has the correct href attribute
await expect(page.locator('a#about')).toHaveAttribute('href', '/about')
// Check if the input value is "testUser"
await expect(page.locator('input#username')).toHaveValue('testUser')
// Check if there are exactly 3 items in the list
await expect(page.locator('ul#items > li')).toHaveCount(3)
// Wait for the element to be visible
await expect(page.locator('button#submit')).toBeVisible({ timeout: 5000 })
```

## Use of Proper Locators

For stable tests, target elements precisely. Prioritize unique IDs and class names. If those aren't available, use descriptive text content. For accessibility testing, leverage role selectors. Avoid complex XPaths and generic selectors like tags, as UI changes can break them. This keeps your tests reliable.

The most recommended Locator in Playwright is `Locate by test id` even if your text or role of the attribute changes the test will still pass

Ask your Developer to add test IDs as attributes to elements in the code

```html
<button data-testid="submit-button">Submit</button>
```

```jsx
// Clicks the button with the test ID "submit-button"
await page.getByTestId('submit-button').click()
```

## Use of APIs Mocking and Stubbing

When developing automated tests, there are situations where you need to simulate specific API responses or test features that are not yet implemented by the backend. In such cases, mocking and stubbing are essential techniques that help you create effective and reliable tests. Here’s a detailed overview of these techniques, their uses, and best practices

When these can be Implemented?

1. If you need to test how your application is going to behave when put on different API responses

```jsx
// Mocking response data
await page.route('https://example.com/api/data', (route) => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ key: 'mockedValue' }),
  })
})
```

1. When you want to test a feature which is under development or has not been implemented yet

```jsx
// Mocking error response
await page.route('https://example.com/api/unimplemented', (route) => {
  route.fulfill({
    status: 404,
    contentType: 'application/json',
    body: JSON.stringify({ error: 'Not Found' }),
  })
})
```

1. When you want to simulate slow network response or Total failure

```jsx
// Simulating a network failure
await page.route('https://example.com/api/data', (route) => {
  route.abort('failed')
})
```

## Handle Authentication and State

Playwright keeps your tests separate like having different browsers for each test. This prevents one test from messing with another (like a failed login). Tests can even start with a pre-logged-in state, skipping login steps and saving you time also Some websites remember your login or settings (like shopping carts). Playwright can help manage this in your tests by saving and reusing saved cookies with the help of Playwright's `setCookies` method

Below is an example of how to save and reuse cookies.

```jsx
const playwright = require('playwright')

;(async () => {
  // Launch a Chromium browser instance
  const browser = await playwright.chromium.launch()
  const context = await browser.newContext()

  // Login logic
  await context.goto('https://example.com/login')
  await context.fill('#username', 'your_username')
  await context.fill('#password', 'your_password')
  await context.click('#login-button')

  // Capture cookies
  const cookies = await context.cookies()

  // Save cookies (optional)
  const fs = require('fs')
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2))

  // Reuse cookies in another test
  const anotherContext = await browser.newContext()
  await anotherContext.addCookies(cookies)
  await anotherContext.goto('https://example.com')

  await browser.close()
})()
```

## Conclusion

Mastering Playwright for web automation can significantly elevate your testing strategy. You can achieve efficient and reliable automation by implementing best practices like the Page Object Model, leveraging `.json` files for data-driven testing, and utilizing `.env` files for secure environment management. Incorporating custom commands, mocking APIs, and maintaining proper locators further enhances test effectiveness. Embrace these techniques to streamline your testing process and build high-quality software.

**Stay updated with the latest Playwright features and best practices. The Playwright team constantly evolves the framework, offering new features and improvements. Utilize the official documentation.**

**Happy Learning!**

## References:

[https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)
