/* START OF CODE - Cline - 2025-06-30 17:05 File: js/event-dropdown-history.js */
// Event Dropdown History Management - Server-based like Address/Zip dropdowns
// Replaces the localStorage-based custom-occasion.js with server-based history system

console.log("Loading Event Dropdown History system...");

// Default events that cannot be removed (from HTML)
const DEFAULT_EVENTS = [
    'mothers_day',
    'fathers_day', 
    'birthday',
    'day_we_met',
    'our_anniversary',
    'engagement_day',
    'sweet_16_birthday',
    '21st_birthday',
    'graduation_day',
    'retirement'
];

/**
 * Initialize the Event dropdown history system
 */
function initializeEventDropdownHistory() {
    console.log("Initializing Event dropdown history system...");
    
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) {
        console.error("Event dropdown #occasion not found");
        return;
    }

    // Create suggestions container dynamically
    createEventSuggestionsContainer();
    
    // Set up the history functionality
    setupEventHistoryListeners();
    
    // Load existing custom events from server
    loadCustomEventsFromServer();
    
    console.log("Event dropdown history system initialized");
}

/**
 * Create the suggestions container dynamically (no HTML changes needed)
 */
function createEventSuggestionsContainer() {
    const occasionSelect = document.getElementById('occasion');
    const parentDiv = occasionSelect.closest('.input-group');
    
    if (!parentDiv) {
        console.error("Could not find parent container for event suggestions");
        return;
    }
    
    // Check if container already exists
    let suggestionsContainer = document.getElementById('occasion-suggestions');
    if (suggestionsContainer) {
        console.log("Event suggestions container already exists");
        return;
    }
    
    // Create the suggestions container
    suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = 'occasion-suggestions';
    suggestionsContainer.className = 'history-suggestions';
    suggestionsContainer.style.cssText = `
        display: none;
        position: absolute;
        left: 90px;
        top: 100%;
        z-index: 1002;
    `;
    
    // Add to parent container
    parentDiv.appendChild(suggestionsContainer);
    
    // Ensure parent has relative positioning
    parentDiv.style.position = 'relative';
    
    console.log("Created event suggestions container");
}

/**
 * Set up event listeners for the dropdown
 */
