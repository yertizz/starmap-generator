/* START OF CODE - Cline - 2025-04-11 17:52 File: js/color-picker.js */
/* Full reconstructed structure - Added Viewport Positioning Logic */

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
         h /= 360;
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
     }

    function addPanelEventListeners(panel) {
        panel.querySelector('.cp-swatches').addEventListener('click', handleSwatchClick);
        panel.querySelector('.cp-select-button').addEventListener('click', handleSelect);
        panel.querySelector('.cp-cancel-button').addEventListener('click', hidePicker);
        hexInput.addEventListener('change', handleHexInputChange);

        let isSpectrumDragging = false, isHueDragging = false, isAlphaDragging = false;

        spectrumCanvas.addEventListener('mousedown', (e) => { isSpectrumDragging = true; updateSpectrum(e); });
        hueSlider.addEventListener('mousedown', (e) => { isHueDragging = true; updateHue(e); });
        alphaSlider.addEventListener('mousedown', (e) => { isAlphaDragging = true; updateAlpha(e); });

        document.addEventListener('mousemove', (e) => {
            if (isSpectrumDragging) updateSpectrum(e);
            if (isHueDragging) updateHue(e);
            if (isAlphaDragging) updateAlpha(e);
        });
        document.addEventListener('mouseup', () => {
            isSpectrumDragging = false; isHueDragging = false; isAlphaDragging = false;
        });
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
            const rgb = hexToRgb(hex);
            const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
            currentColor = { ...hsv, a: 1 };
            updatePickerUI(true);
        }
    }
    function updateSpectrum(e) {
        const rect = spectrumCanvas.getBoundingClientRect();
        let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        let y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
        currentColor.s = x / rect.width;
        currentColor.v = 1 - (y / rect.height);
        updatePickerUI();
    }
    function updateHue(e) {
        const rect = hueSlider.getBoundingClientRect();
        let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        currentColor.h = (x / rect.width) * 360;
        updatePickerUI();
    }
     function updateAlpha(e) {
         const rect = alphaSlider.getBoundingClientRect();
         let x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
         currentColor.a = x / rect.width;
         updatePickerUI();
     }

    function updatePickerUI(updateAll = false) {
        if (!pickerPanel) return; // Ensure panel exists
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

    function showPicker(inputElement, buttonElement) {
        if (!pickerPanel) {
            pickerPanel = createPickerPanel();
        }
        currentInput = inputElement;
        currentSwatchButton = buttonElement;

        const rect = buttonElement.getBoundingClientRect();
        const panelHeight = pickerPanel.offsetHeight;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        let topPosition;
        // Position above if not enough space below AND more space above
        if (spaceBelow < (panelHeight + 10) && spaceAbove > spaceBelow) {
            topPosition = window.scrollY + rect.top - panelHeight - 5;
        } else { // Default position below
            topPosition = window.scrollY + rect.bottom + 5;
        }

        pickerPanel.style.top = `${topPosition}px`;
        // Basic left alignment, consider viewport width later if needed
        pickerPanel.style.left = `${window.scrollX + rect.left}px`;

        const initialHex = inputElement.value || options.defaultColor;
        try {
             const initialRgb = hexToRgb(initialHex);
             const initialHsv = rgbToHsv(initialRgb.r, initialRgb.g, initialRgb.b);
             // Attempt to read alpha from input if it's RGBA or HEXA? For now, assume full alpha.
             currentColor = { ...initialHsv, a: 1 };
        } catch {
             currentColor = { h: 0, s: 0, v: 1, a: 1 }; // Default to white on error
        }
        updatePickerUI(true);

        pickerPanel.style.display = 'flex';
        document.addEventListener('mousedown', handleClickOutside, true);
    }

    function hidePicker() {
        if (pickerPanel) {
            pickerPanel.style.display = 'none';
        }
        document.removeEventListener('mousedown', handleClickOutside, true);
        currentInput = null;
        currentSwatchButton = null;
    }

     function handleClickOutside(event) {
         if (pickerPanel && pickerPanel.style.display !== 'none' && !pickerPanel.contains(event.target)) {
             let target = event.target;
             let isSwatchButton = false;
             while(target && target !== document.body) {
                 if (target === currentSwatchButton) { isSwatchButton = true; break; }
                 target = target.parentNode;
             }
             if (!isSwatchButton) { hidePicker(); }
         }
     }

    function handleSelect() {
        if (!pickerPanel) return;
        const rgb = hsvToRgb(currentColor.h, currentColor.s, currentColor.v);
        const finalHex = rgbToHex(rgb.r, rgb.g, rgb.b);
        // Add alpha logic if needed later
        // const alphaHex = Math.round(currentColor.a * 255).toString(16).padStart(2, '0').toUpperCase();
        // const finalValue = finalHex + (currentColor.a < 1 ? alphaHex : '');

        if (currentInput && options.onSelect) {
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

console.log("Full color-picker.js loaded (with positioning logic).");
/* END OF CODE - Cline - 2025-04-11 17:52 File: js/color-picker.js */