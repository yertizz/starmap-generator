/* START OF CODE - Cline - 2025-06-30 18:51 File: js/event-dropdown-fixes.js */
// Event Dropdown Fixes - Addresses all 5 issues reported by user
// Updated to handle 50-item history limit (40 default + 10 custom)

console.log("Loading Event Dropdown Fixes...");

// Set history limit to 50 items for events
const EVENT_HISTORY_LIMIT = 50;

document.addEventListener('DOMContentLoaded', function() {
    console.log("Event Dropdown Fixes: DOM loaded, applying fixes...");
    
    // Apply fixes immediately - no timeout to prevent double loading
    // Fix 2: Reset dropdown to "Select an option" instead of defaulting to Mother's Day
    resetDropdownDefault();
    
    // Fix 3 & 4: Fix "Add Your Own" functionality
    fixAddYourOwnFunctionality();
    
    // Fix 5: Update history system to handle 50 items
    updateHistoryLimit();
    
    // Fix 1: Prevent wrapping in Event Details section (apply last to avoid interference)
    setTimeout(() => {
        fixEventDetailsLayout();
    }, 100);
    
    console.log("Event Dropdown Fixes: All fixes applied");
});

/**
 * Fix 1: Prevent Date/Time from wrapping to new row
 */
function fixEventDetailsLayout() {
    console.log("Fix 1: Preventing Event Details wrapping...");
    
    const eventDetailsFieldset = document.getElementById('event-details-fieldset');
    if (eventDetailsFieldset) {
        // Apply styles directly to fieldset
        eventDetailsFieldset.style.overflow = 'visible';
        
        const containerDiv = eventDetailsFieldset.querySelector('div');
        if (containerDiv) {
            // Force no wrapping with !important equivalent
            containerDiv.style.setProperty('flex-wrap', 'nowrap', 'important');
            containerDiv.style.setProperty('overflow', 'visible', 'important');
            containerDiv.style.setProperty('min-width', '100%', 'important');
            containerDiv.style.setProperty('width', '100%', 'important');
            containerDiv.style.setProperty('display', 'flex', 'important');
            containerDiv.style.setProperty('align-items', 'center', 'important');
            containerDiv.style.setProperty('justify-content', 'flex-start', 'important');
            containerDiv.style.setProperty('gap', '10px', 'important');
            
            // Force all input groups to not wrap
            const inputGroups = containerDiv.querySelectorAll('.input-group');
            inputGroups.forEach(group => {
                group.style.setProperty('flex-shrink', '0', 'important');
                group.style.setProperty('flex-wrap', 'nowrap', 'important');
                group.style.setProperty('white-space', 'nowrap', 'important');
            });
            
            console.log("Fix 1: Event Details layout fixed - no wrapping");
        }
    }
}

/**
 * Fix 2: Reset dropdown to show "Select an option" instead of defaulting to Mother's Day
 */
function resetDropdownDefault() {
    console.log("Fix 2: Resetting dropdown default...");
    
    const occasionSelect = document.getElementById('occasion');
    if (occasionSelect) {
        // Prevent double loading by checking if already reset
        if (occasionSelect.value !== '' && occasionSelect.value !== 'custom') {
            console.log("Fix 2: Preventing double load - resetting dropdown");
            occasionSelect.selectedIndex = 0;
            occasionSelect.value = '';
        }
        
        console.log("Fix 2: Dropdown reset to 'Select an option'");
    }
}

/**
 * Fix 3 & 4: Fix "Add Your Own" functionality
 */
