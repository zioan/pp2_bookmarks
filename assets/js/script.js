// Code that is executed after the document is loaded
document.addEventListener("DOMContentLoaded", function () {
  loadBookmarks(); // Load bookmarks from local storage
  renderBookmarks(); // Render bookmarks initially

  // Event listeners for the search functionality
  DOMCache.getElement("#btn-clear").addEventListener("click", clearSearchHandler);
  DOMCache.getElement("#bookmarks-search").addEventListener("input", renderBookmarks);

  // Event listener for new bookmark creation
  DOMCache.getElement("#btn-save").addEventListener("click", createNewBookmark);

  // Event listener for edit and delete handlers that open the modal
  DOMCache.getElement(".bookmark-list").addEventListener("click", handleBookmarkItemClick);

  // Event listener for confirm delete button
  DOMCache.getElement("#btn-confirm-delete").addEventListener("click", confirmDelete);

  // Event listener for closing modal
  DOMCache.getElement("#close-modal").addEventListener("click", closeModal);

  // Event listener for cancel delete button
  DOMCache.getElement("#btn-cancel-delete").addEventListener("click", closeModal);

  // Event listener to close the modal with the Escape key
  document.addEventListener("keydown", function (event) {
    // Listen for keydown events
    const modal = document.querySelector(".modal");
    // Check if Escape key is pressed
    if (modal && event.key === "Escape") {
      closeModal();
    }
  });

  // Prevent the overlay from closing if the click event is inside the modal
  DOMCache.getElement("#overlay").addEventListener("click", function (event) {
    // Check if the clicked element is not inside the modal
    if (!event.target.closest(".modal")) {
      closeModal();
    }
  });
});

/**
 * This global object stores DOM elements in a cache to minimize global variable pollution,
 * improve code maintainability, and reduce repetitive DOM queries.
 */
const DOMCache = {
  cache: {},

  /**
   * Retrieves a single DOM element by its selector.
   * If the element is already cached, returns the cached element.
   * Otherwise, queries the DOM, caches the element, and then returns it.
   *
   * @param {string} selector - The CSS selector of the element to retrieve.
   * @returns {Element|null} The DOM element matching the selector.
   */
  getElement: function (selector) {
    // Check if the element is already cached
    if (this.cache.hasOwnProperty(selector)) {
      return this.cache[selector];
    }

    // Query the DOM and cache the element if not already cached
    const element = document.querySelector(selector);
    this.cache[selector] = element;

    return element;
  },
};

/**
 * Handles click events on bookmark items, triggering actions based on the clicked element.
 * If the clicked element has a class of "bookmark-edit", opens the edit modal.
 * If the clicked element has a class of "bookmark-delete", opens the delete confirmation modal.
 *
 * @param {Event} event - The event object representing the click event.
 */
function handleBookmarkItemClick(event) {
  const target = event.target;
  if (target.classList.contains("bookmark-edit")) {
    editBookmark(event); // Open edit modal
  } else if (target.classList.contains("bookmark-delete")) {
    showDeleteConfirmation(event); // Open delete confirmation modal
  }
}

/**
 * Provides a set of demo data containing URLs and titles.
 *
 * @returns {Array<Object>} An array of objects, each containing a URL and a title.
 */
function demoData() {
  return [
    {
      url: "https://ioanzaharia.com/",
      title: "Ioan Zaharia personal portfolio",
    },
    {
      url: "https://caniuse.com/",
      title: "Browser compatibility",
    },
    {
      url: "https://www.google.com/",
      title: "Google",
    },
  ];
}

/**
 * Loads bookmarks from local storage.
 * On the first run or if the "bookmarks" entry in local storage is missing,
 * it initializes the local storage with demo data. If the user deletes all
 * bookmarks manually, the demo data will not be reloaded automatically.
 *
 * @returns {Array<Object>} An array of bookmark objects. Each object contains a URL and a title.
 */

function loadBookmarks() {
  const bookmarks = localStorage.getItem("bookmarks");

  // If the bookmarks object is not found in local storage, initialize with demo data
  if (!bookmarks) {
    localStorage.setItem("bookmarks", JSON.stringify(demoData()));
    return demoData();
  }

  // Parse and return the bookmarks from local storage
  return JSON.parse(bookmarks);
}

/**
 * Function to handle search input clearing state and button
 */
