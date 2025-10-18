// Recovery Script - Phase 3: Isolate Canvas/Context Error

document.addEventListener('DOMContentLoaded', function() {
    console.log("Recovery App Initializing (Phase 3)...");

    const generateBtn = document.getElementById('generateBtn');

    if (generateBtn) {
        // Enable button by default for this test
        generateBtn.disabled = false;
        generateBtn.addEventListener('click', generateStarMap);
        console.log("Generate button listener added.");
    } else {
        console.error("Generate button (#generateBtn) not found!");
    }

    console.log("Recovery App Initialized (Phase 3).");
});


// --- Minimal Star Map Generation ---
function generateStarMap() {
    console.log("generateStarMap called (Minimal Recovery - Phase 3)");
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) loadingIndicator.style.display = 'flex';

    let canvas; // Define canvas outside try block for finally
    try {
        canvas = document.getElementById("star-map-canvas");
        if (!canvas) throw new Error("Canvas element (#star-map-canvas) not found");

        let ctx;
        try {
            console.log("Attempting to get canvas context...");
            ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Could not get 2D canvas context (getContext returned null)");
            console.log("Canvas context obtained successfully.");
        } catch (contextError) {
            console.error("Error getting canvas context:", contextError);
            alert("Error getting canvas context: " + contextError.message);
            throw contextError; // Re-throw to stop execution
        }

        // --- Hardcoded Values ---
        const outputWidth = 800;
        const outputHeight = 1000;
        const starFieldColorValue = "#000000";
        const outsideColorValue = "#0a0e1a";

        canvas.width = outputWidth;
        canvas.height = outputHeight;

        // --- Basic Drawing ---
        console.log("Drawing background...");
        ctx.fillStyle = outsideColorValue;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = starFieldColorValue;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        console.log("Background drawn.");

        // Draw Standard Stars ONLY
        console.log("Calling drawStandardStars...");
        drawStandardStars(ctx, canvas.width, canvas.height);
        console.log("drawStandardStars finished.");

        // --- NO TEXT DRAWING IN THIS TEST ---

        canvas.setAttribute('data-generated', 'true');
        console.log("Minimal star map generated successfully.");

    } catch (error) {
        console.error("Error during minimal star map generation:", error);
        // Alert only the specific error caught here
        alert("Error during generation process: " + error.message);
         if(canvas) canvas.setAttribute('data-generated', 'false');
    } finally {
        if (loadingIndicator) loadingIndicator.style.display = 'none';
    }
}

// --- Minimal Star Drawing (Standard) ---
function drawStandardStars(ctx, width, height) {
    console.log("drawStandardStars started."); // Log start
    const numStars = 2000;
    const radiusMultiplier = 1.0;
    try { // Add try..catch here too just in case
        for (let i = 0; i < numStars; i++) {
            const x = Math.random() * width; const y = Math.random() * height;
            const radius = (Math.random() * 1.5) * radiusMultiplier; const opacity = Math.random();
            ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`; ctx.fill();
        }
        const numBrightStars = Math.floor(numStars / 20);
        for (let i = 0; i < numBrightStars; i++) {
            const x = Math.random() * width; const y = Math.random() * height;
            const radius = (1 + Math.random() * 2) * radiusMultiplier;
            ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; ctx.fill();
        }
    } catch (drawError) {
        console.error("Error within drawStandardStars:", drawError);
    }
    console.log("drawStandardStars finished."); // Log end
}

console.log("recovery_app.js (Minimal Phase 3) loaded");
