// NUCLEAR OPTION - This will DEFINITELY show the zoom slider
(function() {
    console.log('NUCLEAR ZOOM OPTION ACTIVATED!');
    
    // First, remove ALL possible CSS that could hide it
    const styleOverride = document.createElement('style');
    styleOverride.innerHTML = `
        #zoom-container,
        .zoom-section,
        .zoom-container,
        div#zoom-container {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 999999 !important;
            background-color: #ff0000 !important;
            border: 5px solid #00ff00 !important;
            padding: 20px !important;
            width: 600px !important;
            height: auto !important;
            min-height: 100px !important;
            box-shadow: 0 0 50px rgba(0,0,0,0.8) !important;
        }
        
        #zoom-container * {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        }
    `;
    document.head.appendChild(styleOverride);
    
    // Find the zoom container
    let zoom = document.getElementById('zoom-container');
    
    if (zoom) {
        console.log('FOUND ZOOM CONTAINER - Forcing to center of screen with RED background!');
        
        // Remove any parent constraints
        const parent = zoom.parentElement;
        if (parent) {
            document.body.appendChild(zoom);
            console.log('Moved zoom to body element');
        }
        
        // Force all children visible
        zoom.querySelectorAll('*').forEach(el => {
            el.style.display = 'block !important';
            el.style.visibility = 'visible !important';
            el.style.opacity = '1 !important';
        });
        
        // Add close button
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'CLOSE THIS ZOOM POPUP';
        closeBtn.style.cssText = 'background: yellow; color: black; padding: 10px; margin-top: 10px; cursor: pointer; font-weight: bold;';
        closeBtn.onclick = () => {
            zoom.style.position = 'relative';
            zoom.style.top = 'auto';
            zoom.style.left = 'auto';
            zoom.style.transform = 'none';
            zoom.style.background = '#e8e8e8';
            zoom.style.border = '1px solid #ccc';
            if (parent) parent.appendChild(zoom);
            closeBtn.remove();
        };
        zoom.appendChild(closeBtn);
        
        console.log('✓ ZOOM SHOULD NOW BE IN CENTER OF SCREEN WITH RED BACKGROUND!');
    } else {
        console.error('NO ZOOM CONTAINER FOUND! Creating emergency one...');
        
        const emergencyZoom = document.createElement('div');
        emergencyZoom.id = 'zoom-container';
        emergencyZoom.innerHTML = `
            <h2 style="color: white;">EMERGENCY ZOOM SLIDER</h2>
            <div style="display: flex; align-items: center; gap: 15px;">
                <label style="color: white; font-weight: bold;">Zoom:</label>
                <input type="range" id="zoom-slider" min="50" max="200" value="100" style="flex: 1;">
                <span id="zoom-value" style="color: white; font-weight: bold;">100%</span>
            </div>
        `;
        emergencyZoom.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            z-index: 999999 !important;
            background-color: #0000ff !important;
            border: 5px solid #ffff00 !important;
            padding: 20px !important;
            width: 600px !important;
        `;
        
        document.body.appendChild(emergencyZoom);
        
        // Initialize
        const slider = emergencyZoom.querySelector('#zoom-slider');
        const value = emergencyZoom.querySelector('#zoom-value');
        if (slider && value) {
            slider.addEventListener('input', function() {
                value.textContent = this.value + '%';
            });
        }
        
        console.log('✓ CREATED EMERGENCY ZOOM WITH BLUE BACKGROUND!');
    }
})();