function clearSearchHandler() {
  const searchInput = DOMCache.getElement("#bookmarks-search");
  const clearBtn = DOMCache.getElement("#btn-clear");

  searchInput.value = "";
  searchInput.focus();
  clearBtn.style.display = "none";
  renderBookmarks();
}

/**
 * Generates the HTML markup for a bookmark item.
 *
 * @param {string} url - The URL of the bookmark.
 * @param {string} title - The title of the bookmark.
 * @returns {string} The HTML string representing the bookmark item.
 */
function bookmarkMarkup(url, title) {
  return `
    <li class="bookmark-item">
      <a class="bookmark-url" href="${url}" target="_blank" rel="noopener noreferrer">
        <i class="fa-solid fa-arrow-right"></i>
        ${title}
      </a>
      <div class="btn-group">
        <button aria-label="Edit bookmark">
          <i class="bookmark-edit fa-solid fa-pencil" data-url="${url}">
          </i>
          <span class="tooltip">Edit</span>
        </button>
        <button aria-label="Delete bookmark">
          <i class="bookmark-delete fa-solid fa-trash" data-url="${url}">
          </i>
          <span class="tooltip">Delete</span>
        </button>
      </div>
    </li>
  `;
}

/**
 * Renders the bookmarks list based on the current search query.
 * It loads bookmarks, filters them based on the search query, and updates the DOM accordingly.
 */
function renderBookmarks() {
  let bookmarks = loadBookmarks();
  const bookmarksSection = DOMCache.getElement(".bookmark-list");
  const bookmarksCount = DOMCache.getElement("#bookmarks-count");
  const searchQuery = DOMCache.getElement("#bookmarks-search").value.trim();
  const clearBtn = DOMCache.getElement("#btn-clear");
  const bookmarkList = [];

  // Filter bookmarks based on the search query
  bookmarks = filterBookmarks(searchQuery, bookmarks);

  if (searchQuery) {
    clearBtn.style.display = "block";
    bookmarksCount.style.display = "block";

    if (!bookmarks.length) {
      bookmarksCount.innerText = `No bookmarks found!`;
      bookmarksCount.className = "warning-color";
    } else if (bookmarks.length === 1) {
      bookmarksCount.innerText = `1 bookmark found`;
      bookmarksCount.className = "success-color";
    } else {
      bookmarksCount.innerText = `${bookmarks.length} bookmarks found`;
      bookmarksCount.className = "success-color";
    }
  } else {
    clearBtn.style.display = "none";
    bookmarksCount.style.display = "none";
  }

  // Generate the HTML markup for each bookmark
  for (let bookmark of bookmarks) {
    bookmarkList.push(bookmarkMarkup(bookmark.url, bookmark.title));
  }

  // Update the DOM with the generated bookmark list
  bookmarksSection.innerHTML = bookmarkList.join("");
}

/**
 * Filters bookmarks based on the search query.
 *
 * @param {string} searchQuery - The search query used to filter bookmarks.
 * @param {Array<Object>} bookmarks - The array of bookmark objects to filter.
 * @returns {Array<Object>} The filtered array of bookmark objects.
 */
function filterBookmarks(searchQuery, bookmarks) {
  if (!searchQuery) {
    return bookmarks;
  }

  const filteredBookmarks = [];

  for (let bookmark of bookmarks) {
    if (bookmark.title.toLowerCase().includes(searchQuery.trim().toLowerCase())) {
      filteredBookmarks.push(bookmark);
    }
  }

  return filteredBookmarks;
}

/**
 * Checks if a given URL is valid by attempting to create a new URL object from it.
 * A URL is considered valid if it has either the "http" or "https" protocol.
 * This function is used if the reportValidity API cannot validate the URL, as in the case of the Safari browser.
 * @param {string} url - The URL to validate.
 * @returns {boolean} True if the URL is valid, otherwise false.
 */
