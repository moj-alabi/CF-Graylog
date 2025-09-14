addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const log = {
    version: "1.1",
    host: request.headers.get("host"),
    short_message: "Cloudflare Request",
    fields: {
      ip: request.headers.get("cf-connecting-ip"),
      ua: request.headers.get("user-agent"),
      path: new URL(request.url).pathname,
      bot_score: request.headers.get("cf-bot-score") || 0,
      threat_score: request.headers.get("cf-threat-score") || 0,
      country: request.headers.get("cf-ipcountry")
    }
  }

  // send to Graylog
  await fetch("https://logs.sheflabs.com:12201/gelf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(log)
  })

  // pass request to your origin
  return fetch(request)
}
