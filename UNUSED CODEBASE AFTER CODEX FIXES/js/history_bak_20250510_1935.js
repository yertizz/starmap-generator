/* START OF CODE - Cline - 2025-05-10 18:42 File: js/history.js */
// Custom History Dropdown Management for Star Map Generator
// MODIFIED: Uses fetch to history/history_manager.php instead of localStorage

const MAX_HISTORY_LENGTH = 20; // Max number of items to keep in history
const HISTORY_ENDPOINT = 'history/history_manager.php'; // PHP endpoint

// --- Generic History Functions (MODIFIED FOR ASYNC/FETCH) ---

/**
 * Retrieves history array from the server via PHP.
 * @param {string} storageKey - The key identifying the history list (e.g., 'zipCodeHistory').
 * @returns {Promise<string[]>} A promise resolving to the history array or an empty array on error/not found.
 */
async function getHistoryArray(storageKey) {
    console.log(`DEBUG HISTORY: Fetching history for key "${storageKey}"`);
    try {
        const response = await fetch(`${HISTORY_ENDPOINT}?key=${encodeURIComponent(storageKey)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache' // Try to prevent caching
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                console.log(`DEBUG HISTORY: No history file found on server for key "${storageKey}". Returning empty array.`);
                return []; // File not found is not an error, just no history yet
            }
            // Other errors
            const errorText = await response.text();
            throw new Error(`Server error (${response.status}): ${errorText}`);
        }

        const contentType = response.headers.get("content-type");
         if (!contentType || !contentType.includes("application/json")) {
             const responseText = await response.text();
             console.warn(`Received non-JSON response from history server for key "${storageKey}":`, responseText);
             throw new Error(`Received non-JSON response from history server: ${contentType}`);
         }

        const data = await response.json();

        // Ensure the response is an array
        if (!Array.isArray(data)) {
             console.error(`DEBUG HISTORY: Data received for key "${storageKey}" is not an array:`, data);
             // Attempt to recover if it's an object with an array property (unlikely based on PHP script)
             if (typeof data === 'object' && data !== null && Array.isArray(data.history)) {
                 return data.history;
             }
             return []; // Return empty array if format is unexpected
        }

        console.log(`DEBUG HISTORY: Successfully fetched history for key "${storageKey}", length: ${data.length}`);
        return data;

    } catch (error) {
        console.error(`Error fetching history from server for key "${storageKey}":`, error);
        // Optionally alert the user or handle differently
        // alert(`Could not load history for ${storageKey}: ${error.message}`);
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
    console.log(`DEBUG HISTORY: Saving history for key "${storageKey}", length: ${historyArray.length}`);
    if (!Array.isArray(historyArray)) {
        console.error(`Attempted to save non-array to history key "${storageKey}"`);
        return false;
    }

    try {
        const response = await fetch(HISTORY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: storageKey,
                data: historyArray
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error (${response.status}): ${errorText}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.message || 'Server reported an error during save.');
        }

        console.log(`DEBUG HISTORY: Successfully saved history for key "${storageKey}" via PHP.`);
        return true;

    } catch (error) {
        console.error(`Error saving history to server for key "${storageKey}":`, error);
        // Optionally alert the user
        // alert(`Could not save history for ${storageKey}: ${error.message}`);
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
        return;
    }

    let history = await getHistoryArray(storageKey); // MODIFIED: await

    if (history.length > 0 && history[0] === trimmedValue) {
        return;
    }

    history = history.filter(item => item !== trimmedValue);
    history.unshift(trimmedValue);

    if (history.length > limit) {
        history = history.slice(0, limit);
    }

    await saveHistoryArray(storageKey, history); // MODIFIED: await
    console.log(`Saved entry "${trimmedValue}" to history key "${storageKey}" via PHP. Final length: ${history.length}`);
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
    console.log(`Attempting to remove "${valueToRemove}" from ${storageKey} via PHP`);
    let history = await getHistoryArray(storageKey); // MODIFIED: await
    const originalLength = history.length;
    history = history.filter(item => item !== valueToRemove);

    if (history.length < originalLength) {
        const success = await saveHistoryArray(storageKey, history); // MODIFIED: await
        if (success) {
            console.log(`Removed "${valueToRemove}". Refreshing suggestions for ${inputId}.`);
            // Refresh the currently displayed list
            await displayHistorySuggestions(inputId, storageKey, suggestionsContainerId); // MODIFIED: await
        } else {
            console.error(`Failed to save history after removing "${valueToRemove}". Suggestions may be stale.`);
            // Optionally alert user
        }
    } else {
        console.warn(`Value "${valueToRemove}" not found in history for ${storageKey}.`);
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
    const inputEl = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);
    if (!inputEl || !suggestionsContainer) {
        console.error(`Cannot display suggestions: Input #${inputId} or Container #${suggestionsContainerId} not found.`);
        return;
    }

    const history = await getHistoryArray(storageKey); // MODIFIED: await
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions

    if (history.length > 0) {
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
        suggestionsContainer.style.display = 'block'; // Show container
    } else {
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
    const input = document.getElementById(inputId);
    const suggestionsContainer = document.getElementById(suggestionsContainerId);

    if (!input || !suggestionsContainer) {
        console.error(`Input #${inputId} or Container #${suggestionsContainerId} not found for history setup.`);
        return;
    }

    input.removeAttribute('list');

    input.addEventListener('focus', async () => { // MODIFIED: async
        await displayHistorySuggestions(inputId, storageKey, suggestionsContainerId); // MODIFIED: await
    });

    input.addEventListener('blur', () => {
        // Use a variable accessible within the timeout
        const container = suggestionsContainer;
        // MODIFIED: Increased timeout delay
        setTimeout(() => {
            // Check if the focus is still within the suggestions container or went to a delete button
            const focusedElement = document.activeElement;
            const isFocusInside = container.contains(focusedElement) || focusedElement?.classList.contains('delete-suggestion');
            if (!isFocusInside) {
                 container.style.display = 'none';
            }
        }, 300); // Increased delay
    });

    // Save entry on specified event (e.g., 'change' or 'blur')
    input.addEventListener(saveOnEvent, async function() { // MODIFIED: async
        await addHistoryEntry(storageKey, this.value, limit); // MODIFIED: await
    });

    // Standard Enter key handling for text inputs (NOT ZIP)
     input.addEventListener('keydown', async function(e) { // MODIFIED: async
         if (e.key === 'Enter') {
             e.preventDefault();
             await addHistoryEntry(storageKey, this.value, limit); // Save on Enter as well - MODIFIED: await
             suggestionsContainer.style.display = 'none'; // Hide suggestions on Enter
         }
     });


     // Character counter update (if applicable)
     const countId = `char-count-${inputId.split('-')[2]}`; // Assumes ID like text-entry-1
     const charCount = document.getElementById(countId);
     if (charCount) {
         // This listener updates count on manual typing
         input.addEventListener('input', function() {
              const maxLength = input.maxLength > 0 ? input.maxLength : 50;
             charCount.textContent = maxLength - this.value.length;
         });
          // Set initial count
          const maxLength = input.maxLength > 0 ? input.maxLength : 50;
          charCount.textContent = maxLength - input.value.length;
     }

    console.log(`Custom history setup complete for input: #${inputId}`);
}


// --- Specific Setup Functions (Called by main_app.js) ---

/**
 * Sets up all history listeners. Now async due to potential awaits inside.
 */
async function setupAllHistories() { // MODIFIED: async (though awaits inside setupHistoryForInput are handled there)
    console.log("Setting up all custom input histories (using server storage)...");
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

    if (zipInput && zipSuggestionsContainer) {
        zipInput.removeAttribute('list');
        zipInput.addEventListener('focus', async () => { // MODIFIED: async
            // Pass the correct container ID
            await displayHistorySuggestions('zip-code', zipStorageKey, 'zip-suggestions'); // MODIFIED: await
        });
        zipInput.addEventListener('blur', () => {
             // Use the captured reference
             // MODIFIED: Increased timeout delay
            setTimeout(() => {
                 // Check if the focus is still within the suggestions container or went to a delete button
                 const focusedElement = document.activeElement;
                 const isFocusInside = zipSuggestionsContainer.contains(focusedElement) || focusedElement?.classList.contains('delete-suggestion');
                 if (!isFocusInside) {
                    zipSuggestionsContainer.style.display = 'none';
                 }
            }, 300); // Increased delay
        });
        zipInput.addEventListener('keydown', function(e) { // Note: geocodeZip itself calls the async saveZipCodeToHistory
            if (e.key === 'Enter') {
                e.preventDefault();
                const zipValue = this.value.trim();
                if (zipValue) {
                    if (typeof geocodeZip === 'function') {
                        console.log(`Attempting to geocode ZIP ${zipValue} on Enter press.`);
                        geocodeZip(zipValue); // map.js calls saveZipCodeToHistory -> addHistoryEntry
                    } else {
                         console.warn("geocodeZip function not found. Cannot geocode on Enter.");
                    }
                }
                 // Use the captured reference
                 if (zipSuggestionsContainer) zipSuggestionsContainer.style.display = 'none';
            }
        });
         console.log(`Custom history setup complete for input: #zip-code`);
    } else {
         console.error("ZIP code input or suggestions container not found for history setup.");
    }

    console.log("All custom input histories setup.");
}

/**
 * Public function to be called externally (e.g., by map.js) after successful geocoding.
 * @param {string} formattedZipInfo - The formatted string to save (e.g., "12345 - City, ST").
 * @returns {Promise<void>}
 */
async function saveZipCodeToHistory(formattedZipInfo) { // MODIFIED: async
    // Calls the generic async function
    await addHistoryEntry('zipCodeHistory', formattedZipInfo, MAX_HISTORY_LENGTH); // MODIFIED: await
}

/**
 * Public function to be called externally (e.g., by map.js) after successful address geocoding.
 * @param {string} address - The address to save.
 * @returns {Promise<void>}
 */
async function saveAddressToHistory(address) { // ADDED: New function for address history
    // Calls the generic async function
    await addHistoryEntry('addressHistory', address, MAX_HISTORY_LENGTH);
}


console.log("history.js loaded (using server storage)");
/* END OF CODE - Cline - 2025-05-10 18:42 File: js/history.js */
