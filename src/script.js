window.addEventListener('DOMContentLoaded', (event) => {
  function includeHTML(element) {
    const file = element.getAttribute('data-include');
    fetch(file)
      .then((response) => response.text())
      .then((html) => {
        const template = document.createElement('template');
        template.innerHTML = html.trim();

        const content = template.content.cloneNode(true);
        const parentElement = element.parentElement;

        if (parentElement) {
          const textAttribute = element.textContent.trim();
          const htmlContent = element.innerHTML.trim();

          const textElements = content.querySelectorAll('[data-text]');
          const htmlElements = content.querySelectorAll('[data-elements]');

          if (textElements.length > 0) {
            textElements.forEach((textElement) => {
              textElement.textContent = textAttribute;
            });
          }

          if (htmlElements.length > 0) {
            htmlElements.forEach((htmlElement) => {
              htmlElement.innerHTML = htmlContent;
            });
          }

          const fragment = document.createDocumentFragment();

          while (content.firstChild) {
            fragment.appendChild(content.firstChild);
          }

          parentElement.insertBefore(fragment, element);
          element.remove();
        }

        const nestedElements = document.querySelectorAll('[data-include]');
        nestedElements.forEach((nestedElement) => includeHTML(nestedElement));
      });
  }

  const includeElements = document.querySelectorAll('[data-include]');
  includeElements.forEach((element) => includeHTML(element));
});

