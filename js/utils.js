// START OF CODE - Cline - 2025-04-20 16:10 File: js/utils.js
// Utility Functions for Star Map Generator

// Helper to escape XML/SVG special characters (omitting apostrophe)
function escapeXml(unsafe) {
    if (typeof unsafe !== 'string') {
        return unsafe; // Return non-strings as is
    }
    // Using chained replace calls, omitting apostrophe
    let safe = unsafe.replace(/&/g, '&') // Use XML entity for ampersand
                     .replace(/</g, '<')
                     .replace(/>/g, '>')
                     .replace(/"/g, '"');
                     // Apostrophe (') is generally safe in SVG attributes unless the attribute itself is quoted with single quotes.
    return safe;
}


// Helper to draw text on canvas
function drawText(ctx, text, fontFamily, fontSize, isBold, isItalic, color, x, y) {
    if (!text || !ctx) return;
    ctx.save();
    let fontStyle = "";
    if (isBold) fontStyle += "bold ";
    if (isItalic) fontStyle += "italic ";
    // Ensure font size includes 'px' and handle potential non-numeric values gracefully
    const sizeNum = parseInt(fontSize) || 14; // Default to 14 if invalid
    const sizeWithUnit = `${sizeNum}px`;
    // Use quotes for font family names that might contain spaces
    const safeFontFamily = fontFamily.includes(' ') ? `"${fontFamily}"` : fontFamily;

    ctx.font = `${fontStyle}${sizeWithUnit} ${safeFontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
    ctx.restore();
}

// Helper to format date string (Revised Parsing)
function formatDate(dateString) {
    if (!dateString || typeof dateString !== 'string' || !dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        // console.warn("Invalid or empty date string provided to formatDate:", dateString);
        return dateString || ""; // Return original or empty string if format is wrong
    }
    try {
        // Split YYYY-MM-DD
        const parts = dateString.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10); // 1-12
        const day = parseInt(parts[2], 10);

        // Validate parts
        if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
             console.warn("Invalid date components parsed:", year, month, day);
             return "Invalid Date";
        }

        // Create Date object using UTC values to avoid timezone shifts affecting the day/month/year
        // Month is 0-indexed for Date constructor (0=Jan, 11=Dec)
        const date = new Date(Date.UTC(year, month - 1, day));

        if (isNaN(date.getTime())) { // Check if date object is valid
             console.warn("Could not create valid date object from:", year, month, day);
             return "Invalid Date";
        }

        // Now extract UTC components for formatting
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayOfWeekIndex = date.getUTCDay(); // 0 for Sunday, 6 for Saturday

        if (dayOfWeekIndex < 0 || dayOfWeekIndex > 6) { // Should not happen if date is valid, but check anyway
            console.error("Invalid day of week index calculated:", dayOfWeekIndex);
            return "Error";
        }
        const dayOfWeek = weekdays[dayOfWeekIndex];

        const dayOfMonth = date.getUTCDate(); // Use getUTCDate
        let daySuffix = 'th';
        if (dayOfMonth % 10 === 1 && dayOfMonth !== 11) daySuffix = 'st';
        else if (dayOfMonth % 10 === 2 && dayOfMonth !== 12) daySuffix = 'nd';
        else if (dayOfMonth % 10 === 3 && dayOfMonth !== 13) daySuffix = 'rd';

        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const monthIndex = date.getUTCMonth(); // Use getUTCMonth

        if (monthIndex < 0 || monthIndex > 11) { // Should not happen
             console.error("Invalid month index calculated:", monthIndex);
             return "Error";
        }
        const monthName = months[monthIndex];
        const fullYear = date.getUTCFullYear(); // Use getUTCFullYear

        return `${dayOfWeek}, ${dayOfMonth}${daySuffix} ${monthName}, ${fullYear}`;

    } catch (e) {
        console.error("Error formatting date:", e);
        return dateString; // Fallback to original string on error
    }
}


// *** CORRECTED Helper to format coordinates ***
function formatCoordinates(latValue, lngValue) {
     if (latValue === null || lngValue === null || latValue === undefined || lngValue === undefined) return "";
    try {
        let lat = parseFloat(latValue);
        let lng = parseFloat(lngValue);
        if (isNaN(lat) || isNaN(lng)) return ""; // Return empty if parsing fails

        const latDeg = Math.floor(Math.abs(lat));
        const latMin = (Math.abs(lat) - latDeg) * 60;
        const latDir = lat >= 0 ? 'N' : 'S';

        const lngDeg = Math.floor(Math.abs(lng));
        const lngMin = (Math.abs(lng) - lngDeg) * 60;
        const lngDir = lng >= 0 ? 'E' : 'W';

        // Format minutes with 5 decimal places
        const latMinFormatted = latMin.toFixed(5);
        const lngMinFormatted = lngMin.toFixed(5);

        // Separate whole and decimal parts of minutes
        const [latWholeMin, latDecMin] = latMinFormatted.split('.');
        const [lngWholeMin, lngDecMin] = lngMinFormatted.split('.');

        // Ensure parts exist before using them
        const safeLatDecMin = latDecMin || '00000';
        const safeLngDecMin = lngDecMin || '00000';

        // Corrected format: NDD° MM′.MMMMM WDDD° MM′.MMMMM
        // Prime symbol ′ is U+2032
        return `${latDir}${latDeg}° ${latWholeMin || '0'}′.${safeLatDecMin} ${lngDir}${lngDeg}° ${lngWholeMin || '0'}′.${safeLngDecMin}`;
    } catch (e) {
        console.error("Error formatting coordinates:", e);
        // Fallback to decimal if formatting fails
        return `${latValue !== null ? parseFloat(latValue).toFixed(6) : ''}, ${lngValue !== null ? parseFloat(lngValue).toFixed(6) : ''}`;
    }
}


// Helper to show temporary messages on screen
function showTemporaryMessage(message, duration = 2000) {
    let messageDiv = document.getElementById('temp-message');
    if (!messageDiv) {
        // If it doesn't exist, create it
        messageDiv = document.createElement('div'); // Create the element
        messageDiv.id = 'temp-message';
        // Apply some basic styling for visibility
        messageDiv.style.position = 'fixed';
        messageDiv.style.bottom = '20px';
        messageDiv.style.left = '50%';
        messageDiv.style.transform = 'translateX(-50%)';
        messageDiv.style.padding = '10px 20px';
        messageDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        messageDiv.style.color = 'white';
        messageDiv.style.borderRadius = '5px';
        messageDiv.style.zIndex = '1001'; // Ensure it's above most elements
        messageDiv.style.opacity = '0'; // Start invisible for fade-in
        messageDiv.style.transition = 'opacity 0.5s ease-in-out';
        document.body.appendChild(messageDiv); // Add to the body
    }
    messageDiv.textContent = message;
    // Fade in
    requestAnimationFrame(() => { // Use requestAnimationFrame for smoother start
        messageDiv.style.opacity = '1';
    });
    // Set timeout to fade out and remove
    setTimeout(() => {
        if (messageDiv) {
            messageDiv.style.opacity = '0';
            // Remove element after transition ends
            messageDiv.addEventListener('transitionend', () => {
                if (messageDiv && messageDiv.parentNode) { // Check if still attached
                     messageDiv.parentNode.removeChild(messageDiv);
                }
            }, { once: true });
             // Fallback removal if transitionend doesn't fire (e.g., element removed manually)
             setTimeout(() => {
                 if (messageDiv && messageDiv.parentNode) {
                     messageDiv.parentNode.removeChild(messageDiv);
                 }
             }, duration + 500); // Give extra time for fade out
        }
    }, duration);
}

// --- UPDATED: Input Validation Function (Handles Download Button) ---
function validateInputs() {
    // console.log("validateInputs called"); // Reduce console noise unless debugging
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn'); // Get download button
    const canvas = document.getElementById('star-map-canvas'); // Get canvas
    const latInput = document.getElementById('latitude');
    const lonInput = document.getElementById('longitude');
    const zipInput = document.getElementById('zip-code');
    const dateInput = document.getElementById('date');
    const occasionInput = document.getElementById('occasion');

    let inputsValid = false; // Default to disabled

    // Check if all required elements exist
    if (!generateBtn || !downloadBtn || !canvas || !latInput || !lonInput || !zipInput || !dateInput || !occasionInput) {
        // Silently return if elements are missing - this can happen during initialization
        // or when the function is called from contexts where not all elements exist
        return;
    }

    // Check for valid date
    const hasDate = dateInput.value.trim() !== '';
    // console.log("Date value:", dateInput.value, "hasDate:", hasDate);

    // Check for valid occasion
    const hasOccasion = occasionInput.value.trim() !== '';
    // console.log("Occasion value:", occasionInput.value, "hasOccasion:", hasOccasion);

    // Check for valid coordinates
    const latValue = latInput.value.trim();
    const lonValue = lonInput.value.trim();
    const hasCoords = latValue !== '' && lonValue !== '';
    // console.log("Coordinates:", latValue, lonValue, "hasCoords:", hasCoords);

    // Check for valid zip code
    const hasZipCode = zipInput.value.trim() !== '';
    // console.log("Zip code:", zipInput.value, "hasZipCode:", hasZipCode);

    // Enable the generate button if we have a date, occasion, and either coordinates or zip code
    inputsValid = hasDate && hasOccasion && (hasCoords || hasZipCode);
    // console.log("Core inputs validation result:", inputsValid);

    // --- Generate Button Logic ---
    if (inputsValid) {
        generateBtn.disabled = false;
        generateBtn.removeAttribute('disabled');
        generateBtn.classList.add('enabled');
    } else {
        generateBtn.disabled = true;
        generateBtn.setAttribute('disabled', 'disabled');
        generateBtn.classList.remove('enabled');
    }
    // console.log(`validateInputs: Generate button ${inputsValid ? 'enabled' : 'disabled'}.`);

    // --- Download Button Logic ---
    const mapGenerated = canvas.getAttribute('data-generated') === 'true';
    // console.log("Map generated status:", mapGenerated);

    if (inputsValid && mapGenerated) {
        downloadBtn.disabled = false;
        downloadBtn.removeAttribute('disabled');
        downloadBtn.classList.add('enabled');
        // console.log(`validateInputs: Download button enabled.`);
    } else {
        downloadBtn.disabled = true;
        downloadBtn.setAttribute('disabled', 'disabled');
        downloadBtn.classList.remove('enabled');
        // console.log(`validateInputs: Download button disabled.`);
    }
}
// --- END UPDATED Input Validation Function ---

console.log("utils.js loaded");
// --- END OF CODE - Cline - 2025-04-20 16:10 File: js/utils.js
