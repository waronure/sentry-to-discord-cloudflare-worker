🛠️ Sentry to Discord Cloudflare Worker

A lightweight, serverless "bridge" that forwards Sentry error alerts to Discord via Webhooks.

The Problem: Sentry's native Discord integration is locked behind their paid "Trial" or "Business" plans.
The Solution: This Cloudflare Worker allows users on Sentry's Free Tier to receive rich, detailed error notifications in Discord for $0.

✨ Features

Cost-Free: Get professional-grade alerts without a Sentry subscription.

Rich Embeds: Extracts deep context from the Sentry payload, including:

Error Title & Description (Culprit/Path)

Environment & Error Level

User IP & Geographical Location (Country)

Request Method & Browser/Client details

Visual Color Coding: Automatically maps Sentry error levels (Fatal, Error, Warning, etc.) to Discord embed colors.

High Performance: Runs on the Cloudflare Edge network for near-instant delivery.

🚀 Quick Start

1. Discord Setup

Go to your Discord Server settings.

Navigate to Integrations > Webhooks > New Webhook.

Copy the Webhook URL.

2. Cloudflare Worker Deployment

Log in to your Cloudflare Dashboard.

Create a new Worker.

Paste the contents of index.js (provided in this repo) into the Worker editor.

Replace YOUR_DISCORD_WEBHOOK_URL at the top of the script with the URL you copied in step 1.

Save and Deploy.

Copy the Worker URL (e.g., https://your-worker.your-subdomain.workers.dev).

3. Sentry Configuration

Go to your Sentry Project.

Navigate to Settings > Integrations > Webhooks.

Add your Worker URL as the Callback URL.

(Optional) Go to Alerts and create a rule to send notifications to "Webhooks".

📊 Payload Overview

The worker transforms raw Sentry JSON into a clean Discord embed. Here is what the data mapping looks like:

Field

Source

Title

event.exception or event.title

Color

Dynamic based on event.level

Author

Set to your Server name (default: "Octagon Uncle Server")

Fields

Environment, IP, Location, Method, and Browser name

🛠️ Local Development (Wrangler)

If you prefer using the CLI:

# Clone the repo
git clone [https://github.com/waronure/sentry-to-discord-cloudflare-worker.git](https://github.com/waronure/sentry-to-discord-cloudflare-worker.git)

# Install dependencies
npm install

# Deploy
npx wrangler deploy


🤝 Contributing

This project was born out of a personal need to maintain a high-quality dev environment while staying within a "free tier" budget. If you have ideas for better data mapping or more features, feel free to fork and submit a PR!

📄 License

MIT © Warona Mogolwane