function isValidUrl(url) {
  try {
    const newUrl = new URL(url);
    return newUrl.protocol === "http:" || newUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
}

/**
 * Creates a new bookmark by extracting the URL and title from input fields,
 * validating them, and adding the new bookmark to the local storage and DOM.
 */
function createNewBookmark() {
  const bookmarksSection = DOMCache.getElement(".bookmark-list");
  const bookmarkUrl = DOMCache.getElement("#bookmark-url");
  const bookmarkTitle = DOMCache.getElement("#bookmark-title");

  const url = bookmarkUrl.value;
  const title = bookmarkTitle.value;

  // Perform initial validation on the fields. If validation fails, return early to prevent further processing.
  // The validateFields function handles the validation logic and provides appropriate feedback.
  if (!validateFields(bookmarkUrl, bookmarkTitle)) {
    return;
  }

  // Create a new bookmark object using object shorthand property syntax
  const newBookmark = {
    url,
    title,
  };

  // Retrieve existing bookmarks from local storage
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

  // Add the new bookmark to the existing bookmarks
  bookmarks.push(newBookmark);

  // Save the updated bookmarks to local storage
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  // Display the new bookmark in the bookmarks section
  bookmarksSection.innerHTML += bookmarkMarkup(url, title);

  // Clear input fields after creating the bookmark
  bookmarkUrl.value = "";
  bookmarkTitle.value = "";

  // Display success feedback to the user
  displaySuccessFeedback();
}

/**
 * Handles the editing of a bookmark by populating the edit form with the bookmark's data.
 *
 * @param {Event} event - The event object representing the click event.
 * @returns {void} Returns early if the bookmark URL is not found.
 */
function editBookmark(event) {
  const bookmarkUrl = event.target.dataset.url;
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  const editUrl = DOMCache.getElement("#edit-url");
  const editTitle = DOMCache.getElement("#edit-title");
  const modalTitle = DOMCache.getElement(".modal-title");

  // Find the index of the bookmark to edit
  const indexToEdit = bookmarks.findIndex((bookmark) => bookmark.url === bookmarkUrl);

  // If the bookmark URL is not found, return early
  if (indexToEdit === -1) {
    return;
  }

  // Extract the bookmark data to populate the edit form
  const bookmarkToUpdate = bookmarks[indexToEdit];
  editUrl.value = bookmarkToUpdate.url;
  editTitle.value = bookmarkToUpdate.title;

  // Add event listener to the update button
  DOMCache.getElement("#btn-update").addEventListener("click", function () {
    // Perform initial validation on the fields. If validation fails, return early to prevent further processing.
    // The validateFields function handles the validation logic and provides appropriate feedback.
    if (!validateFields(editUrl, editTitle)) {
      return;
    }

    // If all validations are successful, continue with the edit helper function
    editBookmarkHandler(bookmarks, indexToEdit, editUrl.value, editTitle.value);
  });

  // Open the edit modal
  const displayModalContent = "edit-content";
  modalTitle.innerText = `Editing: "${bookmarkToUpdate.title}"`;
  openModal(displayModalContent);
}

/**
 * Updates the bookmark at the specified index with the provided URL and title,
 * then updates the local storage, closes the modal, renders the updated bookmarks,
 * and displays success feedback to the user.
 *
 * @param {Array<Object>} bookmarks - The array of bookmark objects.
 * @param {number} index - The index of the bookmark to update.
 * @param {string} url - The updated URL of the bookmark.
 * @param {string} title - The updated title of the bookmark.
 */
function editBookmarkHandler(bookmarks, index, url, title) {
  // Create an updated bookmark object using object shorthand property syntax
  const updatedBookmark = {
    url,
    title,
  };

  // Update the bookmark at the specified index
  bookmarks[index] = updatedBookmark;

  // Update local storage with the modified bookmarks
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));

  // Close the modal
  closeModal();

  // Render the updated bookmarks
  renderBookmarks();

  // Display success feedback to the user
  displaySuccessFeedback();
}

/**
 * Displays a confirmation modal for deleting a bookmark.
 *
 * @param {Event} event - The event object representing the click event.
 */
function showDeleteConfirmation(event) {
  // Find the closest bookmark item element to the clicked button
  const bookmarkElement = event.target.closest(".bookmark-item");

  // Extract the URL and title of the bookmark to be deleted
  const bookmarkUrl = bookmarkElement.querySelector(".bookmark-delete").dataset.url;
  const bookmarkTitle = bookmarkElement.querySelector(".bookmark-url").textContent.trim();

  // Update the delete message in the confirmation modal
  const deleteMessage = DOMCache.getElement(".delete-message");
  deleteMessage.textContent = `Are you sure you want to delete "${bookmarkTitle}"?`;

  // Attach the URL of the bookmark to the confirm button as a dataset
  const confirmButton = DOMCache.getElement("#btn-confirm-delete");
  confirmButton.dataset.bookmarkUrl = bookmarkUrl;

  // Open the delete confirmation modal
  openModal("delete");
}

