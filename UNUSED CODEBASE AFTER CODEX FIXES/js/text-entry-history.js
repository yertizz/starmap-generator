// Text Entry History Manager

// Function to save text entry to history
function saveTextEntryToHistory(entryId, text) {
    if (!text.trim()) return; // Don't save empty values
    
    // Get existing history or create new array
    const storageKey = `textEntryHistory_${entryId}`;
    let history = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Remove duplicate if exists
    history = history.filter(item => item !== text);
    
    // Add new value to the beginning
    history.unshift(text);
    
    // Keep only the last 10 entries
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(history));
    
    // Update the datalist
    updateTextEntryDatalist(entryId, history);
    
    console.log(`Saved text entry #${entryId} to history: ${text}`);
}

// Function to update the text entry datalist
function updateTextEntryDatalist(entryId, history) {
    // Get the datalist
    const datalistId = `text-entry-${entryId}-history`;
    const datalist = document.getElementById(datalistId);
    
    if (!datalist) {
        console.log(`Creating datalist for text entry #${entryId}`);
        // Create the datalist if it doesn't exist
        const newDatalist = document.createElement('datalist');
        newDatalist.id = datalistId;
        document.body.appendChild(newDatalist);
        
        // Associate the datalist with the text entry
        const textEntry = document.getElementById(`text-entry-${entryId}`);
        if (textEntry) {
            textEntry.setAttribute('list', datalistId);
        }
        
        // Update the reference
        datalist = newDatalist;
    }
    
    // Clear the datalist
    datalist.innerHTML = '';
    
    // Add options to the datalist
    history.forEach(text => {
        const option = document.createElement('option');
        option.value = text;
        datalist.appendChild(option);
    });
    
    console.log(`Updated datalist for text entry #${entryId} with ${history.length} items`);
}

// Function to load text entry history
function loadTextEntryHistory(entryId) {
    // Get existing history
    const storageKey = `textEntryHistory_${entryId}`;
    const history = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Update the datalist
    updateTextEntryDatalist(entryId, history);
    
    console.log(`Loaded history for text entry #${entryId}: ${history.length} items`);
    
    return history;
}

// Function to set up text entry history for all text entries
function setupTextEntryHistory() {
    // Set up history for each text entry
    for (let i = 1; i <= 3; i++) {
        const textEntry = document.getElementById(`text-entry-${i}`);
        if (!textEntry) {
            console.log(`Text entry #${i} not found`);
            continue;
        }
        
        console.log(`Setting up history for text entry #${i}`);
        
        // Load history
        const history = loadTextEntryHistory(i);
        
        // If there's history, set the first item as the current value if the field is empty
        if (history.length > 0 && !textEntry.value.trim()) {
            textEntry.value = history[0];
            console.log(`Set text entry #${i} to last used value: ${history[0]}`);
        }
        
        // Save text when input changes
        textEntry.addEventListener('change', function() {
            saveTextEntryToHistory(i, this.value);
        });
        
        // Also save when Enter is pressed
        textEntry.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); // Prevent form submission
                saveTextEntryToHistory(i, this.value);
            }
        });
        
        // Add right-click event listener for context menu
        textEntry.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            if (this.value.trim()) {
                showTextEntryContextMenu(e, i, this.value);
            }
        });
    }
}

// Function to show context menu for text entry
function showTextEntryContextMenu(event, entryId, text) {
    // Remove any existing context menu
    const existingMenu = document.getElementById('text-entry-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    // Create context menu
    const contextMenu = document.createElement('div');
    contextMenu.id = 'text-entry-context-menu';
    contextMenu.className = 'context-menu';
    contextMenu.style.position = 'absolute';
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.backgroundColor = 'white';
    contextMenu.style.border = '1px solid #ccc';
    contextMenu.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.2)';
    contextMenu.style.zIndex = '1000';
    contextMenu.style.padding = '5px 0';
    
    // Add menu item to remove this text entry
    const removeItem = document.createElement('div');
    removeItem.className = 'context-menu-item';
    removeItem.textContent = `Remove "${text}" from history`;
    removeItem.style.padding = '5px 10px';
    removeItem.style.cursor = 'pointer';
    removeItem.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#f0f0f0';
    });
    removeItem.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'white';
    });
    removeItem.onclick = function() {
        removeTextEntryFromHistory(entryId, text);
        contextMenu.remove();
    };
    contextMenu.appendChild(removeItem);
    
    // Add menu item to clear all history for this entry
    const clearAllItem = document.createElement('div');
    clearAllItem.className = 'context-menu-item';
    clearAllItem.textContent = `Clear all history for text entry #${entryId}`;
    clearAllItem.style.padding = '5px 10px';
    clearAllItem.style.cursor = 'pointer';
    clearAllItem.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#f0f0f0';
    });
    clearAllItem.addEventListener('mouseout', function() {
        this.style.backgroundColor = 'white';
    });
    clearAllItem.onclick = function() {
        if (confirm(`Are you sure you want to clear all history for text entry #${entryId}?`)) {
            localStorage.removeItem(`textEntryHistory_${entryId}`);
            updateTextEntryDatalist(entryId, []);
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

// Function to remove a text entry from history
function removeTextEntryFromHistory(entryId, text) {
    // Get existing history
    const storageKey = `textEntryHistory_${entryId}`;
    let history = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    // Remove the text
    history = history.filter(item => item !== text);
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(history));
    
    // Update the datalist
    updateTextEntryDatalist(entryId, history);
    
    console.log(`Removed text entry #${entryId} from history: ${text}`);
}

// Initialize text entry history
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing text entry history');
    setupTextEntryHistory();
});
