// Custom Occasion Handling

// Initialize custom occasion functionality
document.addEventListener('DOMContentLoaded', function() {
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) return;
    
    // Ensure "Add Your Own..." is always the first option
    ensureAddYourOwnIsFirst();
    
    // Load saved custom occasions
    loadCustomOccasions();
    
    // Handle occasion selection change
    occasionSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            // Show prompt for custom occasion
            const customValue = prompt('Enter your custom occasion:');
            if (customValue && customValue.trim()) {
                // Check if this custom occasion already exists
                const existingOptions = Array.from(occasionSelect.options).map(option => option.text.toLowerCase());
                if (existingOptions.includes(customValue.trim().toLowerCase())) {
                    alert('This occasion already exists in the list.');
                    // Reset to previous selection
                    const previousValue = occasionSelect.getAttribute('data-previous-value') || '';
                    occasionSelect.value = previousValue;
                    return;
                }
                
                // Add the custom occasion as a new option
                const newOption = document.createElement('option');
                newOption.value = 'custom_' + customValue.replace(/\s+/g, '_').toLowerCase();
                newOption.text = customValue;
                newOption.className = 'custom-occasion';
                
                // Insert after the "Add Your Own..." option
                const customOptionIndex = Array.from(occasionSelect.options).findIndex(option => option.value === 'custom');
                if (customOptionIndex !== -1 && customOptionIndex + 1 < occasionSelect.options.length) {
                    occasionSelect.insertBefore(newOption, occasionSelect.options[customOptionIndex + 1]);
                } else {
                    occasionSelect.appendChild(newOption);
                }
                
                // Select the new option
                occasionSelect.value = newOption.value;
                
                // Store the custom value as a data attribute
                occasionSelect.setAttribute('data-custom-value', customValue);
                
                // Save custom occasions to localStorage
                saveCustomOccasions();
                
                // Ensure "Add Your Own..." is always the first option
                ensureAddYourOwnIsFirst();
                
                // Enable the generate button if all required fields are filled
                if (typeof validateInputs === 'function') {
                    validateInputs();
                }
            } else {
                // If canceled or empty, revert to previous selection
                const previousValue = occasionSelect.getAttribute('data-previous-value') || '';
                occasionSelect.value = previousValue;
            }
        } else {
            // Store the current selection as previous value
            occasionSelect.setAttribute('data-previous-value', this.value);
            
            // Clear the custom value attribute
            occasionSelect.removeAttribute('data-custom-value');
        }
    });
    
    // Add right-click (context menu) event to remove custom occasions
    occasionSelect.addEventListener('contextmenu', function(e) {
        // Get the selected option
        const selectedOption = occasionSelect.options[occasionSelect.selectedIndex];
        
        // Check if it's a custom occasion
        if (selectedOption && selectedOption.className === 'custom-occasion') {
            e.preventDefault(); // Prevent the default context menu
            
            // Ask for confirmation
            if (confirm(`Are you sure you want to remove "${selectedOption.text}" from the occasions list?`)) {
                // Remove the option
                occasionSelect.removeChild(selectedOption);
                
                // Reset to default selection
                occasionSelect.value = '';
                
                // Save the updated list
                saveCustomOccasions();
                
                // Update validation
                if (typeof validateInputs === 'function') {
                    validateInputs();
                }
            }
        }
    });
    
    // Store initial selection as previous value
    occasionSelect.setAttribute('data-previous-value', occasionSelect.value);
});

// Function to ensure "Add Your Own..." is always the first option
function ensureAddYourOwnIsFirst() {
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) return;
    
    // Find the "Add Your Own..." option
    const customOption = Array.from(occasionSelect.options).find(option => option.value === 'custom');
    if (!customOption) return;
    
    // If it's not the first option, move it to the top
    if (occasionSelect.options[0] !== customOption) {
        // Remove it from its current position
        occasionSelect.removeChild(customOption);
        
        // Insert it at the beginning
        if (occasionSelect.options.length > 0) {
            occasionSelect.insertBefore(customOption, occasionSelect.options[0]);
        } else {
            occasionSelect.appendChild(customOption);
        }
    }
}

// Function to save custom occasions to localStorage
function saveCustomOccasions() {
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) return;
    
    // Get all custom occasions
    const customOccasions = [];
    Array.from(occasionSelect.options).forEach(option => {
        if (option.className === 'custom-occasion') {
            customOccasions.push({
                value: option.value,
                text: option.text
            });
        }
    });
    
    // Save to localStorage
    localStorage.setItem('customOccasions', JSON.stringify(customOccasions));
}

// Function to load custom occasions from localStorage
function loadCustomOccasions() {
    const occasionSelect = document.getElementById('occasion');
    if (!occasionSelect) return;
    
    // Get saved custom occasions
    const savedOccasions = localStorage.getItem('customOccasions');
    if (!savedOccasions) return;
    
    try {
        const customOccasions = JSON.parse(savedOccasions);
        
        // Find the "Add Your Own..." option
        const customOptionIndex = Array.from(occasionSelect.options).findIndex(option => option.value === 'custom');
        
        // Add each custom occasion
        customOccasions.forEach(occasion => {
            // Check if this custom occasion already exists
            const exists = Array.from(occasionSelect.options).some(option => 
                option.value === occasion.value || option.text === occasion.text
            );
            
            if (!exists) {
                const newOption = document.createElement('option');
                newOption.value = occasion.value;
                newOption.text = occasion.text;
                newOption.className = 'custom-occasion';
                
                // Insert after the "Add Your Own..." option
                if (customOptionIndex !== -1 && customOptionIndex + 1 < occasionSelect.options.length) {
                    occasionSelect.insertBefore(newOption, occasionSelect.options[customOptionIndex + 1]);
                } else {
                    occasionSelect.appendChild(newOption);
                }
            }
        });
        
        // Ensure "Add Your Own..." is always the first option
        ensureAddYourOwnIsFirst();
    } catch (error) {
        console.error('Error loading custom occasions:', error);
    }
}
