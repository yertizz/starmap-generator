// Zip Code History Manager

// Function to save zip code to history
function saveZipCodeToHistory(zipCode) {
    if (!zipCode.trim()) return; // Don't save empty values
    
    // This function is now only called when a zip code is successfully geocoded
    // So we don't need to validate it here anymore
    
    // Get existing history or create new array
    let history = JSON.parse(localStorage.getItem('zipCodeHistory') || '[]');
    
    // Remove duplicate if exists
    history = history.filter(item => item !== zipCode);
    
    // Add new value to the beginning
    history.unshift(zipCode);
    
    // Keep only the last 20 entries
    if (history.length > 20) {
        history = history.slice(0, 20);
    }
    
    // Save back to localStorage
    localStorage.setItem('zipCodeHistory', JSON.stringify(history));
    
    // Update the dropdown
    updateZipCodeDropdown();
    
    // Also update the zip_code_history for compatibility with map.js
    // This ensures both history systems work together
    let mapHistory = JSON.parse(localStorage.getItem('zip_code_history') || '[]');
    
    // Check if this zip code already exists in the map history
    const existingIndex = mapHistory.findIndex(item => item.zipCode === zipCode);
    
    if (existingIndex === -1) {
        // If not found, add it
        mapHistory.unshift({
            zipCode: zipCode,
            locationInfo: '',
            displayText: zipCode,
            timestamp: new Date().getTime()
        });
        
        // Keep only the last 20 entries
        if (mapHistory.length > 20) {
            mapHistory = mapHistory.slice(0, 20);
        }
        
        // Save back to localStorage
        localStorage.setItem('zip_code_history', JSON.stringify(mapHistory));
    }
    
    console.log(`Saved ZIP code to history: ${zipCode}`);
}

// Function to update the zip code dropdown
function updateZipCodeDropdown() {
    // Get the history
    const history = JSON.parse(localStorage.getItem('zipCodeHistory') || '[]');
    
    // Get or create the datalist
    let datalist = document.getElementById('zip-code-history');
    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = 'zip-code-history';
        document.body.appendChild(datalist);
        
        // Associate the datalist with the zip code input
        const zipCodeInput = document.getElementById('zip-code');
        if (zipCodeInput) {
            zipCodeInput.setAttribute('list', 'zip-code-history');
        }
    }
    
    // Clear the datalist
    datalist.innerHTML = '';
    
    // Add options to the datalist
    history.forEach(zipCode => {
        const option = document.createElement('option');
        option.value = zipCode;
        option.dataset.zipCode = zipCode; // Store the zip code for right-click handling
        datalist.appendChild(option);
    });
    
    // Create a visible dropdown for right-click functionality
    createVisibleZipDropdown(history);
    
    console.log(`Updated ZIP code dropdown with ${history.length} items`);
}

