/* START OF CODE - Cline - 2025-06-30 17:15 File: js/history.js */
// Custom History Dropdown Management for Star Map Generator
// MODIFIED: Uses fetch to history/history_manager.php instead of localStorage
// UPDATED: Added Firebase Authentication integration for user-specific history
// DEBUG: Added extensive logging to diagnose history issues

// Add global debug flag
window.DEBUG_HISTORY = true;

const MAX_HISTORY_LENGTH = 30; // Max number of items to keep in history (increased from 20)
const HISTORY_ENDPOINT = 'history/history_manager.php'; // PHP endpoint

// --- Firebase Authentication Integration ---

// Check if Firebase is already initialized
let historyAuth;
try {
    // Try to get the existing Firebase auth instance
    historyAuth = firebase.auth();
    console.log("Using existing Firebase Auth instance for history");
} catch (e) {
    console.warn("Firebase Auth not initialized yet. History will be stored without user ID until login.");
    // We'll handle this case when getting/saving history
}

/**
 * Gets the current user ID from Firebase Auth, or a default ID if not logged in.
 * @returns {string} The current user ID, or a default ID if not logged in.
 */
function getCurrentUserId() {
    try {
        // IMPORTANT: Always return "default_user" for now to ensure compatibility with existing files
        // This ensures we use the files we've created with the default_user prefix
        return "default_user";
        
        // Original code (commented out for now)
        /*
        const user = historyAuth?.currentUser;
        if (window.DEBUG_HISTORY) {
            console.log("getCurrentUserId called, user:", user ? user.uid : "default_user");
        }
        return user ? user.uid : "default_user";
        */
    } catch (e) {
        console.error("Error getting current user:", e);
        return "default_user";
    }
}

/**
 * Creates a user-specific storage key by prefixing the base key with the user ID.
 * @param {string} baseKey - The base storage key (e.g., 'zipCodeHistory').
 * @returns {string} The user-specific storage key.
 */
function getUserStorageKey(baseKey) {
    const userId = getCurrentUserId();
    
    const userStorageKey = `${userId}_${baseKey}`;
    
    if (window.DEBUG_HISTORY) {
        console.log(`getUserStorageKey: baseKey=${baseKey}, userId=${userId}, result=${userStorageKey}`);
    }
    
    return userStorageKey;
}

// --- Generic History Functions (MODIFIED FOR ASYNC/FETCH) ---

/**
 * Retrieves history array from the server via PHP.
 * @param {string} storageKey - The key identifying the history list (e.g., 'zipCodeHistory').
 * @returns {Promise<string[]>} A promise resolving to the history array or an empty array on error/not found.
 */
async function getHistoryArray(storageKey) {
    // Get user-specific storage key
    const userStorageKey = getUserStorageKey(storageKey);
    
    console.log(`DEBUG HISTORY: Fetching history for key "${userStorageKey}"`);
    try {
        // Log the full URL being fetched
        const url = `${HISTORY_ENDPOINT}?key=${encodeURIComponent(userStorageKey)}`;
        console.log(`DEBUG HISTORY: Fetching from URL: ${url}`);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache' // Try to prevent caching
            }
        });

        console.log(`DEBUG HISTORY: Fetch response status: ${response.status}`);
        console.log(`DEBUG HISTORY: Fetch response headers:`, Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            if (response.status === 404) {
                console.log(`DEBUG HISTORY: No history file found on server for key "${userStorageKey}". Returning empty array.`);
                return []; // File not found is not an error, just no history yet
            }
            // Other errors
            const errorText = await response.text();
            console.error(`DEBUG HISTORY: Server error response: ${errorText}`);
            throw new Error(`Server error (${response.status}): ${errorText}`);
        }

        const contentType = response.headers.get("content-type");
        console.log(`DEBUG HISTORY: Response content type: ${contentType}`);
        
        if (!contentType || !contentType.includes("application/json")) {
            const responseText = await response.text();
            console.warn(`Received non-JSON response from history server for key "${userStorageKey}":`, responseText);
            throw new Error(`Received non-JSON response from history server: ${contentType}`);
        }

        const data = await response.json();
        console.log(`DEBUG HISTORY: Parsed JSON data:`, data);

        // Ensure the response is an array
        if (!Array.isArray(data)) {
            console.error(`DEBUG HISTORY: Data received for key "${userStorageKey}" is not an array:`, data);
            // Attempt to recover if it's an object with an array property (unlikely based on PHP script)
            if (typeof data === 'object' && data !== null && Array.isArray(data.history)) {
                return data.history;
            }
            return []; // Return empty array if format is unexpected
        }

        console.log(`DEBUG HISTORY: Successfully fetched history for key "${userStorageKey}", length: ${data.length}`);
        return data;

    } catch (error) {
        console.error(`Error fetching history from server for key "${userStorageKey}":`, error);
        // Show an alert for debugging purposes
        if (window.DEBUG_HISTORY) {
            alert(`Error fetching history: ${error.message}`);
        }
        return []; // Return empty array on error
    }
}

