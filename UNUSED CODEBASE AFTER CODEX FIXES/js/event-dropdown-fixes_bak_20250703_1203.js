/* START OF CODE - Cline - 2025-07-03 12:00 File: js/event-dropdown-fixes.js */
// Event Dropdown Fixes - SELECT Element Integration
// Works with existing dropdown system like Address/ZIP but for SELECT element

console.log("Event Dropdown Fixes: Loading SELECT-based version...");

// Protected events that cannot be deleted (from HTML)
const PROTECTED_EVENTS = [
    'mothers_day', 'fathers_day', 'birthday', 'day_we_met', 
    'our_anniversary', 'engagement_day', 'sweet_16_birthday',
    '21st_birthday', 'graduation_day', 'retirement'
];

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("Event Dropdown Fixes: DOM loaded, initializing SELECT integration...");
    
    // Delay to ensure other scripts are loaded
    setTimeout(() => {
        initializeEventDropdownIntegration();
    }, 300);
});

/**
 * Initialize integration with existing dropdown system
 */
function initializeEventDropdownIntegration() {
    console.log("Event Dropdown Fixes: Initializing SELECT integration...");
    
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) {
        console.error("Event Dropdown Fixes: #occasion select not found");
        return;
    }
    
    // Fix 1: Ensure dropdown defaults to "Select an option" on page load
    resetDropdownDefault();
    
    // Fix 2: Set up "Add Your Own" functionality to save to history
    setupAddYourOwnIntegration();
    
    // Fix 3: Integrate with existing dropdown suggestions system
    integrateWithExistingDropdown();
    
    console.log("Event Dropdown Fixes: SELECT integration complete");
}

/**
 * Fix 1: Reset dropdown to "Select an option" on page load
 */
function resetDropdownDefault() {
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) return;
    
    // Force dropdown to show "Select an option" (empty value)
    occasionSelect.value = '';
    
    // Ensure first option text is correct
    const firstOption = occasionSelect.options[0];
    if (firstOption && firstOption.value === '') {
        firstOption.textContent = 'Select an option';
        firstOption.selected = true;
    }
    
    console.log("Event Dropdown Fixes: Reset to 'Select an option'");
}

/**
 * Fix 2: Set up "Add Your Own" to properly save to history
 */
function setupAddYourOwnIntegration() {
    const occasionSelect = document.getElementById('occasion');
    
    // Store original change handler if it exists
    const originalHandler = occasionSelect.onchange;
    
    occasionSelect.addEventListener('change', async function(event) {
        const selectedValue = event.target.value;
        
        console.log(`Event Dropdown Fixes: Dropdown changed to: ${selectedValue}`);
        
        if (selectedValue === 'custom') {
            // Handle "Add Your Own" selection
            await handleAddYourOwnWithHistory();
        }
        
        // Call original handler if it exists
        if (originalHandler && typeof originalHandler === 'function') {
            originalHandler.call(this, event);
        }
    });
    
    console.log("Event Dropdown Fixes: Add Your Own integration set up");
}

/**
 * Handle "Add Your Own" and save to history properly
 */
async function handleAddYourOwnWithHistory() {
    const occasionSelect = document.getElementById('occasion');
    
    // Show prompt for custom event
    const customEvent = prompt('Enter your custom occasion:');
    
    if (customEvent && customEvent.trim()) {
        const trimmedEvent = customEvent.trim();
        
        // Check if this event already exists in dropdown
        const existingOptions = Array.from(occasionSelect.options).map(option => option.text.toLowerCase());
        if (existingOptions.includes(trimmedEvent.toLowerCase())) {
            alert('This occasion already exists in the list.');
            occasionSelect.value = '';
            return;
        }
        
        // Save to history using existing function
        if (typeof saveCustomOccasionToHistory === 'function') {
            console.log(`Event Dropdown Fixes: Saving to history: ${trimmedEvent}`);
            await saveCustomOccasionToHistory(trimmedEvent);
        } else {
            console.error("Event Dropdown Fixes: saveCustomOccasionToHistory function not found");
        }
        
        // Add to dropdown and select it
        const newValue = addCustomEventToDropdown(trimmedEvent);
        occasionSelect.value = newValue;
        
        console.log(`Event Dropdown Fixes: Added and selected: ${trimmedEvent}`);
    } else {
        // User cancelled - revert to empty
        occasionSelect.value = '';
    }
}

/**
 * Add custom event to dropdown and return its value
 */
function addCustomEventToDropdown(eventText) {
    const occasionSelect = document.getElementById('occasion');
    
    // Generate unique value
    const eventValue = 'custom_' + eventText.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    
    // Check if already exists
    const existingOption = occasionSelect.querySelector(`option[value="${eventValue}"]`);
    if (existingOption) {
        return eventValue;
    }
    
    // Create new option
    const newOption = document.createElement('option');
    newOption.value = eventValue;
    newOption.text = eventText;
    newOption.dataset.custom = 'true';
    
    // Insert after "Add Your Own..." option
    const addYourOwnOption = occasionSelect.querySelector('option[value="custom"]');
    if (addYourOwnOption && addYourOwnOption.nextSibling) {
        occasionSelect.insertBefore(newOption, addYourOwnOption.nextSibling);
    } else {
        // Insert at position 2 (after "Select an option" and "Add Your Own")
        if (occasionSelect.options.length > 1) {
            occasionSelect.insertBefore(newOption, occasionSelect.options[2]);
        } else {
            occasionSelect.appendChild(newOption);
        }
    }
    
    console.log(`Event Dropdown Fixes: Added to dropdown: ${eventText} (${eventValue})`);
    return eventValue;
}

