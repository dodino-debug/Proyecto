// DOVI S.A.S. - Views: FooterView
// Manages dynamic loading and rendering of the page footer, preloader, and scroll-to-top buttons.

(function() {
  "use strict";

  class FooterView {
    static async renderFooter() {
      const basePath = document.documentElement.getAttribute('data-base-path') || './';

      // 1. Standard Footer
      const footerElement = document.querySelector("#footer");
      if (footerElement) {
        try {
          const response = await fetch(`${basePath}src/views/components/footer.html`);
          if (!response.ok) {
            throw new Error(`Failed to fetch footer: ${response.statusText}`);
          }
          let html = await response.text();
          // Replace all path placeholders
          html = html.replace(/\{\{BASE_PATH\}\}/g, basePath);
          footerElement.innerHTML = html;

          // Auto-inject common layout elements if not present in the HTML
          this.injectLayoutElements();

          // Bind newsletter submit events using HomeController simulation
          if (window.HomeController) {
            window.HomeController.initNewsletter();
          }
        } catch (error) {
          console.error("FooterView Render Error:", error);
        }
      }

      // 2. Auth Footer
      const authFooterElement = document.querySelector("#auth-footer");
      if (authFooterElement) {
        try {
          const response = await fetch(`${basePath}src/views/components/auth_footer.html`);
          if (!response.ok) {
            throw new Error(`Failed to fetch auth footer: ${response.statusText}`);
          }
          let html = await response.text();
          html = html.replace(/\{\{BASE_PATH\}\}/g, basePath);
          authFooterElement.innerHTML = html;
        } catch (error) {
          console.error("AuthFooterView Render Error:", error);
        }
      }
    }

    static injectLayoutElements() {
      // 1. Inject Scroll-Top button
      if (!document.getElementById("scroll-top")) {
        const scrollTop = document.createElement("a");
        scrollTop.href = "#";
        scrollTop.id = "scroll-top";
        scrollTop.className = "scroll-top d-flex align-items-center justify-content-center";
        scrollTop.innerHTML = '<i class="bi bi-arrow-up-short"></i>';
        document.body.appendChild(scrollTop);
      }

      // 2. Inject Preloader container
      if (!document.getElementById("preloader")) {
        const preloader = document.createElement("div");
        preloader.id = "preloader";
        document.body.appendChild(preloader);
      }
    }
  }

  // Expose to global window scope
  window.FooterView = FooterView;

})();
