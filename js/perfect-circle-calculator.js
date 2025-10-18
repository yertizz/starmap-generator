/**
 * Perfect Circle Calculator
 * Core logic for calculating perfect circles on any canvas size
 */

window.PerfectCircleCalculator = (function() {
    'use strict';
    
    /**
     * Calculate the maximum circle radius that fits within the canvas
     * while maintaining a perfect circle shape
     * @param {number} canvasWidth - Canvas width in pixels
     * @param {number} canvasHeight - Canvas height in pixels
     * @param {number} radiusPercent - Desired radius as percentage (10-100)
     * @returns {object} Circle dimensions and position
     */
    function calculatePerfectCircle(canvasWidth, canvasHeight, radiusPercent) {
        // Calculate the maximum possible diameter based on the smaller dimension
        const maxDiameter = Math.min(canvasWidth, canvasHeight);
        
        // Apply the radius percentage
        const diameter = maxDiameter * (radiusPercent / 100);
        const radius = diameter / 2;
        
        // Center position
        const centerX = canvasWidth / 2;
        const centerY = canvasHeight / 2;
        
        return {
            centerX: centerX,
            centerY: centerY,
            radius: radius,
            diameter: diameter
        };
    }
    
    /**
     * Calculate positions for overlapping circles in landscape mode
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     * @param {number} radiusPercent - Radius percentage
     * @param {number} overlap - Overlap percentage (0-50)
     * @returns {object} Two circle positions
     */
    function calculateLandscapeCircles(canvasWidth, canvasHeight, radiusPercent, overlap = 20) {
        // Available space (with margins)
        const margin = 0.1; // 10% margin
        const availableWidth = canvasWidth * (1 - margin);
        const availableHeight = canvasHeight * (1 - margin);
        
        // Calculate maximum diameter for each circle
        const overlapFactor = 1 - (overlap / 100);
        const maxDiameter = Math.min(
            availableWidth / (1 + overlapFactor),
            availableHeight
        );
        
        const diameter = maxDiameter * (radiusPercent / 100);
        const radius = diameter / 2;
        
        // Calculate positions
        const spacing = diameter * overlapFactor;
        const totalWidth = diameter + spacing;
        const startX = (canvasWidth - totalWidth) / 2;
        const centerY = canvasHeight / 2;
        
        return {
            left: {
                centerX: startX + radius,
                centerY: centerY,
                radius: radius,
                diameter: diameter
            },
            right: {
                centerX: startX + radius + spacing,
                centerY: centerY,
                radius: radius,
                diameter: diameter
            }
        };
    }
    
    /**
     * Calculate positions for overlapping circles in portrait mode
     * @param {number} canvasWidth - Canvas width
     * @param {number} canvasHeight - Canvas height
     * @param {number} radiusPercent - Radius percentage
     * @param {number} overlap - Overlap percentage (0-50)
     * @returns {object} Two circle positions
     */
    function calculatePortraitCircles(canvasWidth, canvasHeight, radiusPercent, overlap = 20) {
        // Available space (with margins)
        const margin = 0.1; // 10% margin
        const availableWidth = canvasWidth * (1 - margin);
        const availableHeight = canvasHeight * (1 - margin);
        
        // Calculate maximum diameter for each circle
        const overlapFactor = 1 - (overlap / 100);
        const maxDiameter = Math.min(
            availableWidth,
            availableHeight / (1 + overlapFactor)
        );
        
        const diameter = maxDiameter * (radiusPercent / 100);
        const radius = diameter / 2;
        
        // Calculate positions
        const spacing = diameter * overlapFactor;
        const totalHeight = diameter + spacing;
        const startY = (canvasHeight - totalHeight) / 2;
        const centerX = canvasWidth / 2;
        
        return {
            top: {
                centerX: centerX,
                centerY: startY + radius,
                radius: radius,
                diameter: diameter
            },
            bottom: {
                centerX: centerX,
                centerY: startY + radius + spacing,
                radius: radius,
                diameter: diameter
            }
        };
    }
    
    /**
     * Calculate text placement positions relative to circle
     * @param {object} circle - Circle dimensions
     * @param {number} borderWidth - Border width
     * @param {string} position - 'above' or 'below'
     * @returns {object} Text positioning info
     */
    function calculateTextPosition(circle, borderWidth, position) {
        const margin = circle.radius * 0.1; // 10% of radius as margin
        
        if (position === 'above') {
            return {
                x: circle.centerX,
                y: circle.centerY - circle.radius - borderWidth - margin,
                baseline: 'bottom'
            };
        } else {
            return {
                x: circle.centerX,
                y: circle.centerY + circle.radius + borderWidth + margin,
                baseline: 'top'
            };
        }
    }
    
    // Public API
    return {
        calculatePerfectCircle: calculatePerfectCircle,
        calculateLandscapeCircles: calculateLandscapeCircles,
        calculatePortraitCircles: calculatePortraitCircles,
        calculateTextPosition: calculateTextPosition
    };
})();