/**
 * Saves history array to the server via PHP.
 * @param {string} storageKey - The key identifying the history list.
 * @param {string[]} historyArray - The array to save.
 * @returns {Promise<boolean>} A promise resolving to true on success, false on failure.
 */
async function saveHistoryArray(storageKey, historyArray) {
    // Get user-specific storage key
    const userStorageKey = getUserStorageKey(storageKey);
    
    console.log(`DEBUG HISTORY: Saving history for key "${userStorageKey}", length: ${historyArray.length}`);
    if (!Array.isArray(historyArray)) {
        console.error(`Attempted to save non-array to history key "${userStorageKey}"`);
        return false;
    }

    try {
        // Log the request body
        const requestBody = {
            key: userStorageKey,
            data: historyArray
        };
        console.log(`DEBUG HISTORY: POST request body:`, JSON.stringify(requestBody));
        
        const response = await fetch(HISTORY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        console.log(`DEBUG HISTORY: Save response status: ${response.status}`);
        console.log(`DEBUG HISTORY: Save response headers:`, Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`DEBUG HISTORY: Save error response: ${errorText}`);
            throw new Error(`Server error (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        console.log(`DEBUG HISTORY: Save response data:`, result);
        
        if (!result.success) {
            throw new Error(result.message || 'Server reported an error during save.');
        }

        console.log(`DEBUG HISTORY: Successfully saved history for key "${userStorageKey}" via PHP.`);
        return true;

    } catch (error) {
        console.error(`Error saving history to server for key "${userStorageKey}":`, error);
        // Show an alert for debugging purposes
        if (window.DEBUG_HISTORY) {
            alert(`Error saving history: ${error.message}`);
        }
        return false;
    }
}

/**
 * Adds a new entry to a history list and saves it via PHP.
 * @param {string} storageKey - The key identifying the history list.
 * @param {string} value - The value to add.
 * @param {number} limit - The maximum number of history items to keep.
 * @returns {Promise<void>}
 */
async function addHistoryEntry(storageKey, value, limit = MAX_HISTORY_LENGTH) {
    const trimmedValue = value?.trim();
    if (!trimmedValue) {
        console.log(`DEBUG HISTORY: Skipping empty value for key "${storageKey}"`);
        return;
    }

    console.log(`DEBUG HISTORY: Adding entry "${trimmedValue}" to key "${storageKey}"`);
    let history = await getHistoryArray(storageKey); // MODIFIED: await

    if (history.length > 0 && history[0] === trimmedValue) {
        console.log(`DEBUG HISTORY: Value "${trimmedValue}" already at top of history for key "${storageKey}"`);
        return;
    }

    // Check if we've reached the maximum limit and show a warning
    if (history.length >= limit && !history.includes(trimmedValue)) {
        console.warn(`DEBUG HISTORY: Maximum history limit (${limit}) reached for key "${storageKey}"`);
        alert(`Maximum history limit (${limit}) reached. The oldest entry will be removed.`);
    }

    history = history.filter(item => item !== trimmedValue);
    history.unshift(trimmedValue);

    if (history.length > limit) {
        history = history.slice(0, limit);
    }

    const success = await saveHistoryArray(storageKey, history); // MODIFIED: await
    if (success) {
        console.log(`DEBUG HISTORY: Successfully saved entry "${trimmedValue}" to history key "${getUserStorageKey(storageKey)}" via PHP. Final length: ${history.length}`);
    } else {
        console.error(`DEBUG HISTORY: Failed to save entry "${trimmedValue}" to history key "${getUserStorageKey(storageKey)}"`);
    }
}

/**
 * Removes an entry from a history list, saves it via PHP, and refreshes the suggestions.
 * @param {string} storageKey - The key identifying the history list.
 * @param {string} suggestionsContainerId - The ID of the suggestions container div.
 * @param {string} valueToRemove - The exact value to remove from history.
 * @param {string} inputId - The ID of the related input field.
 * @returns {Promise<void>}
 */
async function removeHistoryEntry(storageKey, suggestionsContainerId, valueToRemove, inputId) {
    console.log(`DEBUG HISTORY: Attempting to remove "${valueToRemove}" from ${storageKey} via PHP`);
    let history = await getHistoryArray(storageKey); // MODIFIED: await
    const originalLength = history.length;
    history = history.filter(item => item !== valueToRemove);

    if (history.length < originalLength) {
        const success = await saveHistoryArray(storageKey, history); // MODIFIED: await
        if (success) {
            console.log(`DEBUG HISTORY: Removed "${valueToRemove}". Refreshing suggestions for ${inputId}.`);
            // Refresh the currently displayed list
            await displayHistorySuggestions(inputId, storageKey, suggestionsContainerId); // MODIFIED: await
        } else {
            console.error(`DEBUG HISTORY: Failed to save history after removing "${valueToRemove}". Suggestions may be stale.`);
            // Optionally alert user
        }
    } else {
        console.warn(`DEBUG HISTORY: Value "${valueToRemove}" not found in history for ${storageKey}.`);
    }
}


/**
 * Displays history suggestions in a custom dropdown div (fetches history).
 * @param {string} inputId - The ID of the input element.
 * @param {string} storageKey - The key identifying the history list.
 * @param {string} suggestionsContainerId - The ID of the div to display suggestions in.
 * @returns {Promise<void>}
 */
async function displayHistorySuggestions(inputId, storageKey, suggestionsContainerId) { // MODIFIED: async
    console.log(`DEBUG HISTORY: displayHistorySuggestions called for input #${inputId}, key "${storageKey}", container #${suggestionsContainerId}`);
    
    const inputEl = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);
    
    if (!inputEl) {
        console.error(`DEBUG HISTORY: Input #${inputId} not found.`);
    }
    
    if (!suggestionsContainer) {
        console.error(`DEBUG HISTORY: Container #${suggestionsContainerId} not found.`);
    }
    
    if (!inputEl || !suggestionsContainer) {
        console.error(`DEBUG HISTORY: Cannot display suggestions: Input #${inputId} or Container #${suggestionsContainerId} not found.`);
        return;
    }

    const history = await getHistoryArray(storageKey); // MODIFIED: await
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    if (history.length > 0) {
        console.log(`DEBUG HISTORY: Building suggestions dropdown with ${history.length} items`);
        
        history.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'suggestion-item';

            const textSpan = document.createElement('span');
            textSpan.textContent = item;
            textSpan.title = item; // Show full text on hover if truncated

            // --- MODIFIED CLICK LISTENER (now async for remove) ---
            textSpan.addEventListener('click', async () => { // MODIFIED: async
                console.log(`DEBUG HISTORY: Clicked suggestion "${item}" for input #${inputId}`);
                let valueToSet = item;
                let zipCodeOnly = null; // Variable to hold just the ZIP code if applicable

                // Special handling for ZIP code: extract only the ZIP part
                if (inputId === 'zip-code') {
                    const zipMatch = item.match(/^\d{5}/); // Match 5 digits at the start
                    if (zipMatch) {
                        valueToSet = zipMatch[0];
                        zipCodeOnly = valueToSet; // Store the extracted ZIP
                    }
                }
                console.log(`DEBUG HISTORY: Setting input #${inputId} value to: "${valueToSet}"`);
                inputEl.value = valueToSet;
                suggestionsContainer.style.display = 'none'; // Hide after selection

                // Trigger change event for validation etc.
                console.log(`DEBUG HISTORY: Dispatching 'change' event on #${inputId}`);
                inputEl.dispatchEvent(new Event('change', { bubbles: true }));

                // *** ADDED: Trigger 'input' event to update character count ***
                console.log(`DEBUG HISTORY: Dispatching 'input' event on #${inputId} for char count`);
                inputEl.dispatchEvent(new Event('input', { bubbles: true }));

                // Trigger geocode if a ZIP code suggestion was clicked
                if (inputId === 'zip-code' && zipCodeOnly && typeof geocodeZip === 'function') {
                    console.log(`DEBUG HISTORY: Triggering geocode for selected ZIP: ${zipCodeOnly}`);
                    // geocodeZip itself should call the async saveZipCodeToHistory if successful
                    geocodeZip(zipCodeOnly);
                }
                
                // Trigger geocode if an address suggestion was clicked
                if (inputId === 'address' && typeof geocodeAddress === 'function') {
                    console.log(`DEBUG HISTORY: Triggering geocode for selected address: ${valueToSet}`);
                    geocodeAddress(valueToSet);
                }
            });
            // --- END MODIFIED CLICK LISTENER ---

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button'; // Prevent form submission
            deleteBtn.className = 'delete-suggestion';
            deleteBtn.innerHTML = '&times;'; // 'x' symbol
            deleteBtn.dataset.value = item; // Store the full value to delete
            deleteBtn.title = `Remove "${item}" from history`;
            deleteBtn.addEventListener('click', async (e) => { // MODIFIED: async
                e.stopPropagation(); // Prevent the item click listener from firing
                await removeHistoryEntry(storageKey, suggestionsContainerId, item, inputId); // MODIFIED: await
            });

            itemDiv.appendChild(textSpan);
            itemDiv.appendChild(deleteBtn);
            suggestionsContainer.appendChild(itemDiv);
        });
        
        console.log(`DEBUG HISTORY: Showing suggestions container #${suggestionsContainerId}`);
        suggestionsContainer.style.display = 'block'; // Show container
    } else {
        console.log(`DEBUG HISTORY: No history items for key "${storageKey}", hiding container #${suggestionsContainerId}`);
        suggestionsContainer.style.display = 'none'; // Hide if no history
    }
}

