// This site has no service worker. Browsers that still run one registered at this origin by
// another app (e.g. a previous project on localhost:3000) fetch /sw.js to update it; this
// replacement removes itself and reloads open tabs so they are no longer intercepted.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) client.navigate(client.url);
    })(),
  );
});
