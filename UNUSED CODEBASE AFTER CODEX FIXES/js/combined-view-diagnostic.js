/* START OF CODE - Cline - 2025-05-31 7:10 PM File: js/combined-view-diagnostic.js */

/**
 * Combined View Diagnostic Tool
 * 
 * This script provides diagnostic capabilities to analyze and debug the combined view
 * functionality in the Star Map Generator application. It tracks canvas operations,
 * image loading, and rendering events to identify the root causes of display issues.
 */

(function() {
    // Configuration
    const config = {
        enableLogging: true,
        logTimestamps: true,
        captureCanvasSnapshots: true,
        trackImageData: true,
        monitorDOMChanges: true,
        snapshotInterval: 500, // ms
    };

    // Diagnostic state
    const state = {
        events: [],
        canvasSnapshots: [],
        imageData: {
            starMap: null,
            streetMap: null
        },
        originalFunctions: {},
        startTime: Date.now()
    };

    // Utility functions
    const utils = {
        log: function(message, type = 'info') {
            if (!config.enableLogging) return;
            
            const timestamp = config.logTimestamps ? `[${Date.now() - state.startTime}ms] ` : '';
            const prefix = '🔍 DIAGNOSTIC: ';
            
            switch (type) {
                case 'error':
                    console.error(prefix + timestamp + message);
                    break;
                case 'warn':
                    console.warn(prefix + timestamp + message);
                    break;
                case 'success':
                    console.log('%c' + prefix + timestamp + message, 'color: green; font-weight: bold;');
                    break;
                default:
                    console.log(prefix + timestamp + message);
            }
            
            // Record event
            state.events.push({
                time: Date.now() - state.startTime,
                type: type,
                message: message
            });
        },
        
        takeCanvasSnapshot: function() {
            if (!config.captureCanvasSnapshots) return;
            
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                utils.log('Cannot take snapshot: canvas not found', 'warn');
                return;
            }
            
            try {
                // Create a copy of the canvas
                const snapshotCanvas = document.createElement('canvas');
                snapshotCanvas.width = canvas.width;
                snapshotCanvas.height = canvas.height;
                const ctx = snapshotCanvas.getContext('2d');
                ctx.drawImage(canvas, 0, 0);
                
                // Store snapshot data
                const snapshot = {
                    time: Date.now() - state.startTime,
                    dataUrl: snapshotCanvas.toDataURL(),
                    dimensions: {
                        width: canvas.width,
                        height: canvas.height
                    },
                    style: {
                        width: canvas.style.width,
                        height: canvas.style.height,
                        maxWidth: canvas.style.maxWidth,
                        maxHeight: canvas.style.maxHeight
                    }
                };
                
                state.canvasSnapshots.push(snapshot);
                utils.log(`Canvas snapshot taken: ${snapshot.dimensions.width}x${snapshot.dimensions.height}`);
                
                return snapshot;
            } catch (error) {
                utils.log(`Error taking canvas snapshot: ${error.message}`, 'error');
            }
        },
        
        captureImageData: function(image, type) {
            if (!config.trackImageData || !image) return;
            
            try {
                // Create a canvas to draw the image
                const canvas = document.createElement('canvas');
                canvas.width = image.naturalWidth || image.width;
                canvas.height = image.naturalHeight || image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
                
                // Store image data
                state.imageData[type] = {
                    time: Date.now() - state.startTime,
                    dataUrl: canvas.toDataURL(),
                    dimensions: {
                        width: canvas.width,
                        height: canvas.height
                    },
                    source: image.src
                };
                
                utils.log(`Captured ${type} image data: ${canvas.width}x${canvas.height}`);
            } catch (error) {
                utils.log(`Error capturing ${type} image data: ${error.message}`, 'error');
            }
        },
        
        generateReport: function() {
            utils.log('Generating diagnostic report...', 'info');
            
            const report = {
                timestamp: new Date().toISOString(),
                events: state.events,
                canvasSnapshots: state.canvasSnapshots.length,
                imageData: {
                    starMap: state.imageData.starMap ? 'Captured' : 'Not captured',
                    streetMap: state.imageData.streetMap ? 'Captured' : 'Not captured'
                },
                canvasDimensions: utils.getCurrentCanvasDimensions(),
                canvasContainerStyle: utils.getCanvasContainerStyle(),
                scriptInteractions: utils.detectScriptInteractions()
            };
            
            console.log('📊 DIAGNOSTIC REPORT:', report);
            
            // Create a downloadable version
            const reportBlob = new Blob([JSON.stringify(report, null, 2)], {type: 'application/json'});
            const reportUrl = URL.createObjectURL(reportBlob);
            
            // Add download link to the page
            const downloadLink = document.createElement('a');
            downloadLink.href = reportUrl;
            downloadLink.download = `star-map-diagnostic-${Date.now()}.json`;
            downloadLink.textContent = 'Download Diagnostic Report';
            downloadLink.style.position = 'fixed';
            downloadLink.style.bottom = '10px';
            downloadLink.style.right = '10px';
            downloadLink.style.zIndex = '9999';
            downloadLink.style.backgroundColor = '#007bff';
            downloadLink.style.color = 'white';
            downloadLink.style.padding = '10px 15px';
            downloadLink.style.borderRadius = '5px';
            downloadLink.style.textDecoration = 'none';
            document.body.appendChild(downloadLink);
            
            utils.log('Diagnostic report generated and download link added', 'success');
            
            return report;
        },
        
        getCurrentCanvasDimensions: function() {
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) return null;
            
            return {
                width: canvas.width,
                height: canvas.height,
                styleWidth: canvas.style.width,
                styleHeight: canvas.style.height,
                styleMaxWidth: canvas.style.maxWidth,
                styleMaxHeight: canvas.style.maxHeight,
                offsetWidth: canvas.offsetWidth,
                offsetHeight: canvas.offsetHeight,
                clientWidth: canvas.clientWidth,
                clientHeight: canvas.clientHeight
            };
        },
        
        getCanvasContainerStyle: function() {
            const container = document.querySelector('.canvas-container');
            if (!container) return null;
            
            return {
                height: container.style.height,
                minHeight: container.style.minHeight,
                maxHeight: container.style.maxHeight,
                overflow: container.style.overflow,
                backgroundColor: container.style.backgroundColor,
                display: container.style.display,
                flexDirection: container.style.flexDirection,
                alignItems: container.style.alignItems,
                justifyContent: container.style.justifyContent,
                offsetHeight: container.offsetHeight,
                clientHeight: container.clientHeight,
                scrollHeight: container.scrollHeight
            };
        },
        
        detectScriptInteractions: function() {
            const scripts = Array.from(document.scripts).map(script => script.src || 'inline');
            
            // Look for specific scripts we know might interact with the canvas
            const relevantScripts = [
                'absolute-final-fix.js',
                'circle-fix-direct.js',
                'combined-views-fix.js',
                'star-map-circle-fix.js',
                'perfect-circle-calculator.js',
                'canvas-drawing-utils.js'
            ];
            
            const detected = scripts.filter(src => 
                relevantScripts.some(name => src.includes(name))
            );
            
            return {
                allScripts: scripts.length,
                relevantScripts: detected
            };
        }
    };

    // Monitoring functions
    const monitor = {
        setupCanvasMonitoring: function() {
            utils.log('Setting up canvas monitoring');
            
            // Take initial snapshot
            utils.takeCanvasSnapshot();
            
            // Set up periodic snapshots
            setInterval(utils.takeCanvasSnapshot, config.snapshotInterval);
            
            // Monitor canvas property changes
            const canvas = document.getElementById('star-map-canvas');
            if (canvas) {
                // Store original dimensions
                const originalWidth = canvas.width;
                const originalHeight = canvas.height;
                
                // Override width and height setters
                Object.defineProperties(canvas, {
                    width: {
                        get: function() { return this._width || originalWidth; },
                        set: function(value) {
                            utils.log(`Canvas width changed: ${this._width || originalWidth} -> ${value}`);
                            this._width = value;
                        }
                    },
                    height: {
                        get: function() { return this._height || originalHeight; },
                        set: function(value) {
                            utils.log(`Canvas height changed: ${this._height || originalHeight} -> ${value}`);
                            this._height = value;
                        }
                    }
                });
                
                // Monitor style changes
                const originalSetAttribute = canvas.setAttribute;
                canvas.setAttribute = function(name, value) {
                    if (name === 'style' || name.startsWith('style.')) {
                        utils.log(`Canvas style attribute changed: ${name} = ${value}`);
                    }
                    return originalSetAttribute.call(this, name, value);
                };
                
                utils.log('Canvas property monitoring set up', 'success');
            } else {
                utils.log('Canvas not found, will retry later', 'warn');
                setTimeout(monitor.setupCanvasMonitoring, 1000);
            }
        },
        
        interceptImageLoading: function() {
            utils.log('Setting up image loading interception');
            
            // Override the global Image constructor
            const OriginalImage = window.Image;
            window.Image = function() {
                const img = new OriginalImage();
                
                // Add load event listener to capture image data
                img.addEventListener('load', function() {
                    // Try to determine if this is a star map or street map
                    let imageType = 'unknown';
                    if (this.src.includes('staticmap') || this.src.includes('maps.googleapis.com')) {
                        imageType = 'streetMap';
                        utils.log(`Street map image loaded: ${this.width}x${this.height}`);
                    } else if (this.src.includes('star') || this.src.includes('wikisky')) {
                        imageType = 'starMap';
                        utils.log(`Star map image loaded: ${this.width}x${this.height}`);
                    } else {
                        utils.log(`Unknown image loaded: ${this.width}x${this.height} from ${this.src}`);
                        return;
                    }
                    
                    // Capture image data
                    utils.captureImageData(this, imageType);
                });
                
                return img;
            };
            
            // Maintain prototype chain
            window.Image.prototype = OriginalImage.prototype;
            
            utils.log('Image loading interception set up', 'success');
        },
        
        interceptCanvasContext: function() {
            utils.log('Setting up canvas context method interception');
            
            const canvas = document.getElementById('star-map-canvas');
            if (!canvas) {
                utils.log('Canvas not found, will retry later', 'warn');
                setTimeout(monitor.interceptCanvasContext, 1000);
                return;
            }
            
            const context = canvas.getContext('2d');
            if (!context) {
                utils.log('Canvas context not available', 'error');
                return;
            }
            
            // Methods to intercept
            const methodsToIntercept = [
                'clearRect', 'fillRect', 'drawImage', 
                'arc', 'beginPath', 'closePath', 'clip',
                'stroke', 'fill'
            ];
            
            // Store original methods and replace with intercepted versions
            methodsToIntercept.forEach(method => {
                if (typeof context[method] === 'function') {
                    state.originalFunctions[method] = context[method];
                    
                    context[method] = function() {
                        utils.log(`Canvas context.${method} called with ${arguments.length} arguments`);
                        
                        // Special handling for drawImage to identify what's being drawn
                        if (method === 'drawImage' && arguments[0]) {
                            const image = arguments[0];
                            const sourceInfo = image.src || 'unknown source';
                            utils.log(`Drawing image from: ${sourceInfo}`);
                            
                            // Try to determine if this is a star map or street map
                            if (sourceInfo.includes('staticmap') || sourceInfo.includes('maps.googleapis.com')) {
                                utils.log(`Street map being drawn to canvas`);
                            } else if (sourceInfo.includes('star') || sourceInfo.includes('wikisky')) {
                                utils.log(`Star map being drawn to canvas`);
                            }
                        }
                        
                        // Call original method
                        const result = state.originalFunctions[method].apply(this, arguments);
                        
                        // Take a snapshot after significant operations
                        if (['clearRect', 'fillRect', 'drawImage', 'fill'].includes(method)) {
                            setTimeout(utils.takeCanvasSnapshot, 50);
                        }
                        
                        return result;
                    };
                }
            });
            
            utils.log('Canvas context method interception set up', 'success');
        },
        
        interceptCombinedViewButtons: function() {
            utils.log('Setting up combined view button interception');
            
            // Landscape button
            const landscapeBtn = document.getElementById('view-star-street-landscape-btn');
            if (landscapeBtn) {
                const originalOnClick = landscapeBtn.onclick;
                landscapeBtn.onclick = function(e) {
                    utils.log('Combined View (Landscape) button clicked');
                    
                    // Take before snapshot
                    utils.takeCanvasSnapshot();
                    
                    // Call original handler
                    if (originalOnClick) {
                        originalOnClick.call(this, e);
                    }
                    
                    // Take after snapshots at intervals
                    setTimeout(utils.takeCanvasSnapshot, 100);
                    setTimeout(utils.takeCanvasSnapshot, 500);
                    setTimeout(utils.takeCanvasSnapshot, 1000);
                    
                    // Generate report after a delay
                    setTimeout(utils.generateReport, 2000);
                };
                utils.log('Intercepted Combined View (Landscape) button');
            }
            
            // Portrait button
            const portraitBtn = document.getElementById('view-star-street-portrait-btn');
            if (portraitBtn) {
                const originalOnClick = portraitBtn.onclick;
                portraitBtn.onclick = function(e) {
                    utils.log('Combined View (Portrait) button clicked');
                    
                    // Take before snapshot
                    utils.takeCanvasSnapshot();
                    
                    // Call original handler
                    if (originalOnClick) {
                        originalOnClick.call(this, e);
                    }
                    
                    // Take after snapshots at intervals
                    setTimeout(utils.takeCanvasSnapshot, 100);
                    setTimeout(utils.takeCanvasSnapshot, 500);
                    setTimeout(utils.takeCanvasSnapshot, 1000);
                    
                    // Generate report after a delay
                    setTimeout(utils.generateReport, 2000);
                };
                utils.log('Intercepted Combined View (Portrait) button');
            }
            
            utils.log('Combined view button interception set up', 'success');
        },
        
        monitorDOMChanges: function() {
            if (!config.monitorDOMChanges) return;
            
            utils.log('Setting up DOM change monitoring');
            
            // Create a MutationObserver to watch for changes to the canvas and its container
            const observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'attributes') {
                        utils.log(`Attribute '${mutation.attributeName}' changed on ${mutation.target.tagName}#${mutation.target.id || 'unknown'}`);
                    } else if (mutation.type === 'childList') {
                        if (mutation.addedNodes.length > 0) {
                            utils.log(`${mutation.addedNodes.length} nodes added to ${mutation.target.tagName}#${mutation.target.id || 'unknown'}`);
                        }
                        if (mutation.removedNodes.length > 0) {
                            utils.log(`${mutation.removedNodes.length} nodes removed from ${mutation.target.tagName}#${mutation.target.id || 'unknown'}`);
                        }
                    }
                });
            });
            
            // Start observing the canvas
            const canvas = document.getElementById('star-map-canvas');
            if (canvas) {
                observer.observe(canvas, { 
                    attributes: true, 
                    attributeFilter: ['style', 'width', 'height', 'class'] 
                });
                utils.log('Now monitoring canvas for attribute changes');
            }
            
            // Start observing the canvas container
            const container = document.querySelector('.canvas-container');
            if (container) {
                observer.observe(container, { 
                    attributes: true, 
                    childList: true,
                    attributeFilter: ['style', 'class'] 
                });
                utils.log('Now monitoring canvas container for changes');
            }
            
            utils.log('DOM change monitoring set up', 'success');
        }
    };

    // Initialization
    function initialize() {
        utils.log('Initializing Combined View Diagnostic Tool', 'info');
        
        // Set up monitoring
        monitor.setupCanvasMonitoring();
        monitor.interceptImageLoading();
        monitor.interceptCanvasContext();
        monitor.interceptCombinedViewButtons();
        monitor.monitorDOMChanges();
        
        // Take initial snapshot
        utils.takeCanvasSnapshot();
        
        // Add diagnostic control panel
        addDiagnosticPanel();
        
        utils.log('Combined View Diagnostic Tool initialized', 'success');
    }
    
    function addDiagnosticPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        panel.style.color = 'white';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.zIndex = '9999';
        panel.style.fontSize = '12px';
        panel.style.width = '200px';
        
        panel.innerHTML = `
            <h3 style="margin: 0 0 10px 0; font-size: 14px;">Diagnostic Tools</h3>
            <button id="diag-take-snapshot" style="margin-bottom: 5px; width: 100%;">Take Canvas Snapshot</button>
            <button id="diag-generate-report" style="margin-bottom: 5px; width: 100%;">Generate Report</button>
            <button id="diag-toggle-logging" style="margin-bottom: 5px; width: 100%;">Toggle Logging</button>
            <div style="margin-top: 10px; font-size: 10px;">
                Events: <span id="diag-event-count">0</span> | 
                Snapshots: <span id="diag-snapshot-count">0</span>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add event listeners
        document.getElementById('diag-take-snapshot').addEventListener('click', function() {
            utils.takeCanvasSnapshot();
            updateDiagnosticPanel();
        });
        
        document.getElementById('diag-generate-report').addEventListener('click', function() {
            utils.generateReport();
            updateDiagnosticPanel();
        });
        
        document.getElementById('diag-toggle-logging').addEventListener('click', function() {
            config.enableLogging = !config.enableLogging;
            this.textContent = config.enableLogging ? 'Disable Logging' : 'Enable Logging';
            utils.log(`Logging ${config.enableLogging ? 'enabled' : 'disabled'}`);
            updateDiagnosticPanel();
        });
        
        // Update counts periodically
        function updateDiagnosticPanel() {
            document.getElementById('diag-event-count').textContent = state.events.length;
            document.getElementById('diag-snapshot-count').textContent = state.canvasSnapshots.length;
        }
        
        setInterval(updateDiagnosticPanel, 1000);
        
        utils.log('Diagnostic panel added', 'success');
    }
    
    // Start when the DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Also initialize on window load to ensure all resources are available
    window.addEventListener('load', function() {
        // Take another snapshot after everything is loaded
        utils.takeCanvasSnapshot();
        
        // Check if we need to re-initialize (in case DOMContentLoaded already fired)
        if (state.events.length === 0) {
            initialize();
        }
    });
    
    // Expose diagnostic API for console use
    window.StarMapDiagnostic = {
        takeSnapshot: utils.takeCanvasSnapshot,
        generateReport: utils.generateReport,
        getState: function() { return state; },
        getConfig: function() { return config; },
        setConfig: function(newConfig) { 
            Object.assign(config, newConfig);
            utils.log('Configuration updated', 'info');
            return config;
        }
    };
})();

/* END OF CODE - Cline - 2025-05-31 7:10 PM File: js/combined-view-diagnostic.js */
