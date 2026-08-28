(function () {
  const currentScript = document.currentScript || (function () {
    const scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  const slug = currentScript.getAttribute('data-business-slug') || 'maison-mirabelle';
  const botName = currentScript.getAttribute('data-bot-name') || 'Mira';
  const themeColor = currentScript.getAttribute('data-theme-color') || '#C9633A';
  const baseUrl = currentScript.src ? new URL(currentScript.src).origin : window.location.origin;

  // Create Container
  const container = document.createElement('div');
  container.id = 'convo-widget-root';
  container.style.position = 'fixed';
  container.style.bottom = '20px';
  container.style.right = '20px';
  container.style.zIndex = '999999';
  container.style.fontFamily = 'system-ui, -apple-system, sans-serif';

  // Create Launcher Button
  const launcher = document.createElement('button');
  launcher.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background-color: ${themeColor};
    color: white;
    border: none;
    border-radius: 9999px;
    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.25);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  `;
  launcher.innerHTML = `<span>💬 Ask ${botName}</span>`;

  launcher.onmouseenter = () => { launcher.style.transform = 'scale(1.05)'; };
  launcher.onmouseleave = () => { launcher.style.transform = 'scale(1)'; };

  // Create Iframe Modal / Drawer
  const iframeContainer = document.createElement('div');
  iframeContainer.style.cssText = `
    display: none;
    position: fixed;
    bottom: 80px;
    right: 20px;
    width: 380px;
    max-width: calc(100vw - 40px);
    height: 580px;
    max-height: calc(100vh - 100px);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
    border: 1px solid rgba(0,0,0,0.1);
    background: white;
    z-index: 999999;
  `;

  const iframe = document.createElement('iframe');
  iframe.src = `${baseUrl}/embed/${slug}`;
  iframe.style.cssText = 'width: 100%; height: 100%; border: none;';
  iframeContainer.appendChild(iframe);

  let isOpen = false;
  launcher.onclick = () => {
    isOpen = !isOpen;
    iframeContainer.style.display = isOpen ? 'block' : 'none';
    launcher.innerHTML = isOpen ? `<span>✕ Close</span>` : `<span>💬 Ask ${botName}</span>`;
  };

  container.appendChild(launcher);
  document.body.appendChild(iframeContainer);
  document.body.appendChild(container);
})();