/**
 * Handles the deletion of a bookmark after confirmation.
 */
function confirmDelete() {
  // Retrieve the URL of the bookmark to delete from the confirm button's dataset
  const confirmButton = DOMCache.getElement("#btn-confirm-delete");
  const bookmarkUrl = confirmButton.dataset.bookmarkUrl;

  // Load bookmarks from local storage
  const bookmarks = loadBookmarks();

  // Find the index of the bookmark to delete
  const indexToDelete = bookmarks.findIndex((bookmark) => bookmark.url === bookmarkUrl);

  // If the bookmark is found, remove it from the array and update local storage
  if (indexToDelete !== -1) {
    bookmarks.splice(indexToDelete, 1);

    // Remove the corresponding bookmark element from the DOM
    const bookmarkElement = document.querySelector(`.bookmark-delete[data-url="${bookmarkUrl}"]`).closest(".bookmark-item");
    bookmarkElement.remove();

    // Update local storage with the modified bookmarks
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  } else {
    // If the bookmark is not found, log a warning message
    console.warn("Bookmark with URL", bookmarkUrl, "not found");
  }

  // Clean up the dataset and close the modal
  delete confirmButton.dataset.bookmarkUrl;
  closeModal();

  // Display success feedback to the user
  displaySuccessFeedback();
}

/**
 * Displays a success feedback message to the user and hides it after a certain duration.
 */
function displaySuccessFeedback() {
  // Get the element for displaying success feedback
  const successFeedback = DOMCache.getElement(".success-feedback");

  // Display the success feedback message
  successFeedback.style.display = "block";

  // Set a timeout to hide the success feedback after 1500 milliseconds (1.5 seconds)
  setTimeout(() => {
    successFeedback.style.display = "none";
  }, 1500);
}

/**
 * This function checks if the current browser is Safari and performs specific validations accordingly.
 * If the browser is Safari and either the URL is invalid or the title is empty, a warning message is displayed,
 * and the function returns false. For other browsers, it uses the `reportValidity` method to validate the fields.
 *
 * @param {HTMLInputElement} urlInputField - The input field element for the URL.
 * @param {HTMLInputElement} titleInputField - The input field element for the title.
 * @returns {boolean} - Returns true if both fields are valid, otherwise false.
 */
function validateFields(urlInputField, titleInputField) {
  const safariWarning = DOMCache.getElement(".safari-warning");

  // Check if the browser is safari (ua = userAgent)
  const ua = navigator.userAgent.toLowerCase();
  const isSafariBrowser = ua.includes("safari") && !ua.includes("chrome");

  // URL and title validation for Safari browser
  if (isSafariBrowser && (!isValidUrl(urlInputField.value) || titleInputField.value === "")) {
    safariWarning.style.display = "block";
    return false;
  }

  // URL and title validation for other browsers using the reportValidity API
  if (!urlInputField.reportValidity()) {
    return false;
  }

  if (!titleInputField.reportValidity()) {
    return false;
  }

  return true;
}

/**
 * Opens a modal with specified content (edit or delete confirmation).
 * @param {string} displayModalContent - The type of modal content to display.
 */
function openModal(displayModalContent) {
  // Get the modal element
  const modal = DOMCache.getElement("#overlay");

  // Display the modal
  modal.style.display = "flex";

  // Display specific modal content based on the provided type
  if (displayModalContent === "edit-content") {
    const editMarkup = DOMCache.getElement(".edit-content");
    editMarkup.style.display = "flex";
  }

  if (displayModalContent === "delete") {
    const deleteConfirmationContent = DOMCache.getElement(".delete-confirmation-content");
    deleteConfirmationContent.style.display = "block";
  }
}

/**
 * Hides the overlay and closes the modal, resetting its display state.
 */
function closeModal() {
  // Get the modal and specific modal content elements
  const modal = DOMCache.getElement("#overlay");
  const editContent = DOMCache.getElement(".edit-content");
  const deleteConfirmationContent = DOMCache.getElement(".delete-confirmation-content");
  const safariWarning = DOMCache.getElement(".safari-warning");

  // Hide the modal overlay and all modal content
  modal.style.display = "none";
  editContent.style.display = "none";
  deleteConfirmationContent.style.display = "none";

  // Reset the Safari warning display
  safariWarning.style.display = "none";
}