/**
 * Sets up custom history dropdown functionality for a given input field (excluding ZIP).
 * @param {string} inputId - The ID of the input element.
 * @param {string} storageKey - The key identifying the history list.
 * @param {string} suggestionsContainerId - The ID of the div used for suggestions.
 * @param {number} [limit=MAX_HISTORY_LENGTH] - Max history items.
 * @param {string} [saveOnEvent='change'] - Event to trigger saving ('change', 'blur').
 */
function setupHistoryForInput(inputId, storageKey, suggestionsContainerId, limit = MAX_HISTORY_LENGTH, saveOnEvent = 'change') {
    console.log(`DEBUG HISTORY: Setting up history for input #${inputId}, key "${storageKey}", container #${suggestionsContainerId}`);
    
    const input = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);

    if (!input) {
        console.error(`DEBUG HISTORY: Input #${inputId} not found for history setup.`);
    }
    
    if (!suggestionsContainer) {
        console.error(`DEBUG HISTORY: Container #${suggestionsContainerId} not found for history setup.`);
    }
    
    if (!input || !suggestionsContainer) {
        console.error(`DEBUG HISTORY: Input #${inputId} or Container #${suggestionsContainerId} not found for history setup.`);
        return;
    }

    input.removeAttribute('list');
    console.log(`DEBUG HISTORY: Removed 'list' attribute from input #${inputId}`);

    // Add focus event listener
    input.addEventListener('focus', async () => { // MODIFIED: async
        console.log(`DEBUG HISTORY: Input #${inputId} focused, displaying suggestions`);
        await displayHistorySuggestions(inputId, storageKey, suggestionsContainerId); // MODIFIED: await
    });
    console.log(`DEBUG HISTORY: Added focus event listener to input #${inputId}`);

    // Add blur event listener
    input.addEventListener('blur', () => {
        console.log(`DEBUG HISTORY: Input #${inputId} blurred, will check if should hide suggestions`);
        // Use a variable accessible within the timeout
        const container = suggestionsContainer;
        // MODIFIED: Increased timeout delay
        setTimeout(() => {
            // Check if the focus is still within the suggestions container or went to a delete button
            const focusedElement = document.activeElement;
            const isFocusInside = container.contains(focusedElement) || focusedElement?.classList.contains('delete-suggestion');
            if (!isFocusInside) {
                console.log(`DEBUG HISTORY: Focus not inside container #${suggestionsContainerId}, hiding it`);
                container.style.display = 'none';
            } else {
                console.log(`DEBUG HISTORY: Focus still inside container #${suggestionsContainerId}, keeping it visible`);
            }
        }, 300); // Increased delay
    });
    console.log(`DEBUG HISTORY: Added blur event listener to input #${inputId}`);

    // Save entry on specified event (e.g., 'change' or 'blur')
    input.addEventListener(saveOnEvent, async function() { // MODIFIED: async
        console.log(`DEBUG HISTORY: Input #${inputId} ${saveOnEvent} event triggered, saving value "${this.value}"`);
        await addHistoryEntry(storageKey, this.value, limit); // MODIFIED: await
    });
    console.log(`DEBUG HISTORY: Added ${saveOnEvent} event listener to input #${inputId} for saving history`);

    // Standard Enter key handling for text inputs (NOT ZIP)
    input.addEventListener('keydown', async function(e) { // MODIFIED: async
        if (e.key === 'Enter') {
            console.log(`DEBUG HISTORY: Enter key pressed in input #${inputId}, saving value "${this.value}"`);
            e.preventDefault();
            await addHistoryEntry(storageKey, this.value, limit); // Save on Enter as well - MODIFIED: await
            suggestionsContainer.style.display = 'none'; // Hide suggestions on Enter
        }
    });
    console.log(`DEBUG HISTORY: Added keydown event listener to input #${inputId} for Enter key`);

    // Character counter update (if applicable)
    const countId = `char-count-${inputId.split('-')[2]}`; // Assumes ID like text-entry-1
    const charCount = document.getElementById(countId);
    if (charCount) {
        console.log(`DEBUG HISTORY: Found character count element #${countId} for input #${inputId}`);
        // This listener updates count on manual typing
        input.addEventListener('input', function() {
            const maxLength = input.maxLength > 0 ? input.maxLength : 50;
            charCount.textContent = maxLength - this.value.length;
            console.log(`DEBUG HISTORY: Updated character count for input #${inputId}: ${charCount.textContent}`);
        });
        console.log(`DEBUG HISTORY: Added input event listener to input #${inputId} for character count`);
        
        // Set initial count
        const maxLength = input.maxLength > 0 ? input.maxLength : 50;
        charCount.textContent = maxLength - input.value.length;
        console.log(`DEBUG HISTORY: Set initial character count for input #${inputId}: ${charCount.textContent}`);
    } else {
        console.log(`DEBUG HISTORY: No character count element #${countId} found for input #${inputId}`);
    }

    console.log(`DEBUG HISTORY: Custom history setup complete for input: #${inputId}`);
}


