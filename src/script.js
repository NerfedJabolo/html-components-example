window.addEventListener('DOMContentLoaded', async () => {
  // Create a cache object to store fetched content promises.
  const cache = {};

  async function includeHTML(element) {
    // Get the 'data-include' attribute from the given 'element'.
    const file = element.getAttribute('data-include');

    // If not in cache, store the fetch promise
    if (!cache[file]) {
      cache[file] = fetch(file).then((response) => response.text());
    }

    // Await the cached promise
    const html = await cache[file];

    // Create a template element and set its HTML content to the fetched HTML.
    const template = document.createElement('template');
    template.innerHTML = html.trim();

    // Clone the content of the template.
    const content = template.content.cloneNode(true);

    // Get the parent element of the 'element'.
    const parentElement = element.parentElement;

    // Check if a parent element exists.
    if (parentElement) {
      // Get the content within the current 'element'.
      const componentContent = element.innerHTML.trim();

      // Find all elements with a 'data-content' attribute within the cloned content.
      const contentElements = content.querySelectorAll('[data-content]');

      // Create an array of promises to modify the content elements.
      const promises = Array.from(contentElements, (contentElement) => {
        return new Promise((resolve) => {
          // Determine the type of the content element (e.g., input, textarea).
          const elementType = contentElement.tagName.toLowerCase();

          // Set the content of the content element based on its type.
          contentElement[
            elementType === 'input' || elementType === 'textarea'
              ? 'value'
              : 'innerHTML'
          ] = componentContent;

          // Resolve the promise.
          resolve();
        });
      });

      // Wait for all promises to complete.
      await Promise.all(promises);

      // Create a document fragment to hold the cloned nodes.
      const fragment = document.createDocumentFragment();

      // Convert the cloned nodes to an array.
      const clonedNodes = Array.from(content.childNodes);

      // Append each cloned node to the fragment.
      clonedNodes.forEach((node) => fragment.appendChild(node));

      // Insert the fragment before the original 'element'.
      parentElement.insertBefore(fragment, element);

      // Remove the original 'element' from the DOM.
      element.remove();
    }

    // Serialize the inclusion of nested elements
    const nestedElements = Array.from(
      document.querySelectorAll('[data-include]')
    );
    for (const nestedElement of nestedElements) {
      await includeHTML(nestedElement);
    }
  }

  // Serialize the inclusion of elements
  const includeElements = Array.from(
    document.querySelectorAll('[data-include]')
  );
  for (const includeElement of includeElements) {
    await includeHTML(includeElement);
  }
});
