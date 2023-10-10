window.addEventListener('DOMContentLoaded', async () => {
  const cache = {};

  async function includeHTML(elements) {
    const promises = elements.map(async (element) => {
      const file = element.getAttribute('data-include');
      if (!cache[file]) {
        cache[file] = fetch(file).then((response) => response.text());
      }

      const html = await cache[file];
      const template = document.createElement('template');
      template.innerHTML = html.trim();

      if (element.parentElement) {
        const componentContent = element.innerHTML.trim();
        const contentElements =
          template.content.querySelectorAll('[data-content]');
        contentElements.forEach((contentElement) => {
          const elementType = contentElement.tagName.toLowerCase();
          contentElement[
            elementType === 'input' || elementType === 'textarea'
              ? 'value'
              : 'innerHTML'
          ] = componentContent;
        });

        const fragment = document.createDocumentFragment();
        fragment.appendChild(template.content);
        element.parentElement.insertBefore(fragment, element);
        element.remove();
      }
    });

    await Promise.all(promises);
  }

  let elementsToInclude = Array.from(
    document.querySelectorAll('[data-include]')
  );
  while (elementsToInclude.length > 0) {
    await includeHTML(elementsToInclude);
    elementsToInclude = Array.from(document.querySelectorAll('[data-include]'));
  }
});
