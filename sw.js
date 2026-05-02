const CACHE_NAME = "oliveira-otm-v2"; // Mudamos o nome para v2 para forçar a atualização
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/manifest.webmanifest",
  "/icon.svg",
  "/Oliveira_OTM_Assinado.mobileconfig"
];

// Instalação: Guarda os ficheiros novos no cache
self.addEventListener("install", (event) => {
  self.skipWaiting(); // Força o novo Service Worker a ativar imediatamente
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Ativação: Elimina o cache antigo (v1) para não haver conflitos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // Assume o controlo das abas abertas imediatamente
});

// Busca de ficheiros: Tenta a rede primeiro, se falhar usa o cache
// Isso garante que as atualizações do Vercel apareçam mais rápido
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