// --- Specific Setup Functions (Called by main_app.js) ---

/**
 * Sets up all history listeners. Now async due to potential awaits inside.
 */
async function setupAllHistories() { // MODIFIED: async (though awaits inside setupHistoryForInput are handled there)
    console.log("DEBUG HISTORY: Setting up all custom input histories (using server storage)...");
    
    // Get the current user ID (will be "default_user" if not logged in)
    const userId = getCurrentUserId();
    console.log(`DEBUG HISTORY: Setting up history for user: ${userId}`);
    
    // Setup text entries using the generic function
    // Note: We don't strictly need to await these setups unless order matters critically at init time.
    setupHistoryForInput('text-entry-1', 'history_text-entry-1', 'text-entry-1-suggestions', MAX_HISTORY_LENGTH, 'change');
    setupHistoryForInput('text-entry-2', 'history_text-entry-2', 'text-entry-2-suggestions', MAX_HISTORY_LENGTH, 'change');
    setupHistoryForInput('text-entry-3', 'history_text-entry-3', 'text-entry-3-suggestions', MAX_HISTORY_LENGTH, 'change');
    // ADDED: Setup for Text Entry 4
    setupHistoryForInput('text-entry-4', 'history_text-entry-4', 'text-entry-4-suggestions', MAX_HISTORY_LENGTH, 'change');

    // ADDED: Setup for Address field
    setupHistoryForInput('address', 'addressHistory', 'address-suggestions', MAX_HISTORY_LENGTH, 'change');

    // Setup ZIP code listeners separately
    const zipInput = document.getElementById('zip-code');
    const zipSuggestionsContainer = document.getElementById('zip-suggestions'); // Get ref here
    const zipStorageKey = 'zipCodeHistory';

    if (!zipInput) {
        console.error("DEBUG HISTORY: ZIP code input not found for history setup.");
    }
    
    if (!zipSuggestionsContainer) {
        console.error("DEBUG HISTORY: ZIP suggestions container not found for history setup.");
    }

    if (zipInput && zipSuggestionsContainer) {
        console.log("DEBUG HISTORY: Setting up ZIP code history");
        
        zipInput.removeAttribute('list');
        console.log("DEBUG HISTORY: Removed 'list' attribute from ZIP input");
        
        zipInput.addEventListener('focus', async () => { // MODIFIED: async
            console.log("DEBUG HISTORY: ZIP input focused, displaying suggestions");
            // Pass the correct container ID
            await displayHistorySuggestions('zip-code', zipStorageKey, 'zip-suggestions'); // MODIFIED: await
        });
        console.log("DEBUG HISTORY: Added focus event listener to ZIP input");
        
        zipInput.addEventListener('blur', () => {
            console.log("DEBUG HISTORY: ZIP input blurred, will check if should hide suggestions");
            // Use the captured reference
            // MODIFIED: Increased timeout delay
            setTimeout(() => {
                // Check if the focus is still within the suggestions container or went to a delete button
                const focusedElement = document.activeElement;
                const isFocusInside = zipSuggestionsContainer.contains(focusedElement) || focusedElement?.classList.contains('delete-suggestion');
                if (!isFocusInside) {
                    console.log("DEBUG HISTORY: Focus not inside ZIP suggestions container, hiding it");
                    zipSuggestionsContainer.style.display = 'none';
                } else {
                    console.log("DEBUG HISTORY: Focus still inside ZIP suggestions container, keeping it visible");
                }
            }, 300); // Increased delay
        });
        console.log("DEBUG HISTORY: Added blur event listener to ZIP input");
        
        zipInput.addEventListener('keydown', function(e) { // Note: geocodeZip itself calls the async saveZipCodeToHistory
            if (e.key === 'Enter') {
                console.log("DEBUG HISTORY: Enter key pressed in ZIP input");
                e.preventDefault();
                const zipValue = this.value.trim();
                if (zipValue) {
                    if (typeof geocodeZip === 'function') {
                        console.log(`DEBUG HISTORY: Attempting to geocode ZIP ${zipValue} on Enter press.`);
                        geocodeZip(zipValue); // map.js calls saveZipCodeToHistory -> addHistoryEntry
                    } else {
                        console.warn("DEBUG HISTORY: geocodeZip function not found. Cannot geocode on Enter.");
                    }
                } else {
                    console.log("DEBUG HISTORY: Empty ZIP value, not geocoding");
                }
                // Use the captured reference
                if (zipSuggestionsContainer) {
                    console.log("DEBUG HISTORY: Hiding ZIP suggestions container after Enter key");
                    zipSuggestionsContainer.style.display = 'none';
                }
            }
        });
        console.log("DEBUG HISTORY: Added keydown event listener to ZIP input for Enter key");
        
        console.log("DEBUG HISTORY: Custom history setup complete for input: #zip-code");
    } else {
        console.error("DEBUG HISTORY: ZIP code input or suggestions container not found for history setup.");
    }

    console.log("DEBUG HISTORY: All custom input histories setup.");
    
    // Test saving and retrieving history
    try {
        console.log("DEBUG HISTORY: Testing history system...");
        const testKey = "test_history_key";
        const testValue = "Test value " + new Date().toISOString();
        
        // Create a test file directly if it doesn't exist
        const testFile = "history/data/default_user_test_history_key.json";
        
        console.log(`DEBUG HISTORY: Checking if test file exists at ${testFile}`);
        
        // Use the test file directly instead of trying to save via API
        console.log(`DEBUG HISTORY: Retrieving history for key "${testKey}"`);
        const history = await getHistoryArray(testKey);
        
        console.log(`DEBUG HISTORY: Retrieved ${history.length} items for key "${testKey}":`, history);
        
        if (history.length > 0) {
            console.log("DEBUG HISTORY: Test successful! History system is working.");
        } else {
            console.warn("DEBUG HISTORY: Test returned empty (likely first run or 404). This is acceptable.");
        }
    } catch (error) {
        console.warn("DEBUG HISTORY: Error testing history system (non-blocking):", error);
    }
}

