// Add an event listener to run the code when the DOM (Document Object Model) is fully loaded.
window.addEventListener('DOMContentLoaded', async () => {
  // Define an asynchronous function named 'includeHTML' which takes an 'element' parameter.
  async function includeHTML(element) {
    // Get the 'data-include' attribute from the given 'element'.
    const file = element.getAttribute('data-include');

    // Fetch the content of the file specified in the 'data-include' attribute.
    const response = await fetch(file);

    // Convert the fetched response to text.
    const html = await response.text();

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

    // Find nested elements with a 'data-include' attribute and include their content.
    const nestedElements = document.querySelectorAll('[data-include]');
    await Promise.all(Array.from(nestedElements, includeHTML));
  }

  // Find all elements with a 'data-include' attribute and include their content.
  const includeElements = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(includeElements, includeHTML));
});
