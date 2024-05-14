/**
 * This global object stores DOM elements in the cache.
 * The reason for this approach is to minimize the pollution caused 
 * by global variables and to keep the code maintainable and as short 
 * as possible by reducing repetitive code to retrieve DOM elements.
 */
const DOMCache = {
  cache: {},
  getElement: function (selector) {

    // Check if the element is already cached
    if (this.cache.hasOwnProperty(selector)) {
      return this.cache[selector];
    }

    // Query the DOM and cache the element if not already cached
    const element = document.querySelector(selector);
    this.cache[selector] = element;

    console.log("DOMCache:", this.cache)

    return element;
  }
};