// Function to create a visible dropdown for right-click functionality
function createVisibleZipDropdown(history) {
    // Get the zip code container
    const zipContainer = document.querySelector('.zip-code-container');
    if (!zipContainer) {
        console.log('ZIP code container not found, creating one');
        
        // Get the zip code input
        const zipCodeInput = document.getElementById('zip-code');
        if (!zipCodeInput) {
            console.error('ZIP code input not found');
            return;
        }
        
        // Create a container
        const container = document.createElement('div');
        container.className = 'zip-code-container';
        container.style.position = 'relative';
        
        // Replace the input with the container
        const parent = zipCodeInput.parentNode;
        parent.insertBefore(container, zipCodeInput);
        container.appendChild(zipCodeInput);
    }
    
    // Get the container again (it should exist now)
    const container = document.querySelector('.zip-code-container');
    if (!container) {
        console.error('ZIP code container still not found');
        return;
    }
    
    // Remove any existing dropdown
    const existingDropdown = document.getElementById('zip-dropdown-list');
    if (existingDropdown) {
        existingDropdown.remove();
    }
    
    // Create a hidden dropdown list that will be shown on click
    const dropdownList = document.createElement('div');
    dropdownList.id = 'zip-dropdown-list';
    dropdownList.className = 'zip-dropdown-list';
    dropdownList.style.display = 'none';
    dropdownList.style.position = 'absolute';
    dropdownList.style.zIndex = '1000';
    dropdownList.style.backgroundColor = 'white';
    dropdownList.style.border = '1px solid #ccc';
    dropdownList.style.maxHeight = '200px';
    dropdownList.style.overflowY = 'auto';
    dropdownList.style.width = '100%';
    
    // Add items to the dropdown
    history.forEach(zipCode => {
        const item = document.createElement('div');
        item.className = 'zip-dropdown-item';
        item.textContent = zipCode;
        item.style.padding = '5px 10px';
        item.style.cursor = 'pointer';
        
        // Add hover effect
        item.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#f0f0f0';
        });
        
        item.addEventListener('mouseout', function() {
            this.style.backgroundColor = 'white';
        });
        
        // Add click handler
        item.addEventListener('click', function() {
            document.getElementById('zip-code').value = zipCode;
            dropdownList.style.display = 'none';
            
            // Trigger geocoding if available
            if (typeof geocodeZip === 'function') {
                geocodeZip(zipCode);
            }
        });
        
        // Add right-click handler for context menu
        item.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showZipContextMenu(e, zipCode);
        });
        
        dropdownList.appendChild(item);
    });
    
    container.appendChild(dropdownList);
    
    console.log(`Created visible ZIP dropdown with ${history.length} items`);
}

// Function to remove a zip code from history
function removeZipCodeFromHistory(zipCode) {
    // Get existing history
    let history = JSON.parse(localStorage.getItem('zipCodeHistory') || '[]');
    
    // Remove the zip code
    history = history.filter(item => item !== zipCode);
    
    // Save back to localStorage
    localStorage.setItem('zipCodeHistory', JSON.stringify(history));
    
    // Also remove from map history
    let mapHistory = JSON.parse(localStorage.getItem('zip_code_history') || '[]');
    mapHistory = mapHistory.filter(item => item.zipCode !== zipCode);
    localStorage.setItem('zip_code_history', JSON.stringify(mapHistory));
    
    // Update the dropdown
    updateZipCodeDropdown();
    
    // Clear the input field if it contains the removed zip code
    const zipCodeInput = document.getElementById('zip-code');
    if (zipCodeInput && zipCodeInput.value === zipCode) {
        zipCodeInput.value = '';
    }
    
    console.log(`Removed ZIP code ${zipCode} from history`);
}

// Function to show context menu for zip code
function showZipContextMenu(event, zipCode) {
    // Remove any existing context menu
    const existingMenu = document.getElementById('zip-code-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create context menu
    const contextMenu = document.createElement('div');
    contextMenu.id = 'zip-code-context-menu';
    contextMenu.className = 'context-menu';
    contextMenu.style.position = 'absolute';
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.backgroundColor = 'white';
    contextMenu.style.border = '1px solid #ccc';
    contextMenu.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
    contextMenu.style.zIndex = '1000';
    contextMenu.style.padding = '5px 0';
    
    // Add menu item to remove this zip code
    const removeItem = document.createElement('div');
    removeItem.className = 'context-menu-item';
    removeItem.textContent = `Remove "${zipCode}" from history`;
    removeItem.style.padding = '5px 10px';
    removeItem.style.cursor = 'pointer';
    removeItem.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#f0f0f0';
    });
    removeItem.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'white';
    });
    removeItem.onclick = function() {
        removeZipCodeFromHistory(zipCode);
        contextMenu.remove();
    };
    contextMenu.appendChild(removeItem);
    
    // Add menu item to clear all history
    const clearAllItem = document.createElement('div');
    clearAllItem.className = 'context-menu-item';
    clearAllItem.textContent = 'Clear all ZIP code history';
    clearAllItem.style.padding = '5px 10px';
    clearAllItem.style.cursor = 'pointer';
    clearAllItem.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#f0f0f0';
    });
    clearAllItem.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'white';
    });
    clearAllItem.onclick = function() {
        if (confirm('Are you sure you want to clear all ZIP code history?')) {
            localStorage.removeItem('zipCodeHistory');
            localStorage.removeItem('zip_code_history');
            updateZipCodeDropdown();
            document.getElementById('zip-code').value = '';
        }
        contextMenu.remove();
    };
    contextMenu.appendChild(clearAllItem);
    
    // Add the context menu to the document
    document.body.appendChild(contextMenu);
    
    // Add click listener to hide the menu when clicking elsewhere
    document.addEventListener('click', function hideMenu() {
        contextMenu.remove();
        document.removeEventListener('click', hideMenu);
    });
}

