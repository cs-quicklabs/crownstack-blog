---
title: "Elevating Cypress Test Automation: A Guide to Seamless Integration with GitHub Actions and Slack"
date: '2024-01-19'
lastmod: '2024-01-19'
tags: ['qa','automation-testing','cypress']
draft: true
summary: "In this article we are going to discuss about how to create an automated report using Github Actions and share it on Slack in Cypress."
layout: PostSimple
images: []
authors: ['shashank-jaiswal']
---

# Elevating Cypress Test Automation: A Guide to Seamless Integration with GitHub Actions and Slack

## Introduction

The integration of GitHub Actions, Cypress codes, and Slack marks a significant advancement in our software development workflows. GitHub Actions efficiently coordinates Cypress tests with each code push, ensuring a robust continuous integration process. Notably, the incorporation of artifact capture, including screenshots and videos upon test failures, enhances our diagnostic capabilities and expedites issue resolution, facilitating quicker iterations.

The integration of Slack further enhances collaboration by seamlessly redirecting HTML test reports to a designated channel using webhooks. This collaborative integration transforms the testing process, fostering transparency and shared responsibility within development teams. The cohesive interplay of GitHub Actions, Cypress, and Slack establishes an empowering ecosystem, enabling teams to deliver high-quality software iteratively and efficiently, thereby solidifying a culture of continuous improvement.

## Automated HTML Report Collaboration for Seamless Test Insights

Follow the steps mentioned below to run your test script automatically upon every code push and effortlessly relay the generated report directly to your Slack group, regardless of the test outcome, whether it's a pass or fail.

- Inside your project, create a new folder named `".github"`.
- Inside the ".github" folder, create a new file. Name it with a ".yml" extension (for example, "build.yml").
- Open the newly created ".yml" file and copy-paste the below-provided code into it.

```yaml
name: Cypress Test
on: push
jobs:
  cypress-run:
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      # Install NPM dependencies, cache them correctly
      # and run all Cypress tests
      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          command: npx cypress run
          browser: chrome
      - name: Capturing Screenshots
        uses: actions/upload-artifact@v3
        # add the line below to store screenshots only on failures
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
          if-no-files-found: ignore # 'warn' or 'error' are also available, defaults to `warn`
      - name: Capturing Videos
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos
          if-no-files-found: ignore #
      - name: Project Test Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: On-Demand and Login HTML Report
          path: cypress/reports/html
      - name: Slack Notification
        if: always()
        uses: rtCamp/action-slack-notify@v2
        env:
          SLACK_COLOR: ${{ job.status }} # or a specific color like 'good' or '#ff00ff'
          SLACK_ICON: https://github.com/rtCamp.png?size=48
          SLACK_MESSAGE: "Project Automation Report https://github.com/User_Name/Project/actions/runs/${{github.run_id}}"
          SLACK_TITLE: Project Web Test
          # SLACK_USERNAME: rtCamp
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

- Save the changes you made to the ".yml" file.

Now, your project is set up to perform certain actions as defined below. Get ready to see the magic happen!

1. Run All Tests on each code Push
2. Create an HTML report of the Test
3. Upload HTML report to GitHub
4. Redirect HTML report to Slack channel
5. Take Screenshots and Video of Every test failure

## Let’s get an understanding of the above code

This workflow in GitHub Actions is activated when there are code pushes, and it performs Cypress tests on an Ubuntu 22.04 environment. The process commences with retrieving the most recent code from the repository, and then it proceeds to install and cache NPM dependencies. The key action, "Cypress run," supported by cypress-io/github-action@v6, coordinates the execution of all Cypress tests specifically in the Chrome browser. This setup is designed to enhance continuous integration, guaranteeing the automated and efficient validation of application functionality with each push

```yaml
name: Cypress Test
on: push
jobs:
  cypress-run:
    runs-on: ubuntu-22.04
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      # Install NPM dependencies, cache them correctly
      # and run all Cypress tests
      - name: Cypress run
        uses: cypress-io/github-action@v6
        with:
          command: npx cypress run
          browser: Chrome
```

This part of GitHub Actions called "Capturing Screenshots," uses a tool called actions/upload-artifact@v3 to save screenshots from Cypress tests. It's set up to run only when tests fail (if: failure()), ensuring it captures important information when something goes wrong. The name ("cypress-screenshots") and location ("cypress/screenshots") are specified to keep things organized. Additionally, the condition if-no-files-found: ignore makes sure that the workflow continues smoothly even if no screenshots are created, preventing any disruptions. This step is helpful for quickly resolving issues by providing visual clues about what went wrong during the software development process.

```yaml
- name: Capturing Screenshots
        uses: actions/upload-artifact@v3
        # add the line below to store screenshots only on failures
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
          if-no-files-found: ignore # 'warn' or 'error' are also available, defaults to `warn`
```

The "Capturing Videos" step in GitHub Actions saves videos from Cypress tests no matter what happens. It uses a tool called actions/upload-artifact@v3. The saved videos are named "cypress-videos" and kept in the "cypress/videos" place. This ensures we always have videos for detailed checking. Even if no videos are made, the process continues smoothly, thanks to a setting called if-no-files-found: ignore. This helps keep our workflow strong and makes it easier to solve problems during software testing.

```yaml
- name: Capturing Videos
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos
          if-no-files-found: ignore #
