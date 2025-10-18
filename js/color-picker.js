/* START OF CODE - Cline - 2025-04-11 18:12 File: js/color-picker.js */
/* Full reconstructed structure - Final attempt at Viewport Positioning Logic */

const ColorPicker = (() => {
    let pickerPanel = null;
    let currentInput = null;
    let currentSwatchButton = null;
    let options = {
        defaultColor: '#FFFFFF',
        onSelect: null, // Callback function
        swatches: [
            '#000000', '#FFFFFF', '#F5F5DC', '#D2B48C', '#A0522D', '#8B4513',
            '#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#4B0082', '#EE82EE',
            '#FFC0CB', '#ADD8E6', '#E6E6FA', '#FFD700', '#C0C0C0'
        ],
        customSwatchesKey: 'customHexPickerSwatches'
    };
    let spectrumCanvas = null, hueSlider = null, alphaSlider = null;
    let spectrumCursor = null, hueCursor = null, alphaCursor = null;
    let previewInner = null;
    let hexInput = null;
    let currentColor = { h: 0, s: 1, v: 1, a: 1 }; // HSV model internal state

    // --- Color Conversion Utilities ---
    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) { hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]; }
        const bigint = parseInt(hex, 16);
        if (isNaN(bigint)) { throw new Error('Invalid HEX color'); } // Add validation
        return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    }
    function rgbToHex(r, g, b) { return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase(); }
    function rgbToHsv(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s, v = max; // Initialize h
        const d = max - min;
        s = max === 0 ? 0 : d / max;
        if (max !== min) {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s, v: v };
    }
     function hsvToRgb(h, s, v) {
         let r, g, b;
         h /= 360; // Scale h to [0, 1]
         const i = Math.floor(h * 6);
         const f = h * 6 - i;
         const p = v * (1 - s);
         const q = v * (1 - f * s);
         const t = v * (1 - (1 - f) * s);
         switch (i % 6) {
             case 0: r = v; g = t; b = p; break;
             case 1: r = q; g = v; b = p; break;
             case 2: r = p; g = v; b = t; break;
             case 3: r = p; g = q; b = v; break;
             case 4: r = t; g = p; b = v; break;
             case 5: r = v; g = p; b = q; break;
         }
         return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
     }

    // --- Picker UI Creation and Event Handling ---
    function createPickerPanel() {
        const panel = document.createElement('div');
        panel.className = 'color-picker-panel';
        panel.style.display = 'none'; // Start hidden
        panel.innerHTML = `
            <div class="cp-left">
                <div class="cp-swatches"></div>
                <div class="cp-custom-swatches-title" style="font-size: 12px; margin-top: 5px; color: #555;">Custom:</div>
                <div class="cp-custom-swatches"></div>
                <button type="button" class="cp-custom-swatch-add">+</button>
            </div>
            <div class="cp-right">
                <div class="cp-preview"><div class="cp-preview-inner"></div></div>
                <div class="cp-spectrum-box"><div class="cp-spectrum-cursor"></div></div>
                <div class="cp-slider-box">
                    <div class="cp-slider cp-hue-slider"><div class="cp-slider-cursor"></div></div>
                </div>
                <div class="cp-slider-box cp-alpha-box">
                     <div class="cp-slider cp-alpha-slider"><div class="cp-slider-cursor"></div></div>
                </div>
                <div class="cp-input-group">
                    <label for="cp-hex-input">HEX:</label>
                    <input type="text" class="cp-hex-input" id="cp-hex-input">
                </div>
                <div class="cp-controls">
                    <button type="button" class="cp-cancel-button">Cancel</button>
                    <button type="button" class="cp-select-button">Select</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // Cache elements
        spectrumCanvas = panel.querySelector('.cp-spectrum-box');
        spectrumCursor = panel.querySelector('.cp-spectrum-cursor');
        hueSlider = panel.querySelector('.cp-hue-slider');
        hueCursor = hueSlider.querySelector('.cp-slider-cursor');
        alphaSlider = panel.querySelector('.cp-alpha-slider');
        alphaCursor = alphaSlider.querySelector('.cp-slider-cursor');
        previewInner = panel.querySelector('.cp-preview-inner');
        hexInput = panel.querySelector('.cp-hex-input');

        populateSwatches(panel);
        addPanelEventListeners(panel);
        return panel;
    }

     function populateSwatches(panel) {
         const swatchesContainer = panel.querySelector('.cp-swatches');
         swatchesContainer.innerHTML = '';
         options.swatches.forEach(color => {
             const swatch = document.createElement('div');
             swatch.className = 'cp-swatch';
             swatch.style.backgroundColor = color;
             swatch.dataset.color = color;
             swatchesContainer.appendChild(swatch);
         });
         // Add custom swatches later
     }


    function addPanelEventListeners(panel) {
        panel.querySelector('.cp-swatches').addEventListener('click', handleSwatchClick);
        panel.querySelector('.cp-select-button').addEventListener('click', handleSelect);
        panel.querySelector('.cp-cancel-button').addEventListener('click', hidePicker);
        hexInput.addEventListener('change', handleHexInputChange);

        // Drag Handling
        let isSpectrumDragging = false, isHueDragging = false, isAlphaDragging = false;
        const stopDragging = () => { isSpectrumDragging = false; isHueDragging = false; isAlphaDragging = false; };
        const handleMove = (e) => {
            // Use pageX/pageY for broader compatibility including touch
            const clientX = e.touches ? e.touches[0].pageX : e.pageX;
            const clientY = e.touches ? e.touches[0].pageY : e.pageY;
            if (isSpectrumDragging) updateSpectrum(clientX, clientY);
            if (isHueDragging) updateHue(clientX, clientY);
            if (isAlphaDragging) updateAlpha(clientX, clientY);
        };

        // Prevent default drag behavior which can interfere
        panel.addEventListener('dragstart', (e) => e.preventDefault());

        spectrumCanvas.addEventListener('mousedown', (e) => { e.preventDefault(); isSpectrumDragging = true; updateSpectrum(e.pageX, e.pageY); });
        hueSlider.addEventListener('mousedown', (e) => { e.preventDefault(); isHueDragging = true; updateHue(e.pageX, e.pageY); });
        alphaSlider.addEventListener('mousedown', (e) => { e.preventDefault(); isAlphaDragging = true; updateAlpha(e.pageX, e.pageY); });

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', stopDragging);

        spectrumCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); isSpectrumDragging = true; updateSpectrum(e.touches[0].pageX, e.touches[0].pageY); });
        hueSlider.addEventListener('touchstart', (e) => { e.preventDefault(); isHueDragging = true; updateHue(e.touches[0].pageX, e.touches[0].pageY); });
        alphaSlider.addEventListener('touchstart', (e) => { e.preventDefault(); isAlphaDragging = true; updateAlpha(e.touches[0].pageX, e.touches[0].pageY); });
        window.addEventListener('touchmove', handleMove);
        window.addEventListener('touchend', stopDragging);
        window.addEventListener('touchcancel', stopDragging);
    }

     function handleHexInputChange() {
         const hex = hexInput.value;
         try {
             const rgb = hexToRgb(hex);
             const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
             currentColor = { ...hsv, a: currentColor.a };
             updatePickerUI(true);
         } catch (e) { console.warn("Invalid HEX input:", hex); }
     }
    function handleSwatchClick(event) {
        if (event.target.classList.contains('cp-swatch')) {
            const hex = event.target.dataset.color;
            try {
                const rgb = hexToRgb(hex);
                const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
                currentColor = { ...hsv, a: 1 }; // Reset alpha
                updatePickerUI(true);
            } catch (e) { console.warn("Invalid swatch color:", hex); }
        }
    }
    // Use pageX/pageY relative to element's bounding box
    function updateSpectrum(pageX, pageY) {
        if (!spectrumCanvas) return;
        const rect = spectrumCanvas.getBoundingClientRect();
        // Calculate position relative to the element, considering scroll
        let x = Math.max(0, Math.min(pageX - (rect.left + window.scrollX), rect.width));
        let y = Math.max(0, Math.min(pageY - (rect.top + window.scrollY), rect.height));
        currentColor.s = x / rect.width;
        currentColor.v = 1 - (y / rect.height);
        updatePickerUI();
    }
    function updateHue(pageX, pageY) { // Only need X for hue
        if (!hueSlider) return;
        const rect = hueSlider.getBoundingClientRect();
        let x = Math.max(0, Math.min(pageX - (rect.left + window.scrollX), rect.width));
        currentColor.h = (x / rect.width) * 360;
        updatePickerUI();
    }
     function updateAlpha(pageX, pageY) { // Only need X for alpha
         if (!alphaSlider) return;
         const rect = alphaSlider.getBoundingClientRect();
         let x = Math.max(0, Math.min(pageX - (rect.left + window.scrollX), rect.width));
         currentColor.a = x / rect.width;
         updatePickerUI();
     }

    function updatePickerUI(updateAll = false) {
        if (!pickerPanel) return;
        const rgb = hsvToRgb(currentColor.h, currentColor.s, currentColor.v);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        const rgbaString = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentColor.a})`;

        if (previewInner) previewInner.style.backgroundColor = rgbaString;
        if (hexInput && (updateAll || document.activeElement !== hexInput)) { hexInput.value = hex; }

        const hueColor = hsvToRgb(currentColor.h, 1, 1);
        if (spectrumCanvas) spectrumCanvas.style.background = `linear-gradient(to top, #000, rgba(0,0,0,0)), linear-gradient(to right, #fff, rgb(${hueColor.r},${hueColor.g},${hueColor.b}))`;

        if (spectrumCursor && spectrumCanvas) {
            const spectrumRect = spectrumCanvas.getBoundingClientRect();
            spectrumCursor.style.left = `${currentColor.s * spectrumRect.width}px`;
            spectrumCursor.style.top = `${(1 - currentColor.v) * spectrumRect.height}px`;
        }
        if (hueCursor && hueSlider) {
            const hueRect = hueSlider.getBoundingClientRect();
            hueCursor.style.left = `${(currentColor.h / 360) * hueRect.width}px`;
        }
        if (alphaCursor && alphaSlider) {
            const alphaRect = alphaSlider.getBoundingClientRect();
            alphaCursor.style.left = `${currentColor.a * alphaRect.width}px`;
            alphaSlider.style.background = `linear-gradient(to right, rgba(${rgb.r},${rgb.g},${rgb.b}, 0), rgb(${rgb.r},${rgb.g},${rgb.b})), url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJUlEQVQYV2N89+7dfwY0wAgSF8jAoGaoA5aBwQDMwGDAxAAANpYflwXlT34AAAAASUVORK5CYII=')`;
        }
    }

    // --- REVISED showPicker with Viewport Logic ---
    function showPicker(inputElement, buttonElement) {
        if (!buttonElement) { console.error("showPicker missing buttonElement."); return; }
        if (!pickerPanel) { pickerPanel = createPickerPanel(); }

        currentInput = inputElement;
        currentSwatchButton = buttonElement;

        // Set initial color first
        const initialHex = inputElement.value || options.defaultColor;
        try {
             const initialRgb = hexToRgb(initialHex);
             const initialHsv = rgbToHsv(initialRgb.r, initialRgb.g, initialRgb.b);
             currentColor = { ...initialHsv, a: 1 }; // Assume full alpha initially
        } catch {
             currentColor = { h: 0, s: 0, v: 1, a: 1 }; // Default to white on error
        }
        updatePickerUI(true); // Update panel UI fully before showing/measuring

        // Make panel visible but off-screen to measure its dimensions accurately
        pickerPanel.style.visibility = 'hidden';
        pickerPanel.style.display = 'flex';
        const panelHeight = pickerPanel.offsetHeight;
        const panelWidth = pickerPanel.offsetWidth;
        pickerPanel.style.display = 'none'; // Hide again before positioning
        pickerPanel.style.visibility = 'visible';

        const rect = buttonElement.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const spaceRight = window.innerWidth - rect.left;
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;
        const margin = 5; // Small margin from button

        let topPosition;
        let leftPosition = scrollX + rect.left; // Default left align

        // Vertical Positioning: Prioritize fitting below
        if (spaceBelow >= panelHeight + margin) {
            topPosition = scrollY + rect.bottom + margin;
        } else if (spaceAbove >= panelHeight + margin) { // Try above if not enough space below
            topPosition = scrollY + rect.top - panelHeight - margin;
        } else {
            // Doesn't fit comfortably above or below, position near top of viewport
            topPosition = scrollY + margin;
             console.warn("Picker doesn't fit well, positioning near top.");
        }
         // Ensure it doesn't go above the very top edge
         if (topPosition < scrollY + margin) {
             topPosition = scrollY + margin;
         }
         // Ensure it doesn't go too far below the bottom edge (might still be cut off)
         if (topPosition + panelHeight > scrollY + window.innerHeight - margin) {
            // Option: Adjust slightly up if possible, or just accept cutoff
            topPosition = scrollY + window.innerHeight - panelHeight - margin;
            console.warn("Picker might still be cut off at bottom.");
         }


        // Horizontal Positioning: Check if it fits to the right
        if (spaceRight < panelWidth + margin) {
            // If not enough space right, try aligning right edge of panel with right edge of button
            leftPosition = scrollX + rect.right - panelWidth;
            // Ensure it doesn't go off-screen left
            if (leftPosition < scrollX + margin) {
                leftPosition = scrollX + margin;
                console.warn("Picker might be cut off horizontally left.");
            }
        } // Otherwise, default left alignment is fine

        pickerPanel.style.top = `${topPosition}px`;
        pickerPanel.style.left = `${leftPosition}px`;

        pickerPanel.style.display = 'flex'; // Finally show it
        document.addEventListener('mousedown', handleClickOutside, true);
        console.log(`DEBUG: Picker shown for input: ${inputElement?.id} at top: ${topPosition}px`);
    }

    function hidePicker() {
        if (pickerPanel) {
            pickerPanel.style.display = 'none';
        }
        document.removeEventListener('mousedown', handleClickOutside, true);
        currentInput = null;
        currentSwatchButton = null;
        console.log("DEBUG: Picker hidden");
    }

     function handleClickOutside(event) {
         if (pickerPanel && pickerPanel.style.display !== 'none' && !pickerPanel.contains(event.target)) {
             let target = event.target;
             let isSwatchButton = false;
             while(target && target !== document.body) {
                 if (target === currentSwatchButton) { isSwatchButton = true; break; }
                 target = target.parentNode;
             }
             if (!isSwatchButton) {
                 console.log("DEBUG: Click outside detected, hiding picker.");
                 hidePicker();
             }
         }
     }

    function handleSelect() {
        if (!pickerPanel || !currentInput) return;
        const rgb = hsvToRgb(currentColor.h, currentColor.s, currentColor.v);
        const finalHex = rgbToHex(rgb.r, rgb.g, rgb.b);
        // Add alpha logic if needed later
        // const alphaHex = Math.round(currentColor.a * 255).toString(16).padStart(2, '0').toUpperCase();
        // const finalValue = finalHex + (currentColor.a < 1 ? alphaHex : '');

        if (options.onSelect) {
            options.onSelect(finalHex, currentInput, currentSwatchButton); // Pass HEX
        }
        hidePicker();
    }

    // --- Public Methods ---
    return {
        Init: (opts) => {
            options = { ...options, ...opts };
            console.log("ColorPicker Init called (manual attachment preferred).");
        },
        Show: showPicker,
        Hide: hidePicker,
        SetOptions: (opts) => {
             options = { ...options, ...opts };
        }
    };
})();

console.log("Full color-picker.js loaded (final positioning logic).");
/* END OF CODE - Cline - 2025-04-11 18:12 File: js/color-picker.js */