window.addEventListener('DOMContentLoaded', async () => {
  async function includeHTML(element) {
    const file = element.getAttribute('data-include');
    const response = await fetch(file);
    const html = await response.text();

    const template = document.createElement('template');
    template.innerHTML = html.trim();

    const content = template.content.cloneNode(true);
    const parentElement = element.parentElement;

    if (parentElement) {
      const componentContent = element.innerHTML.trim();

      const contentElements = content.querySelectorAll('[data-content]');
      const promises = Array.from(contentElements, (contentElement) => {
        return new Promise((resolve) => {
          const elementType = contentElement.tagName.toLowerCase();
          contentElement[
            elementType === 'input' || elementType === 'textarea'
              ? 'value'
              : 'innerHTML'
          ] = componentContent;
          resolve();
        });
      });

      await Promise.all(promises);

      const fragment = document.createDocumentFragment();
      const clonedNodes = Array.from(content.childNodes);

      clonedNodes.forEach((node) => fragment.appendChild(node));

      parentElement.insertBefore(fragment, element);
      element.remove();
    }

    const nestedElements = document.querySelectorAll('[data-include]');
    await Promise.all(Array.from(nestedElements, includeHTML));
  }

  const includeElements = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(includeElements, includeHTML));
});
