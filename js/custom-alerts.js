/* START OF CODE - Cline - 2025-05-12 12:11 File: js/custom-alerts.js */

/**
 * Custom Alerts Module
 * 
 * This module overrides the default browser alert, confirm, and prompt functions
 * to display custom centered dialogs instead of the default browser popups.
 */

// Store the original alert, confirm, and prompt functions
const originalAlert = window.alert;
const originalConfirm = window.confirm;
const originalPrompt = window.prompt;

/**
 * Custom alert function that displays a centered dialog
 * @param {string} message - The message to display
 */
window.alert = function(message) {
    console.log("Custom alert:", message);
    
    // Remove any existing alert dialogs
    const existingAlerts = document.querySelectorAll('.custom-alert-overlay');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '9999';
    
    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'custom-alert-dialog';
    dialog.style.backgroundColor = '#fff';
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '5px';
    dialog.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    dialog.style.maxWidth = '400px';
    dialog.style.width = '80%';
    dialog.style.textAlign = 'center';
    
    // Create message
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    messageElement.style.margin = '0 0 20px 0';
    
    // Create OK button
    const okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.style.padding = '8px 16px';
    okButton.style.backgroundColor = '#007bff';
    okButton.style.color = '#fff';
    okButton.style.border = 'none';
    okButton.style.borderRadius = '4px';
    okButton.style.cursor = 'pointer';
    
    // Add event listener to close the dialog
    okButton.addEventListener('click', function() {
        document.body.removeChild(overlay);
    });
    
    // Add elements to the dialog
    dialog.appendChild(messageElement);
    dialog.appendChild(okButton);
    overlay.appendChild(dialog);
    
    // Add the overlay to the body
    document.body.appendChild(overlay);
    
    // Focus the OK button
    okButton.focus();
};

/**
 * Custom confirm function that displays a centered dialog
 * @param {string} message - The message to display
 * @returns {boolean} - True if the user clicked OK, false if the user clicked Cancel
 */
window.confirm = function(message) {
    console.log("Custom confirm:", message);
    
    // Use a promise to make the function synchronous
    return new Promise(resolve => {
        // Remove any existing alert dialogs
        const existingAlerts = document.querySelectorAll('.custom-alert-overlay');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';
        
        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'custom-alert-dialog';
        dialog.style.backgroundColor = '#fff';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '5px';
        dialog.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        dialog.style.maxWidth = '400px';
        dialog.style.width = '80%';
        dialog.style.textAlign = 'center';
        
        // Create message
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.style.margin = '0 0 20px 0';
        
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '10px';
        
        // Create OK button
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '8px 16px';
        okButton.style.backgroundColor = '#007bff';
        okButton.style.color = '#fff';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '4px';
        okButton.style.cursor = 'pointer';
        
        // Create Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '8px 16px';
        cancelButton.style.backgroundColor = '#6c757d';
        cancelButton.style.color = '#fff';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        
        // Add event listeners
        okButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
            resolve(true);
        });
        
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
            resolve(false);
        });
        
        // Add elements to the dialog
        buttonContainer.appendChild(okButton);
        buttonContainer.appendChild(cancelButton);
        dialog.appendChild(messageElement);
        dialog.appendChild(buttonContainer);
        overlay.appendChild(dialog);
        
        // Add the overlay to the body
        document.body.appendChild(overlay);
        
        // Focus the OK button
        okButton.focus();
    });
};

/**
 * Custom prompt function that displays a centered dialog
 * @param {string} message - The message to display
 * @param {string} defaultValue - The default value for the input field
 * @returns {string|null} - The value entered by the user, or null if the user clicked Cancel
 */
window.prompt = function(message, defaultValue = '') {
    console.log("Custom prompt:", message, defaultValue);
    
    // Use a promise to make the function synchronous
    return new Promise(resolve => {
        // Remove any existing alert dialogs
        const existingAlerts = document.querySelectorAll('.custom-alert-overlay');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.zIndex = '9999';
        
        // Create dialog
        const dialog = document.createElement('div');
        dialog.className = 'custom-alert-dialog';
        dialog.style.backgroundColor = '#fff';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '5px';
        dialog.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
        dialog.style.maxWidth = '400px';
        dialog.style.width = '80%';
        dialog.style.textAlign = 'center';
        
        // Create message
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.style.margin = '0 0 20px 0';
        
        // Create input field
        const input = document.createElement('input');
        input.type = 'text';
        input.value = defaultValue;
        input.style.width = '100%';
        input.style.padding = '8px';
        input.style.marginBottom = '20px';
        input.style.boxSizing = 'border-box';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';
        
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '10px';
        
        // Create OK button
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '8px 16px';
        okButton.style.backgroundColor = '#007bff';
        okButton.style.color = '#fff';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '4px';
        okButton.style.cursor = 'pointer';
        
        // Create Cancel button
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '8px 16px';
        cancelButton.style.backgroundColor = '#6c757d';
        cancelButton.style.color = '#fff';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        
        // Add event listeners
        okButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
            resolve(input.value);
        });
        
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
            resolve(null);
        });
        
        // Add elements to the dialog
        dialog.appendChild(messageElement);
        dialog.appendChild(input);
        buttonContainer.appendChild(okButton);
        buttonContainer.appendChild(cancelButton);
        dialog.appendChild(buttonContainer);
        overlay.appendChild(dialog);
        
        // Add the overlay to the body
        document.body.appendChild(overlay);
        
        // Focus the input field
        input.focus();
        input.select();
    });
};

console.log("Custom alerts module loaded");
/* END OF CODE - Cline - 2025-05-12 12:11 File: js/custom-alerts.js */
