/* Guarda o RK Transportes no aparelho para funcionar sem internet. */
const VERSAO = "rk-transportes-v1";
const ARQUIVOS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icone-192.png",
  "icone-512.png",
  "lib/jspdf.plugin.autotable.min.js",
  "lib/jspdf.umd.min.js",
  "lib/pdf.min.js",
  "lib/pdf.worker.min.js",
  "fontes/Archivo-500.woff2",
  "fontes/Archivo-600.woff2",
  "fontes/Archivo-700.woff2",
  "fontes/IBMPlexMono-500.woff2",
  "fontes/IBMPlexMono-600.woff2",
  "fontes/IBMPlexSans-400.woff2",
  "fontes/IBMPlexSans-500.woff2",
  "fontes/IBMPlexSans-600.woff2"
];

self.addEventListener("install", evento => {
  evento.waitUntil(
    caches.open(VERSAO)
      .then(cache => cache.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", evento => {
  evento.waitUntil(
    caches.keys()
      .then(nomes => Promise.all(nomes.filter(n => n !== VERSAO).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", evento => {
  const pedido = evento.request;
  if(pedido.method !== "GET" || !pedido.url.startsWith(self.location.origin)) return;
  evento.respondWith(
    caches.match(pedido, { ignoreSearch: true }).then(guardado => {
      if(guardado) return guardado;
      return fetch(pedido).catch(() => {
        if(pedido.mode === "navigate") return caches.match("index.html");
        return new Response("", { status: 504 });
      });
    })
  );
});
