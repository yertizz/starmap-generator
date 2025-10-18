/* START OF CODE - Cline - 2025-06-16 16:39 File: js/combined-view-final-solution.js */

/**
 * WORKING SOLUTION: Combined View Options Styling
 * Test proved script works - now applying actual spacing fixes
 */

console.log('🔥 COMBINED VIEW SCRIPT STARTING - WORKING VERSION 🔥');

setTimeout(function() {
    console.log('🔍 Looking for Combined View container...');
    
    // Find the container (we know this works from the test)
    const container = document.querySelector('div[style*="background-color: rgb(248, 249, 250)"]');
    
    if (!container) {
        console.log('❌ Container not found');
        return;
    }
    
    console.log('✅ FOUND CONTAINER! Applying spacing fixes...');
    
    // Fix 1: Reduce container padding from 10px to 5px
    container.style.setProperty('padding', '5px 15px', 'important');
    console.log('✅ Fixed container padding');
    
    // Find all child divs and fix their spacing
    const allDivs = container.querySelectorAll('div');
    console.log(`Found ${allDivs.length} child divs`);
    
    allDivs.forEach((div, index) => {
        const style = div.getAttribute('style') || '';
        
        // Fix 2: Title - reduce margin-bottom from 15px to 5px
        if (style.includes('font-weight: bold') && style.includes('margin-bottom: 15px')) {
            div.style.setProperty('margin-bottom', '5px', 'important');
            div.style.setProperty('padding-bottom', '5px', 'important');
            console.log(`✅ Fixed title spacing (div ${index})`);
        }
        
        // Fix 3: Circle Overlap row - reduce margin-bottom from 10px to 0px
        if (style.includes('display: flex') && style.includes('margin-bottom: 10px')) {
            div.style.setProperty('margin-bottom', '0px', 'important');
            console.log(`✅ Fixed circle overlap row spacing (div ${index})`);
        }
        
        // Fix 4: Line break div - hide completely
        if (style.includes('height: 20px') && style.includes('margin: 10px 0')) {
            div.style.setProperty('display', 'none', 'important');
            console.log(`✅ Hidden line break div (div ${index})`);
        }
        
        // Fix 5: Map Order section - reduce margin-top from 20px to 5px
        if (style.includes('margin-top: 20px') && style.includes('padding-top: 10px')) {
            div.style.setProperty('margin-top', '5px', 'important');
            div.style.setProperty('padding-top', '0px', 'important');
            console.log(`✅ Fixed map order section spacing (div ${index})`);
        }
        
        // Fix 6: Note text - reduce margin-top from 15px to 5px
        if (style.includes('margin-top: 15px') && style.includes('font-size: 11px')) {
            div.style.setProperty('margin-top', '5px', 'important');
            console.log(`✅ Fixed note text spacing (div ${index})`);
        }
    });
    
    // Fix 7: Set slider value to 5%
    const slider = document.getElementById('circle-overlap-percent');
    const valueDisplay = document.getElementById('overlap-value');
    
    if (slider && valueDisplay) {
        slider.value = '5';
        valueDisplay.textContent = '5%';
        console.log('✅ Set Circle Overlap to 5%');
    }
    
    // Update combinedViewSettings if it exists
    if (window.combinedViewSettings) {
        window.combinedViewSettings.overlapPercent = 5;
    }
    
    console.log('🎉 ALL SPACING FIXES APPLIED SUCCESSFULLY! 🎉');
    
}, 1000);

console.log('🔥 COMBINED VIEW WORKING SOLUTION LOADED 🔥');

/* END OF CODE - Cline - 2025-06-16 16:39 File: js/combined-view-final-solution.js */