/**
 * Public function to be called externally (e.g., by map.js) after successful geocoding.
 * @param {string} formattedZipInfo - The formatted string to save (e.g., "12345 - City, ST").
 * @returns {Promise<void>}
 */
async function saveZipCodeToHistory(formattedZipInfo) { // MODIFIED: async
    console.log(`DEBUG HISTORY: saveZipCodeToHistory called with "${formattedZipInfo}"`);
    // Calls the generic async function
    await addHistoryEntry('zipCodeHistory', formattedZipInfo, MAX_HISTORY_LENGTH); // MODIFIED: await
}

/**
 * Public function to be called externally (e.g., by map.js) after successful address geocoding.
 * @param {string} address - The address to save.
 * @returns {Promise<void>}
 */
async function saveAddressToHistory(address) { // ADDED: New function for address history
    console.log(`DEBUG HISTORY: saveAddressToHistory called with "${address}"`);
    // Calls the generic async function
    await addHistoryEntry('addressHistory', address, MAX_HISTORY_LENGTH);
}

/**
 * Public function to be called when a custom occasion is added via the existing modal
 * This hooks into the existing handleOccasionChange functionality in main_app.js
 * @param {string} customOccasionText - The custom occasion text from the modal
 * @returns {Promise<void>}
 */
async function saveCustomOccasionToHistory(customOccasionText) {
    console.log(`DEBUG HISTORY: saveCustomOccasionToHistory called with "${customOccasionText}"`);
    await addHistoryEntry('eventHistory', customOccasionText, 50);
}

console.log("DEBUG HISTORY: history.js loaded (using server storage with Firebase Auth integration)");
/* END OF CODE - Cline - 2025-05-12 11:51 File: js/history.js */
