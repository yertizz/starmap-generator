// START OF CODE - Cline - 2025-04-13 15:15 File: js/history.js
// History Management for Star Map Generator

const MAX_HISTORY_LENGTH = 15; // Max number of items to keep in history

// --- Generic History Functions ---

/**
 * Retrieves history array from localStorage.
 * @param {string} storageKey - The key used in localStorage.
 * @returns {string[]} The history array or an empty array.
 */
function getHistoryArray(storageKey) {
    try {
        const item = localStorage.getItem(storageKey);
        const parsed = JSON.parse(item || '[]');
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error(`Error parsing history from localStorage key "${storageKey}":`, e);
        localStorage.removeItem(storageKey);
        return [];
    }
}

/**
 * Saves history array to localStorage.
 * @param {string} storageKey - The key to use in localStorage.
 * @param {string[]} historyArray - The array to save.
 */
function saveHistoryArray(storageKey, historyArray) {
    try {
        if (!Array.isArray(historyArray)) {
            console.error(`Attempted to save non-array to history key "${storageKey}"`);
            return;
        }
        localStorage.setItem(storageKey, JSON.stringify(historyArray));
    } catch (e) {
        console.error(`Error saving history to localStorage key "${storageKey}":`, e);
    }
}

/**
 * Updates the options in a datalist element.
 * @param {string} datalistId - The ID of the datalist element.
 * @param {string[]} historyArray - The array of history items.
 */
function updateDatalist(datalistId, historyArray) {
    const datalist = document.getElementById(datalistId);
    if (!datalist) {
        return;
    }
    datalist.innerHTML = '';
    if (Array.isArray(historyArray)) {
        historyArray.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            datalist.appendChild(option);
        });
    } else {
        console.error(`Cannot update datalist #${datalistId}: historyArray is not an array.`, historyArray);
    }
}

/**
 * Adds a new entry to a history list, saves it, and updates the datalist.
 * @param {string} storageKey - The localStorage key.
 * @param {string} datalistId - The ID of the associated datalist.
 * @param {string} value - The value to add (should be the formatted string for ZIP).
 * @param {number} limit - The maximum number of history items to keep.
 */
function addHistoryEntry(storageKey, datalistId, value, limit = MAX_HISTORY_LENGTH) {
    const trimmedValue = value?.trim();
    if (!trimmedValue) return;

    console.log(`DEBUG HISTORY: Attempting to add "${trimmedValue}" to ${storageKey}`); // DEBUG
    let history = getHistoryArray(storageKey);
    console.log(`DEBUG HISTORY: History before add for ${storageKey}:`, JSON.stringify(history)); // DEBUG

    // Prevent adding if it's already the most recent entry
    if (history.length > 0 && history[0] === trimmedValue) {
         console.log(`DEBUG HISTORY: Value "${trimmedValue}" is already the most recent history item for ${storageKey}. Skipping.`); // DEBUG
        return;
    }

    // Remove existing occurrences of the value
    const originalLength = history.length;
    history = history.filter(item => item !== trimmedValue);
    if (history.length < originalLength) {
        console.log(`DEBUG HISTORY: Removed existing duplicate(s) of "${trimmedValue}"`); // DEBUG
    }
    console.log(`DEBUG HISTORY: History after filter for ${storageKey}:`, JSON.stringify(history)); // DEBUG

    // Add the new value to the beginning
    history.unshift(trimmedValue);
    console.log(`DEBUG HISTORY: History after unshift for ${storageKey}:`, JSON.stringify(history)); // DEBUG

    // Limit the history size
    if (history.length > limit) {
        history = history.slice(0, limit);
        console.log(`DEBUG HISTORY: History sliced to limit (${limit}) for ${storageKey}:`, JSON.stringify(history)); // DEBUG
    }

    saveHistoryArray(storageKey, history);
    updateDatalist(datalistId, history);
    console.log(`Saved entry "${trimmedValue}" to history key "${storageKey}". Final array:`, JSON.stringify(history)); // DEBUG Final
}

/**
 * Loads history from storage and populates the datalist.
 * @param {string} storageKey - The localStorage key.
 * @param {string} datalistId - The ID of the datalist element.
 */
function loadHistory(storageKey, datalistId) {
    const history = getHistoryArray(storageKey);
    updateDatalist(datalistId, history);
    // console.log(`Loaded history for ${datalistId} (${history.length} items).`); // Reduce noise
}

/**
 * Sets up history functionality for a given input field.
 * @param {string} inputId - The ID of the input element.
 * @param {string} storageKey - The localStorage key for this history.
 * @param {string} datalistId - The ID of the associated datalist element.
 * @param {number} [limit=MAX_HISTORY_LENGTH] - Max history items.
 * @param {string} [saveOnEvent='change'] - Event to trigger saving ('change', 'blur', etc.).
 */