/**
 * Fix 3: Integrate with existing dropdown system to fix delete buttons
 */
function integrateWithExistingDropdown() {
    // Look for existing dropdown suggestions container
    const existingContainer = document.querySelector('.history-suggestions');
    if (!existingContainer) {
        console.log("Event Dropdown Fixes: No existing suggestions container found");
        return;
    }
    
    console.log("Event Dropdown Fixes: Found existing suggestions container, fixing delete buttons");
    
    // Set up observer to fix delete buttons when they appear
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                fixDeleteButtonsInContainer(existingContainer);
            }
        });
    });
    
    // Start observing
    observer.observe(existingContainer, {
        childList: true,
        subtree: true
    });
    
    // Fix any existing buttons
    fixDeleteButtonsInContainer(existingContainer);
}

/**
 * Fix delete buttons in the suggestions container
 */
function fixDeleteButtonsInContainer(container) {
    const deleteButtons = container.querySelectorAll('.delete-suggestion');
    
    deleteButtons.forEach(button => {
        const suggestionItem = button.closest('.suggestion-item');
        if (!suggestionItem) return;
        
        const textSpan = suggestionItem.querySelector('span');
        if (!textSpan) return;
        
        const eventText = textSpan.textContent.trim();
        
        // Check if this is a protected event
        const isProtected = PROTECTED_EVENTS.some(protectedEvent => {
            const protectedText = getProtectedEventText(protectedEvent);
            return protectedText && protectedText.toLowerCase() === eventText.toLowerCase();
        });
        
        if (isProtected) {
            // Hide delete button for protected events
            button.style.display = 'none';
            console.log(`Event Dropdown Fixes: Hidden delete button for protected event: ${eventText}`);
        } else {
            // Fix styling for user-added events
            button.style.cssText = `
                background: none !important;
                border: none !important;
                color: red !important;
                font-size: 18px !important;
                font-weight: bold !important;
                cursor: pointer !important;
                padding: 0 !important;
                margin-left: auto !important;
                width: 20px !important;
                height: 20px !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                position: absolute !important;
                right: 10px !important;
                top: 50% !important;
                transform: translateY(-50%) !important;
            `;
            
            // Ensure parent has relative positioning
            suggestionItem.style.position = 'relative';
            suggestionItem.style.paddingRight = '35px'; // Make room for button
            
            // Fix click handler
            button.onclick = async function(e) {
                e.stopPropagation();
                console.log(`Event Dropdown Fixes: Removing user event: ${eventText}`);
                
                // Remove from history
                if (typeof removeHistoryEntry === 'function') {
                    await removeHistoryEntry('eventHistory', container.id, eventText, 'occasion');
                }
                
                // Remove from dropdown if it exists
                const occasionSelect = document.getElementById('occasion');
                const optionToRemove = Array.from(occasionSelect.options).find(option => 
                    option.text === eventText && option.dataset.custom === 'true'
                );
                if (optionToRemove) {
                    occasionSelect.removeChild(optionToRemove);
                    
                    // Reset selection if this was selected
                    if (occasionSelect.value === optionToRemove.value) {
                        occasionSelect.value = '';
                    }
                }
            };
            
            console.log(`Event Dropdown Fixes: Fixed delete button for user event: ${eventText}`);
        }
    });
}

/**
 * Get display text for protected events
 */
function getProtectedEventText(eventValue) {
    const textMap = {
        'mothers_day': "Mother's Day",
        'fathers_day': "Father's Day",
        'birthday': 'Birthday',
        'day_we_met': 'Day We Met',
        'our_anniversary': 'Our Wedding Day',
        'engagement_day': 'Day We Were Engaged',
        'sweet_16_birthday': 'Sweet 16 Birthday',
        '21st_birthday': '21st Birthday',
        'graduation_day': 'Graduation Day',
        'retirement': 'Finally Retired'
    };
    return textMap[eventValue];
}

/**
 * Load existing custom events from history on page load
 */
async function loadExistingCustomEvents() {
    console.log("Event Dropdown Fixes: Loading existing custom events...");
    
    if (typeof getHistoryArray !== 'function') {
        console.log("Event Dropdown Fixes: getHistoryArray not available");
        return;
    }
    
    try {
        const history = await getHistoryArray('eventHistory');
        console.log(`Event Dropdown Fixes: Found ${history.length} events in history`);
        
        // Add each to dropdown
        history.forEach(eventText => {
            addCustomEventToDropdown(eventText);
        });
        
    } catch (error) {
        console.error("Event Dropdown Fixes: Error loading history:", error);
    }
}

// Load existing events after initialization
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        loadExistingCustomEvents();
    }, 600);
});

console.log("Event Dropdown Fixes: SELECT integration script loaded");

/* END OF CODE - Cline - 2025-07-03 12:00 File: js/event-dropdown-fixes.js */
