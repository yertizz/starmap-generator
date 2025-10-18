/* START OF CODE - Cline - 2025-06-16 16:35 File: js/combined-view-final-solution.js */

/**
 * SIMPLE TEST: Combined View Options Styling
 * Testing if script even runs and can find elements
 */

console.log('🔥 COMBINED VIEW SCRIPT STARTING - SIMPLE TEST VERSION 🔥');

// Test immediately
alert('SCRIPT IS RUNNING! Check console for details.');

setTimeout(function() {
    console.log('🔍 Looking for Combined View container...');
    
    // Try multiple selectors
    const container1 = document.querySelector('div[style*="background-color: rgb(248, 249, 250)"]');
    const container2 = document.querySelector('div[style*="background-color: #f8f9fa"]');
    const allDivs = document.querySelectorAll('div');
    
    console.log('Container method 1:', !!container1);
    console.log('Container method 2:', !!container2);
    console.log('Total divs on page:', allDivs.length);
    
    // Find any div containing "Combined View Options"
    let foundContainer = null;
    allDivs.forEach((div, index) => {
        if (div.textContent && div.textContent.includes('Combined View Options')) {
            console.log(`Found "Combined View Options" in div ${index}:`, div);
            foundContainer = div.closest('div[style*="background"]') || div.parentElement;
        }
    });
    
    if (foundContainer) {
        console.log('✅ FOUND CONTAINER! Applying test styling...');
        foundContainer.style.border = '5px solid red';
        foundContainer.style.backgroundColor = 'yellow';
        alert('CONTAINER FOUND AND STYLED! Should see red border and yellow background.');
    } else {
        console.log('❌ NO CONTAINER FOUND');
        alert('NO CONTAINER FOUND - Check console for details');
    }
    
}, 1000);

console.log('🔥 COMBINED VIEW SCRIPT LOADED 🔥');

/* END OF CODE - Cline - 2025-06-16 16:35 File: js/combined-view-final-solution.js */
