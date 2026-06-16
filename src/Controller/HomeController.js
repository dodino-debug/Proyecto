// DOVI S.A.S. - Controllers: HomeController
// Coordinates static form simulations (contact and newsletter subscription).

(function() {
  "use strict";

  class HomeController {
    // Initializes contact form event listener
    static initContact() {
      const contactForm = document.getElementById("contact-form-mock");
      if (contactForm && !contactForm.dataset.initialized) {
        contactForm.dataset.initialized = "true";
        contactForm.addEventListener("submit", function(e) {
          e.preventDefault();
          const loading = document.getElementById("contact-loading");
          const sent = document.getElementById("contact-sent");
          const error = document.getElementById("contact-error");

          if (loading) loading.classList.add("d-block");
          if (sent) sent.classList.add("d-none");
          if (error) error.classList.add("d-none");

          setTimeout(() => {
            if (loading) loading.classList.remove("d-block");
            if (sent) sent.classList.remove("d-none");
            contactForm.reset();
          }, 1000);
        });
      }
    }

    // Initializes newsletter form event listener
    static initNewsletter() {
      const newsletterForm = document.getElementById("newsletter-form-mock");
      if (newsletterForm && !newsletterForm.dataset.initialized) {
        newsletterForm.dataset.initialized = "true";
        newsletterForm.addEventListener("submit", function(e) {
          e.preventDefault();
          const sent = document.getElementById("newsletter-sent");
          if (sent) sent.classList.remove("display-none");
          
          setTimeout(() => {
            if (sent) sent.classList.add("display-none");
            newsletterForm.reset();
          }, 3000);
        });
      }
    }
  }

  // Expose to global window scope
  window.HomeController = HomeController;

})();