```

The "Project Test Report" step in GitHub Actions uses a tool called actions/upload-artifact@v3 to regularly upload the Cypress HTML report. It's set up to do this all the time, no matter what happens (configured with if: always()). This helps keep a constant record for thorough analysis

```yaml
- name: Project Test Report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: On-Demand and Login HTML Report
          path: cypress/reports/html
```

This code talks to Slack whenever your project does something. It always runs and uses a tool called rtCamp/action-slack-notify@v2. It decides how the Slack message looks - its color, icon, and content, which includes a link to your project's test report. The title says it's about the Project Web Test. The secret code (webhook) ensures a secure link between GitHub and Slack. In simple terms, it sends a quick update to your team every time your project does something important, making sure everyone knows what's happening.

```yaml
- name: Slack Notification
        if: always()
        uses: rtCamp/action-slack-notify@v2
        env:
          SLACK_COLOR: ${{ job.status }} # or a specific color like 'good' or '#ff00ff'
          SLACK_ICON: https://github.com/rtCamp.png?size=48
          SLACK_MESSAGE: "Project Automation Report https://github.com/User_Name/Project/actions/runs/${{github.run_id}}"
          SLACK_TITLE: Project Web Test
          # SLACK_USERNAME: rtCamp
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

## Configuring slack API app using webhook

Setting up a Slack app with webhooks is like having a chat between your GitHub code and your Slack team. Whenever your code changes, it automatically sends quick updates to your Slack channel. It's super handy because everyone stays in the loop about what's happening with your project. Whether tests pass or fail, your team gets instant notifications, making collaboration smoother. It's a fast and easy way to keep everyone on the same page and sort out any issues quickly. This simple connection between GitHub and Slack makes your project communication seamless and your team more efficient.

### **Follow Below Steps for the Configuration:**

1. Go to the Slack API page through the URL: [https://api.slack.com/](https://api.slack.com/) and click on your apps as mentioned in the Image.

![Slack API Homepage](/static/images/blogs/testing/cypress-automation-guide-to-integrate-with-github-action-and-slack/slack-homepage.png "Slack API Homepage")

2. Click on Create New App

![Slack New App Page](/static/images/blogs/testing/cypress-automation-guide-to-integrate-with-github-action-and-slack/slack-new-app-page.png "Slack New App Page")

3. Click on Create New App

![Slack Create App](/static/images/blogs/testing/cypress-automation-guide-to-integrate-with-github-action-and-slack/slak-create-app.png "Slack Create App")

4. Enter Your App Name (E.g. Web Automation Testing) and Select the Workspace where you want to Redirect your HTML Report

![Slack Create App Form - 1](/static/images/blogs/testing/cypress-automation-guide-to-integrate-with-github-action-and-slack/slack-create-app-form-1.png "Slack Create App Form - 1")

5. Click on the Create App Button

![Slack Create App Form - 2](/static/images/blogs/testing/cypress-automation-guide-to-integrate-with-github-action-and-slack/slack-create-app-form-2.png "Slack Create App Form - 2")

6. Click on Incoming Webhooks to generate a Webhook for Notification

![Slack Incoming Webhook](/static/images/blogs/testing/cypress-automation-guide-to-integrate-with-github-action-and-slack/slack-incoming-webhook.png "Slack Incoming Webhook")

7. Activate Incoming Webhooks by clicking on the Radio Button

![Slack Activate Incoming Webhook](/static/images/blogs/testing/cypress-automation-guide-to-integrate-with-github-action-and-slack/slack-activate-incoming-webhook.png "Slack Activate Incoming Webhook")

8. As soon as you Activate incoming Webhooks you will get a button as “Add new Webhook to Workspace” click on it.

![Slack Add Webhook](/static/images/blogs/testing/cypress-automation-guide-to-integrate-with-github-action-and-slack/slack-add-webhook.png "Slack Add Webhook")

9. Select the Slack Channel you want your HTML reports to be Redirected to

![Slack Add Channel](/static/images/blogs/testing/cypress-automation-guide-to-integrate-with-github-action-and-slack/slack-add-channel.png "Slack Add Channel")

10. As soon as You Select your channel your Webhook will be generated and ready to be used, So copy that webhook

![Slack Add Webhook URL](public/static/images/blogs/testing/cypress-automation-guide-to-integrate-with-github-action-and-slack/slack-add-webhook-url.png "Slack Add Webhook URL")

11. Now your webhook is ready to be used in your GitHub, so follow the steps below to get the webhook configuration done
- Go to GitHub and Click on Setting
- Scroll down to find Secrets and Variables
- Select Actions from “Secrets and Variables “ Drop-down
- Click on New Repository Secret
- In the Name field paste “SLACK_WEBHOOK”
- In the Secret field Paste the Webhook URL you generated earlier from Slack API

## Conclusion

Combining Cypress test automation with GitHub Actions and Slack makes software testing smoother by automating it whenever we update the code. GitHub Actions keeps things consistent, and capturing screenshots and videos helps us quickly solve problems. With Slack in the mix, our team can communicate in real time, and important reports go straight to a specific Slack channel. This teamwork creates a friendly environment, making everyone responsible and clear about what's happening in the development teams. In the end, it helps us deliver top-notch software in a quick and efficient way.