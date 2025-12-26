const DISCORD_WEBHOOK_URL = "YOUR_DISCORD_WEBHOOK_URL";

export default {
  async fetch(request) {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      const sentryBody = await request.json();

      // Basic validation
      if (!sentryBody || !sentryBody.data || !sentryBody.data.event) {
        return new Response("Invalid Sentry Payload", { status: 400 });
      }

      // Extracting data based on your specific JSON structure
      const event = sentryBody.data.event;
      const exception = event.exception?.values?.[0] || {};
      const requestData = event.request || {};
      
      // Determine the error message (Title)
      const errorTitle = exception.value || event.title || "Unknown Error";
      
      // Determine the description (Culprit/Path)
      const errorDescription = event.culprit || requestData.url || "No specific path identified";

      // Map Sentry "Level" to Decimal Colors
      const colors = {
        fatal: 15548997, // Red
        error: 15158332, // Light Red
        warning: 16776960, // Yellow
        info: 3447003,   // Blue
        debug: 9807270   // Gray
      };

      // Discord Payload
      const discordPayload = {
        "username": "Sentry",
        "avatar_url": "https://raw.githubusercontent.com/getsentry/sentry/master/src/sentry/static/sentry/images/sentry-glyph-black.png",
        "content": "", 
        "embeds": [
          {
            "title": errorTitle, 
            "description": `**Endpoint:** \`${errorDescription}\``,
            "url": event.web_url || "https://sentry.io",
            "color": colors[event.level] || 15158332,
            "author": {
              "name": "Octagon Uncle Server",
              "url": "https://sentry.io",
              "icon_url": "https://raw.githubusercontent.com/getsentry/sentry/master/src/sentry/static/sentry/images/sentry-glyph-black.png"
            },
            "thumbnail": {
               "url": "https://raw.githubusercontent.com/getsentry/sentry/master/src/sentry/static/sentry/images/sentry-glyph-black.png"
            },
            "fields": [
              {
                "name": "Environment",
                "value": (event.environment || "Production").toUpperCase(),
                "inline": true
              },
              {
                "name": "Level",
                "value": (event.level || "error").toUpperCase(),
                "inline": true
              },
              {
                "name": "User IP / Location",
                "value": `${event.user?.ip_address || "Unknown"} (${event.user?.geo?.country_code || "N/A"})`,
                "inline": true
              },
              {
                "name": "Method",
                "value": requestData.method || "N/A",
                "inline": true
              },
               {
                "name": "Browser/Client",
                "value": event.contexts?.browser?.name || "Unknown Client",
                "inline": true
              }
            ],
            "footer": {
              "text": sentryBody.data.triggered_rule || "Sentry Alert",
              "icon_url": "https://raw.githubusercontent.com/getsentry/sentry/master/src/sentry/static/sentry/images/sentry-glyph-black.png"
            },
            "timestamp": event.datetime || new Date().toISOString()
          }
        ]
      };

      // Send to Discord
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(discordPayload)
      });

      if (response.ok) {
        return new Response("Forwarded to Discord", { status: 200 });
      } else {
        const text = await response.text();
        return new Response(`Discord Error: ${text}`, { status: response.status });
      }

    } catch (err) {
      console.error(err);
      return new Response(`Worker Error: ${err.message}`, { status: 500 });
    }
  }
};