function setupHistoryForInput(inputId, storageKey, datalistId, limit = MAX_HISTORY_LENGTH, saveOnEvent = 'change') {
    const input = document.getElementById(inputId);
    if (!input) {
        console.error(`Input element with ID "${inputId}" not found for history setup.`);
        return;
    }

    let datalist = document.getElementById(datalistId);
    if (!datalist) {
        console.warn(`Datalist #${datalistId} not found for input #${inputId}. Creating...`);
        datalist = document.createElement('datalist');
        datalist.id = datalistId;
        input.insertAdjacentElement('afterend', datalist);
    }
    input.setAttribute('list', datalistId);

    loadHistory(storageKey, datalistId);

    input.addEventListener(saveOnEvent, function() {
        addHistoryEntry(storageKey, datalistId, this.value, limit);
    });

    input.addEventListener('focus', () => loadHistory(storageKey, datalistId));

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addHistoryEntry(storageKey, datalistId, this.value, limit);
        }
    });

     const countId = `char-count-${inputId.split('-')[2]}`;
     const charCount = document.getElementById(countId);
     if (charCount) {
         input.addEventListener('input', function() {
              const maxLength = input.maxLength > 0 ? input.maxLength : 50;
             charCount.textContent = maxLength - this.value.length;
         });
          const maxLength = input.maxLength > 0 ? input.maxLength : 50;
          charCount.textContent = maxLength - input.value.length;
     }

    console.log(`History setup complete for input: #${inputId}`);
}


// --- Specific Setup Functions (Called by main_app.js) ---

function setupAllHistories() {
    console.log("Setting up all input histories...");
    setupHistoryForInput('text-entry-1', 'history_text-entry-1', 'text-entry-1-history');
    setupHistoryForInput('text-entry-2', 'history_text-entry-2', 'text-entry-2-history');
    setupHistoryForInput('text-entry-3', 'history_text-entry-3', 'text-entry-3-history');
    setupZipCodeHistory();
    console.log("All input histories setup.");
}


// --- ZIP Code History ---

const ZIP_STORAGE_KEY = 'zipCodeHistory';
const ZIP_DATALIST_ID = 'zip-code-history';

// Public function to be called externally by map.js after successful geocoding
function saveZipCodeToHistory(formattedZipInfo) {
    // Calls the generic function
    addHistoryEntry(ZIP_STORAGE_KEY, ZIP_DATALIST_ID, formattedZipInfo);
}

function setupZipCodeHistory() {
    const zipCodeInput = document.getElementById('zip-code');
    if (!zipCodeInput) {
        console.error('ZIP code input not found for history setup.');
        return;
    }
    console.log('Setting up ZIP code history listeners.');

    let datalist = document.getElementById(ZIP_DATALIST_ID);
    if (!datalist) {
        console.warn(`Datalist #${ZIP_DATALIST_ID} not found for input #zip-code. Creating...`);
        datalist = document.createElement('datalist');
        datalist.id = ZIP_DATALIST_ID;
        zipCodeInput.insertAdjacentElement('afterend', datalist);
    }
    zipCodeInput.setAttribute('list', ZIP_DATALIST_ID);

    loadHistory(ZIP_STORAGE_KEY, ZIP_DATALIST_ID);

    // Enter key listener triggers geocoding attempt in map.js
    zipCodeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const zipValue = this.value.trim();
            if (zipValue) {
                if (typeof geocodeZip === 'function') {
                    console.log(`Attempting to geocode ZIP ${zipValue} on Enter press.`);
                    geocodeZip(zipValue); // map.js calls saveZipCodeToHistory on success
                } else {
                     console.warn("geocodeZip function not found. Cannot geocode or save history on Enter.");
                }
            }
        }
    });

    // Update dropdown on focus
    zipCodeInput.addEventListener('focus', () => loadHistory(ZIP_STORAGE_KEY, ZIP_DATALIST_ID));
    console.log(`History setup complete for input: #zip-code`);
}

// --- Function to clear history (Example - can be triggered by a button) ---
/*
function clearHistory(storageKey, datalistId) {
    if (confirm(`Clear history for ${storageKey}?`)) {
        localStorage.removeItem(storageKey);
        loadHistory(storageKey, datalistId); // Reload to show empty list
        console.log(`History cleared for ${storageKey}`);
    }
}
*/

console.log("history.js loaded");
// END OF CODE - Cline - 2025-04-13 15:15 File: js/history.js