function fixAddYourOwnFunctionality() {
    console.log("Fix 3 & 4: Fixing 'Add Your Own' functionality...");
    
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) {
        console.error("Occasion select not found");
        return;
    }
    
    // Remove any existing event listeners to prevent conflicts
    const newSelect = occasionSelect.cloneNode(true);
    occasionSelect.parentNode.replaceChild(newSelect, occasionSelect);
    
    // Add the fixed event listener
    newSelect.addEventListener('change', async function(event) {
        console.log("Occasion dropdown changed to:", this.value);
        
        if (this.value === 'custom') {
            console.log("'Add Your Own' selected, showing prompt...");
            
            // Store previous value for potential revert
            const previousValue = this.getAttribute('data-previous-value') || '';
            
            // Show prompt for custom event
            const customEvent = prompt('Enter your custom occasion:');
            
            if (customEvent && customEvent.trim()) {
                const trimmedEvent = customEvent.trim();
                
                console.log("User entered custom event:", trimmedEvent);
                
                // Check if this event already exists in dropdown
                const existingOptions = Array.from(this.options).map(option => option.text.toLowerCase());
                if (existingOptions.includes(trimmedEvent.toLowerCase())) {
                    alert('This occasion already exists in the list.');
                    this.value = previousValue;
                    return;
                }
                
                // Create new option and add it to dropdown
                const newOption = document.createElement('option');
                newOption.value = 'custom_' + trimmedEvent.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                newOption.text = trimmedEvent;
                newOption.className = 'custom-event';
                newOption.dataset.custom = 'true';
                
                // Insert after "Add Your Own..." option (position 2)
                const addYourOwnOption = this.querySelector('option[value="custom"]');
                if (addYourOwnOption && addYourOwnOption.nextSibling) {
                    this.insertBefore(newOption, addYourOwnOption.nextSibling);
                } else {
                    // Insert at position 2 (after "Select an option" and "Add Your Own")
                    if (this.options.length > 2) {
                        this.insertBefore(newOption, this.options[2]);
                    } else {
                        this.appendChild(newOption);
                    }
                }
                
                // Select the new option
                this.value = newOption.value;
                
                // Save to server history if the function exists
                if (typeof addHistoryEntry === 'function') {
                    console.log("Saving to server history:", trimmedEvent);
                    try {
                        await addHistoryEntry('eventHistory', trimmedEvent);
                        console.log("Successfully saved to server history");
                    } catch (error) {
                        console.error("Error saving to server history:", error);
                    }
                } else {
                    console.warn("addHistoryEntry function not found - cannot save to server");
                }
                
                console.log("Successfully added custom event:", trimmedEvent);
            } else {
                // User cancelled or entered empty string
                console.log("Custom event cancelled or empty, reverting selection");
                this.value = previousValue;
            }
            
            // Update previous value
            this.setAttribute('data-previous-value', this.value);
        } else {
            // Update previous value for non-custom selections
            this.setAttribute('data-previous-value', this.value);
        }
        
        // Trigger validation if function exists
        if (typeof validateInputs === 'function') {
            validateInputs();
        }
    });
    
    console.log("Fix 3 & 4: 'Add Your Own' functionality fixed");
}

/**
 * Fix 5: Update history system to handle 50 items
 */
function updateHistoryLimit() {
    console.log("Fix 5: Updating history system to handle 50 items...");
    
    // Override the MAX_HISTORY_LENGTH for events
    if (typeof window !== 'undefined') {
        window.EVENT_HISTORY_LIMIT = EVENT_HISTORY_LIMIT;
        console.log("Fix 5: Event history limit set to 50 items");
    }
    
    // Set up event suggestions container if needed
    setupEventSuggestionsContainer();
}

/**
 * Set up event suggestions container for history dropdown
 */
function setupEventSuggestionsContainer() {
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) return;
    
    const parentDiv = occasionSelect.closest('.input-group');
    if (!parentDiv) return;
    
    // Check if container already exists
    let suggestionsContainer = document.getElementById('occasion-suggestions');
    if (suggestionsContainer) {
        console.log("Event suggestions container already exists");
        return;
    }
    
    // Create suggestions container
    suggestionsContainer = document.createElement('div');
    suggestionsContainer.id = 'occasion-suggestions';
    suggestionsContainer.className = 'history-suggestions';
    suggestionsContainer.style.cssText = `
        display: none;
        position: absolute;
        left: 90px;
        top: 100%;
        z-index: 1002;
        background: white;
        border: 1px solid #ccc;
        max-height: 300px;
        overflow-y: auto;
        min-width: 250px;
        box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    `;
    
    // Add to parent and ensure positioning
    parentDiv.appendChild(suggestionsContainer);
    parentDiv.style.position = 'relative';
    
    // Set up focus/blur events for suggestions
    occasionSelect.addEventListener('focus', async () => {
        if (typeof getHistoryArray === 'function') {
            try {
                const history = await getHistoryArray('eventHistory');
                displayEventSuggestions(history, suggestionsContainer, occasionSelect);
            } catch (error) {
                console.error("Error loading event history:", error);
            }
        }
    });
    
    occasionSelect.addEventListener('blur', () => {
        setTimeout(() => {
            const focusedElement = document.activeElement;
            const isFocusInside = suggestionsContainer.contains(focusedElement) || 
                                 focusedElement?.classList.contains('delete-suggestion');
            if (!isFocusInside) {
                suggestionsContainer.style.display = 'none';
            }
        }, 300);
    });
    
    console.log("Event suggestions container set up successfully");
}