// Function to load zip code history
function loadZipCodeHistory() {
    // Get existing history
    const history = JSON.parse(localStorage.getItem('zipCodeHistory') || '[]');
    
    // Update the dropdown
    updateZipCodeDropdown();
    
    // If there's history, set the first item as the current value if the field is empty
    const zipCodeInput = document.getElementById('zip-code');
    if (zipCodeInput && history.length > 0 && !zipCodeInput.value.trim()) {
        zipCodeInput.value = history[0];
        console.log(`Set ZIP code to last used value: ${history[0]}`);
    }
    
    console.log(`Loaded ZIP code history: ${history.length} items`);
    
    return history;
}

// Function to handle zip code input
function setupZipCodeHistory() {
    const zipCodeInput = document.getElementById('zip-code');
    if (!zipCodeInput) {
        console.error('ZIP code input not found');
        return;
    }
    
    console.log('Setting up ZIP code history');
    
    // Wrap the zip code input in a container for proper dropdown positioning
    const parent = zipCodeInput.parentNode;
    const container = document.createElement('div');
    container.className = 'zip-code-container';
    container.style.position = 'relative';
    parent.insertBefore(container, zipCodeInput);
    container.appendChild(zipCodeInput);
    
    // Create datalist for suggestions
    let datalist = document.getElementById('zip-code-history');
    if (!datalist) {
        datalist = document.createElement('datalist');
        datalist.id = 'zip-code-history';
        document.body.appendChild(datalist);
        zipCodeInput.setAttribute('list', 'zip-code-history');
    }
    
    // Load history into datalist
    const history = loadZipCodeHistory();
    
    // Save zip code when Enter is pressed or input changes
    zipCodeInput.addEventListener('change', function() {
        saveZipCodeToHistory(this.value);
    });
    
    // Also save when Enter is pressed
    zipCodeInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            saveZipCodeToHistory(this.value);
            
            // Trigger geocoding
            if (typeof geocodeZip === 'function') {
                geocodeZip(this.value);
            }
        }
    });
    
    // Add right-click event listener for context menu
    zipCodeInput.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        if (this.value.trim()) {
            showZipContextMenu(e, this.value);
        }
    });
    
    // Add click handler to show the dropdown
    zipCodeInput.addEventListener('click', function() {
        const dropdownList = document.getElementById('zip-dropdown-list');
        if (dropdownList) {
            // Toggle the dropdown
            if (dropdownList.style.display === 'none') {
                dropdownList.style.display = 'block';
                
                // Position the dropdown below the input
                const rect = zipCodeInput.getBoundingClientRect();
                dropdownList.style.top = `${rect.bottom}px`;
                dropdownList.style.left = `${rect.left}px`;
                dropdownList.style.width = `${rect.width}px`;
            } else {
                dropdownList.style.display = 'none';
            }
        }
    });
    
    // Hide dropdown when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (e.target !== zipCodeInput) {
            const dropdownList = document.getElementById('zip-dropdown-list');
            if (dropdownList) {
                dropdownList.style.display = 'none';
            }
        }
    });
}

// Initialize zip code history
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing ZIP code history');
    setupZipCodeHistory();
});