function setupEventHistoryListeners() {
    const occasionSelect = document.getElementById('occasion');
    
    // Handle dropdown change (including "Add Your Own")
    occasionSelect.addEventListener('change', handleEventDropdownChange);
    
    // Show suggestions on focus
    occasionSelect.addEventListener('focus', async () => {
        console.log("Event dropdown focused, showing suggestions");
        await displayEventSuggestions();
    });
    
    // Hide suggestions on blur (with delay for clicking)
    occasionSelect.addEventListener('blur', () => {
        const suggestionsContainer = document.getElementById('occasion-suggestions');
        setTimeout(() => {
            const focusedElement = document.activeElement;
            const isFocusInside = suggestionsContainer?.contains(focusedElement) || 
                                 focusedElement?.classList.contains('delete-suggestion');
            if (!isFocusInside && suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
        }, 300);
    });
    
    console.log("Event dropdown listeners set up");
}

/**
 * Handle dropdown change events
 */
async function handleEventDropdownChange(event) {
    const occasionSelect = event.target;
    const selectedValue = occasionSelect.value;
    
    console.log(`Event dropdown changed to: ${selectedValue}`);
    
    if (selectedValue === 'custom') {
        // Handle "Add Your Own" selection
        await handleAddYourOwn(occasionSelect);
    } else if (selectedValue && !DEFAULT_EVENTS.includes(selectedValue)) {
        // User selected a custom event from history - save it to move to top
        const selectedText = occasionSelect.options[occasionSelect.selectedIndex]?.text;
        if (selectedText) {
            console.log(`Saving selected custom event to history: ${selectedText}`);
            await addHistoryEntry('eventHistory', selectedText);
        }
    }
    
    // Hide suggestions after selection
    const suggestionsContainer = document.getElementById('occasion-suggestions');
    if (suggestionsContainer) {
        suggestionsContainer.style.display = 'none';
    }
    
    // Trigger validation
    if (typeof validateInputs === 'function') {
        validateInputs();
    }
}

/**
 * Handle "Add Your Own" selection
 */
async function handleAddYourOwn(occasionSelect) {
    console.log("Handling 'Add Your Own' selection");
    
    // Store previous value for potential revert
    const previousValue = occasionSelect.getAttribute('data-previous-value') || '';
    
    // Show prompt for custom event
    const customEvent = prompt('Enter your custom occasion:');
    
    if (customEvent && customEvent.trim()) {
        const trimmedEvent = customEvent.trim();
        
        // Check if this event already exists in dropdown
        const existingOptions = Array.from(occasionSelect.options).map(option => option.text.toLowerCase());
        if (existingOptions.includes(trimmedEvent.toLowerCase())) {
            alert('This occasion already exists in the list.');
            occasionSelect.value = previousValue;
            return;
        }
        
        // Save to server history
        console.log(`Saving new custom event to server: ${trimmedEvent}`);
        await addHistoryEntry('eventHistory', trimmedEvent);
        
        // Add to dropdown and select it
        addCustomEventToDropdown(trimmedEvent, true);
        
        console.log(`Successfully added custom event: ${trimmedEvent}`);
    } else {
        // User cancelled or entered empty string
        console.log("Custom event cancelled or empty, reverting selection");
        occasionSelect.value = previousValue;
    }
    
    // Update previous value
    occasionSelect.setAttribute('data-previous-value', occasionSelect.value);
}

/**
 * Add a custom event to the dropdown
 */
function addCustomEventToDropdown(eventText, selectIt = false) {
    const occasionSelect = document.getElementById('occasion');
    
    // Generate unique value
    const eventValue = 'custom_' + eventText.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    
    // Check if already exists
    const existingOption = occasionSelect.querySelector(`option[value="${eventValue}"]`);
    if (existingOption) {
        if (selectIt) {
            occasionSelect.value = eventValue;
        }
        return;
    }
    
    // Create new option
    const newOption = document.createElement('option');
    newOption.value = eventValue;
    newOption.text = eventText;
    newOption.className = 'custom-event'; // Mark as custom for identification
    newOption.dataset.custom = 'true';
    
    // Insert after "Add Your Own..." option
    const addYourOwnOption = occasionSelect.querySelector('option[value="custom"]');
    if (addYourOwnOption && addYourOwnOption.nextSibling) {
        occasionSelect.insertBefore(newOption, addYourOwnOption.nextSibling);
    } else {
        // Insert after "Add Your Own..." at position 2
        if (occasionSelect.options.length > 1) {
            occasionSelect.insertBefore(newOption, occasionSelect.options[2]);
        } else {
            occasionSelect.appendChild(newOption);
        }
    }
    
    // Select the new option if requested
    if (selectIt) {
        occasionSelect.value = eventValue;
    }
    
    console.log(`Added custom event to dropdown: ${eventText} (${eventValue})`);
}

/**
 * Display event suggestions from server history
 */
async function displayEventSuggestions() {
    console.log("Displaying event suggestions from server");
    
    const suggestionsContainer = document.getElementById('occasion-suggestions');
    if (!suggestionsContainer) {
        console.error("Event suggestions container not found");
        return;
    }
    
    // Get history from server
    const history = await getHistoryArray('eventHistory');
    suggestionsContainer.innerHTML = '';
    
    if (history.length > 0) {
        console.log(`Building event suggestions with ${history.length} items`);
        
        history.forEach(eventText => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'suggestion-item';
            
            const textSpan = document.createElement('span');
            textSpan.textContent = eventText;
            textSpan.title = eventText;
            
            // Click to select event
            textSpan.addEventListener('click', async () => {
                console.log(`Selected event suggestion: ${eventText}`);
                
                // Add to dropdown if not exists and select it
                addCustomEventToDropdown(eventText, true);
                
                // Hide suggestions
                suggestionsContainer.style.display = 'none';
                
                // Save to move to top of history
                await addHistoryEntry('eventHistory', eventText);
                
                // Trigger validation
                if (typeof validateInputs === 'function') {
                    validateInputs();
                }
            });
            
            // Red X button for removal (only for custom events)
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'delete-suggestion';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.dataset.value = eventText;
            deleteBtn.title = `Remove "${eventText}" from history`;
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                console.log(`Removing event from history: ${eventText}`);
                
                // Remove from server history
                await removeHistoryEntry('eventHistory', 'occasion-suggestions', eventText, 'occasion');
                
                // Remove from dropdown if it exists and is custom
                const occasionSelect = document.getElementById('occasion');
                const optionToRemove = Array.from(occasionSelect.options).find(option => 
                    option.text === eventText && option.dataset.custom === 'true'
                );
                if (optionToRemove) {
                    occasionSelect.removeChild(optionToRemove);
                    console.log(`Removed custom event from dropdown: ${eventText}`);
                    
                    // Reset selection if this was selected
                    if (occasionSelect.value === optionToRemove.value) {
                        occasionSelect.value = '';
                        if (typeof validateInputs === 'function') {
                            validateInputs();
                        }
                    }
                }
            });
            
            itemDiv.appendChild(textSpan);
            itemDiv.appendChild(deleteBtn);
            suggestionsContainer.appendChild(itemDiv);
        });
        
        suggestionsContainer.style.display = 'block';
        console.log("Event suggestions displayed");
    } else {
        suggestionsContainer.style.display = 'none';
        console.log("No event history found, hiding suggestions");
    }
}

/**
 * Load custom events from server and add to dropdown
 */
async function loadCustomEventsFromServer() {
    console.log("Loading custom events from server...");
    
    try {
        const history = await getHistoryArray('eventHistory');
        console.log(`Loaded ${history.length} custom events from server`);
        
        // Add each custom event to dropdown (but don't select)
        history.forEach(eventText => {
            addCustomEventToDropdown(eventText, false);
        });
        
        console.log("Custom events loaded into dropdown");
    } catch (error) {
        console.error("Error loading custom events from server:", error);
    }
}

/**
 * Public function to save event to history (called externally if needed)
 */
async function saveEventToHistory(eventText) {
    console.log(`saveEventToHistory called with: ${eventText}`);
    await addHistoryEntry('eventHistory', eventText);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure other scripts are loaded
    setTimeout(initializeEventDropdownHistory, 100);
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, event listener will handle it
} else {
    // DOM is already loaded
    setTimeout(initializeEventDropdownHistory, 100);
}

console.log("Event dropdown history script loaded");

/* END OF CODE - Cline - 2025-06-30 17:05 File: js/event-dropdown-history.js */
