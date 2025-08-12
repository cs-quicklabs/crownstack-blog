---
title: 'A Step-by-Step Guide to Email Testing with "Mailosaur and Playwright" a little catch'
date: '2025-08-12'
lastmod: '2025-08-12'
tags: ['qa', 'guide', 'playwright']
draft: false
summary: 'This is guide to follow best Practices for Email Testing using Mailasuar'
layout: PostSimple
images: []
authors: ['divanshu-gupta']
---

Email testing is crucial for modern web applications, especially when validating functionalities like signups, password resets, and email notifications. Tools like Mailosaur help make email testing easier by providing email addresses that can receive and store emails during your automated tests. In this blog, I will show you how to integrate the **Mailosaur API** with **Playwright**

### Prerequisites

Before diving into the integration steps, ensure you have the following:

1. **Node.js** installed on your machine.
2. **Playwright** installed in your project.
3. A **Mailosaur account**. Sign up [**Here**](https://mailosaur.com/) and get your API key and server ID.

### **Setup Playwright Configuration**

If Playwright is not set up yet, initialize it by running:

```bash
npm install playwright
```

### Step 1: Obtain Your Mailosaur API Key

Before you can start testing emails, you need an API key from Mailosaur. This key allows your tests to communicate with Mailosaur’s service to retrieve and validate emails. Here's how to get your API key:

1. **Log into your Mailosaur account**: If you don’t have an account, sign up at [Mailosaur](https://mailosaur.com/).
2. **Navigate to the Account Settings**: Once logged in, head to the [API Keys section](https://mailosaur.com/app/account/keys) under your account settings.
3. **Copy your API Key**: This key will be used to authenticate your API requests within your test code.

### Step 2: Set Up the Mailosaur Client in Your Test Framework

Now that you have your API key, the next step is to integrate Mailosaur with your test framework. For this example, we’ll use Node.js-based test frameworks like **Playwright** or **Cypress**, but the concept is similar across various frameworks.

### 1. Install the Mailosaur Client Library

If you're using Node.js (common in most modern test automation setups), you need to install Mailosaur’s official client library. Open your terminal and run:

```bash
npm install mailosaur
```

### 2. Import and Configure Mailosaur in Your Tests

With Mailosaur installed, you can now import it into your test files and configure the API key and server ID (your inbox for testing emails).

Here’s how you would set this up in a Playwright test:

```javascript
const { test, expect } = require("@playwright/test");
const MailosaurClient = require("mailosaur");

const MAILOSAUR_API_KEY = "Mailasaur_API_KEY";
const SERVER_ID = "Server-ID";
const mailosaur = new MailosaurClient("Mailasaur_API_KEY");

exports.ForgotPassword = class ForgotPassword {
  constructor(page) {
    this.page = page;
    this.forgotPasswordLink = this.page.locator("#forget-password");
    this.emailInput = 'input[id="email"]';
    this.recaptcha = ".recaptcha-checkbox-border";
  }

  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
    await expect(this.page.locator("text=Forgot your password?")).toBeVisible();
  }

  async fillEmail(email) {
    const emailField = this.page.locator(this.emailInput);
    await emailField.fill(email);
    await this.page.getByText("Request Password Reset Instructions").click();
  }

  async getResetLink() {
    const email = await mailosaur.messages.get(SERVER_ID, {
      sentTo: `soap-steel@ef6rs3pi.mailosaur.net`,
    });

    const resetLink = email.html.links[0].href;
    return resetLink;
  }

  async waitForEmail(email, maxRetries = 10, retryDelay = 5000) {
    let emailMessage;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const email = await mailosaur.messages.list(SERVER_ID, {
          sentTo: `soap-steel@ef6rs3pi.mailosaur.net`,
          sort: "desc",
          limit: 1,
        });

        if (emails.items.length > 0) {
          emailMessage = emails.items[0];
          return emailMessage;
        }
      } catch (error) {
        console.log(`Retrying... (${i + 1}/${maxRetries})`);
        await this.page.waitForTimeout(retryDelay);
      }
    }

    throw new Error("Failed to retrieve the latest email.");
  }

  async resetPassword(resetLink) {
    await this.page.goto(resetLink);
    await this.page.locator("#password").fill("Divanshu@1234");
    await this.page.locator("#confirm-password").fill("Divanshu@1234");
    await this.page.getByText("Set Password").click();
  }
  async refreshMail() {
    await mailosaur.messages.deleteAll(SERVER_ID);
  }
};
```

Now Just call Your Function in spec file:

```javascript
import { ForgotPassword } from "../e2e/forgotPassword";
import { test, expect } from "@playwright/test";

test("Verify user able reset password", async ({ page }) => {
  await page.goto("/");
  const email = `soap-steel@ef6rs3pi.mailosaur.net`;
  const forgotPassword = new ForgotPassword(page);

  await forgotPassword.clickForgotPassword();
  await forgotPassword.fillEmail(email);

  await forgotPassword.refreshMail();
  const resetLink = await forgotPassword.getResetLink();

  await forgotPassword.resetPassword(resetLink);
  await forgotPassword.refreshMail();

  await expect(page.locator("text=Password reset successful")).toBeVisible();
});

```

### Step 3: Verify Email Content

With Mailosaur integrated into your test framework, you can now automate the process of verifying email content. This is particularly useful for flows like password resets or user registration, where you need to ensure the email content is correct, and the included links work as expected.

For example, if you are testing a password reset flow:

- Trigger a password reset in your application.
- Use Mailosaur to check that the reset email was received.
- Assert the subject, body content, or any specific text to ensure correctness.
- Extract and use the reset link from the email to complete the workflow in your test.

### Comparing Mailosaur with Other Email Testing Tools

There are several other email testing services available, and it's essential to understand how Mailosaur compares to them:

### 1. **Mailosaur vs. Mailtrap**

- **Mailosaur**: Provides disposable email addresses that can be used to test emails in real-time, with API access to verify email content, extract links, and attachments.
- **Mailtrap**: Similar to Mailosaur, but it's primarily used for staging environments. Mailtrap focuses more on email sandboxing to ensure emails don’t go out to real users during development.

**Key Difference**: Mailosaur is better suited for real-time, automated email testing during end-to-end tests. Mailtrap is often used for capturing email during development or testing environments.

### 2. **Mailosaur vs. SendGrid’s Email Testing**

- **Mailosaur**: Offers a clean and simple API with dedicated inboxes for automated testing.
- **SendGrid**: More geared towards transactional email services, but it also offers an email testing feature in some plans, allowing developers to preview email content before sending.

**Key Difference**: SendGrid is primarily for sending real emails to actual users, while Mailosaur is specialized for automated testing with temporary email addresses.

### 3. **Mailosaur vs. Ethereal Email**

- **Mailosaur**: Provides an intuitive UI and a rich API for managing email testing in your automation frameworks.
- **Ethereal Email**: A free and open-source email testing service that allows you to create fake SMTP accounts for testing.

**Key Difference**: While Ethereal is great for small projects or initial development, Mailosaur offers more robust, enterprise-level features with professional support.

### Why Use Mailosaur for Email Testing?

Automating email-driven flows manually can be cumbersome and error-prone. Mailosaur simplifies this process by:

- **Centralizing Test Emails**: All test emails are stored in a controlled environment, making them easy to retrieve and verify.
- **Providing Email APIs**: You can interact with emails programmatically, ensuring that they were delivered, and checking their contents in real-time.
- **Streamlining Verification Workflows**: Whether it’s verifying a password reset link or ensuring a welcome email was sent, Mailosaur makes email verification seamless.

By integrating Mailosaur into your automated tests, you can ensure the reliability of email-based workflows, reducing manual checks and boosting the effectiveness of your automated test suite.

### Tools Compatible with Mailosaur API

The **Mailosaur API** can be integrated with a wide range of automation tools and testing frameworks, making it an ideal choice for automating email validation. Here’s a list of some commonly used tools that work seamlessly with Mailosaur:

| **Playwright** | **Cypress** |
| --- | --- |
| **Selenium** | **Selenium** |
| **TestCafe** | **Postman/Newman** |