/**
 * Display event suggestions with red X buttons for removal
 */
function displayEventSuggestions(history, container, occasionSelect) {
    container.innerHTML = '';
    
    if (history && history.length > 0) {
        console.log(`Displaying ${history.length} event suggestions`);
        
        history.forEach(eventText => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'suggestion-item';
            itemDiv.style.cssText = `
                padding: 6px 10px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #eee;
            `;
            
            const textSpan = document.createElement('span');
            textSpan.textContent = eventText;
            textSpan.title = eventText;
            textSpan.style.cssText = `
                flex-grow: 1;
                margin-right: 10px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            `;
            
            // Click to select event
            textSpan.addEventListener('click', async () => {
                console.log(`Selected event suggestion: ${eventText}`);
                
                // Add to dropdown if not exists and select it
                addCustomEventToDropdown(eventText, true, occasionSelect);
                container.style.display = 'none';
                
                // Save to move to top of history
                if (typeof addHistoryEntry === 'function') {
                    try {
                        await addHistoryEntry('eventHistory', eventText, EVENT_HISTORY_LIMIT);
                    } catch (error) {
                        console.error("Error saving to history:", error);
                    }
                }
                
                // Trigger validation
                if (typeof validateInputs === 'function') {
                    validateInputs();
                }
            });
            
            // Red X button for removal
            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.className = 'delete-suggestion';
            deleteBtn.innerHTML = '&times;';
            deleteBtn.style.cssText = `
                background: none;
                border: none;
                color: #dc3545;
                cursor: pointer;
                font-size: 1.2em;
                font-weight: bold;
                padding: 0 3px;
                line-height: 1;
                opacity: 0.6;
            `;
            deleteBtn.title = `Remove "${eventText}" from history`;
            
            deleteBtn.addEventListener('click', async (e) => {
                e.stopPropagation();
                console.log(`Removing event from history: ${eventText}`);
                
                // Remove from server history
                if (typeof removeHistoryEntry === 'function') {
                    try {
                        await removeHistoryEntry('eventHistory', 'occasion-suggestions', eventText, 'occasion');
                    } catch (error) {
                        console.error("Error removing from history:", error);
                    }
                }
                
                // Remove from dropdown if it exists and is custom
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
            
            deleteBtn.addEventListener('mouseenter', () => {
                deleteBtn.style.opacity = '1';
                deleteBtn.style.color = '#a71d2a';
            });
            
            deleteBtn.addEventListener('mouseleave', () => {
                deleteBtn.style.opacity = '0.6';
                deleteBtn.style.color = '#dc3545';
            });
            
            itemDiv.appendChild(textSpan);
            itemDiv.appendChild(deleteBtn);
            container.appendChild(itemDiv);
        });
        
        container.style.display = 'block';
        console.log("Event suggestions displayed with red X buttons");
    } else {
        container.style.display = 'none';
        console.log("No event history found");
    }
}

/**
 * Add a custom event to the dropdown
 */
function addCustomEventToDropdown(eventText, selectIt = false, occasionSelect = null) {
    if (!occasionSelect) {
        occasionSelect = document.getElementById('occasion');
    }
    if (!occasionSelect) return;
    
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
    newOption.className = 'custom-event';
    newOption.dataset.custom = 'true';
    
    // Insert after "Add Your Own..." option
    const addYourOwnOption = occasionSelect.querySelector('option[value="custom"]');
    if (addYourOwnOption && addYourOwnOption.nextSibling) {
        occasionSelect.insertBefore(newOption, addYourOwnOption.nextSibling);
    } else {
        // Insert at position 2 (after "Select an option" and "Add Your Own")
        if (occasionSelect.options.length > 2) {
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

console.log("Event Dropdown Fixes script loaded");

/* END OF CODE - Cline - 2025-06-30 18:51 File: js/event-dropdown-fixes.js */
