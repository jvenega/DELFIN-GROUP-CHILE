import { SubAppConfig } from "./subapp.config";

const iframePool = new Map();

export function getIframe(src, debug) {
  let iframe = iframePool.get(src);

  if (!iframe) {
    if (iframePool.size >= SubAppConfig.IFRAME_POOL_LIMIT) {
      const oldestKey = iframePool.keys().next().value;
      const oldIframe = iframePool.get(oldestKey);

      oldIframe?.remove();
      iframePool.delete(oldestKey);

      if (debug) console.info("♻️ iframe liberado:", oldestKey);
    }

    iframe = document.createElement("iframe");

    Object.assign(iframe, {
      src,
      className: "w-full h-full border-0",
      loading: "eager",
      referrerPolicy: "no-referrer"
    });

    iframe.sandbox =
      "allow-scripts allow-forms allow-same-origin allow-popups allow-modals";

    iframe.allow = "clipboard-read; clipboard-write; fullscreen";

    iframe.addEventListener("load", () => {
      if (debug) console.info("✅ iframe loaded:", src);
    });

    iframePool.set(src, iframe);

    if (debug) console.info("🆕 iframe creado:", src);
  }

  return iframe;
}