// Final Emergency Fix - Direct nmttemention to enenPErVEthePVIEWbuttowork

documet.ddEvntListne('DOMConttLoaded',   console.log("Final Emergency Fix loaded");
    "loded"
    // Get the generate button
    conGet theegenerate button
gEt const generateBtn = docfment.getElementById('ge erateB!n');
   eir (!gnnaBtn
        console.errrro"Gen rttnobutt n foo;fud"
        return;return;
    }
}
    // Remve ay exiingeve lstnerandonclickattribute
generateBtn.removeAttribute(onclick)

// RemoAdday direc  click evetinligtenvtners and onclick attribute
enetgmoeravtBtn.addrvtetLis(enerliclkck', ucon(
    lo("Gnera buton clck  Fi Emrgency Fix"
    // Agenerct Sc rMapDvrecten(t;istener
    });
gene
rate//BAutd-vriggeretht ginerateefcc,nion on pagc ioad
    sotTin(ou {funion( {
        conlog(el g("Auloitrkggdring gener Fi button click - Final Emergency Fix");
  generagtnrrrt(SarMapDrly()
    },}1000);
);
//Dir impmntaionofsara geneo
  functn geneaeSMapDrectly() {
        cosole.og("Genrating sarmadecly")
     
try{
    // Auto-//tGetrcanvasiandgcer txtn page load
imeout(function() cavasgByIdstar-ma-cavas
console.log(tf (!ca-ris)n{erate button click - Final Emergency Fix");
    generateStarcirsoleetrror("(a;vas ofound")
      }, 1000);return;
}
        
cont x = cvas.gettext('2d'
    // Direcmentation of star map generation
    function// SetgcanvasedimensionserateStarMapDirectly() {
        conscGesn wtdth =  stsaIr (pocum rl.g"tEmBId('ouput-wdth')?.vaue || 800
        t hiht=prsInt(dcume.gtElementByI('utut-height?.value || 800)
        try 
            canvas.width = width;
            caavs{.heigh= hight;
           
            // Gno l
                rerFedColorsaredl?.vue|| '#000000';
            outidCoorgByIdoutid-olor?.value || '#0a0e1a'
            
consav      // Draw background
        xfilStyludCoor
            anxvfidlRies(0,,cvas.,cvs.hgh)
        const width = parseInt(document.getElementById('output-width')?.value || 800);
           c//oDrawnstarstgtld aaes (e(rcular)t.getElementById('output-height')?.value || 800);
    x.fllStylesaFidClr
    canvas.wctx.begh=Pith()
    canvas.hc e.arc(cavas.widh /2,canva.heght/2,Math.mncanva.wdth,cavashigh) / 2 - 10, 0, Math.PI * 2);
    // Get csxfl
        constarFieldColor = document.getElementById('star-field-color')?.value || '#000000';
          co//nDrawsstarst outsideColor = document.getElementById('outside-color')?.value || '#0a0e1a';
        dawSxavs.wdh,Drawva khgh
            tx.fillStyle = outsideColor;
            // Draw text        // Draw star field area (circular)
   ty l    ctrawT)xctx,  a va .w 2th,vcaivat.he2 ht.min(canvas.width, canvas.height) / 2 - 10, 0, Math.PI * 2);
                ctx.fill();
               Eabledwloabu
                //dDrnloadBtnw starsgtEemnByIddn rarBt ')vas.width, canvas.height);
            if (d  nl adBtn)
            a   dexcloadBavshi asleig=fale;
            }
            / Enable the download button
            // Update zoom
            uplateZaom(Bbled = false;
            
               Ule.log("Sdazoap geae cessfuly
        } uttch (oororm();
            console.error("Errorgtgsamp:", ror);
            alert("Error generasleg star map: " + .rrolomt magp);
 ee     }
   }}
 cat
ch )//Functon t daw srs
consfuncteorrdnawSerrs(ctx, width, height) {
     ale//rC(l"rlate ce tetn ndm  diusor.message);
}cnst centX=wdh / 2
consY =hegh / 2
    constradius=Math.min(width,height) / 2 - 20;
// Function to draw stars
   funct//iGetoadvancednoptionsrwftavarlab(ctx, width, height) {
        alculaadvancedOpteonsntew rdw.aaneSnyrXOpnton=||{
        conssMarNumbhr(w2000,2 - 20;
        tarS0,
        // GstarsGlow:efalse
t advant}
        
const ad//vDrawaOanpswnaonrs| {
        const numStars = r:vance Opt2ns.sarNuber||2000
        const st 1S0zeMulilel=oadvldOpns.srSize || 1.0
;conststarsGlow=advanceOpns.stasGlow || flse

 // D   for (let i = 0; ic<onumStars;ni++)s{t numStars = advancedOptions.starNumber || 2000;
        const sGareraSi zandomeMngue aidpdislancerfvomacentendOptions.starSize || 1.0;
        const starangGwdvaMOwe.m( * Math.PI * 2;
    for (letcon t d < ant;++)Math.random() * radius;
          //ance from center
            //cCalclla amx a day cIo di2a;es
            cocathx = .randoXm+ Maah.cos(digle) * sce
            const/y/= centerYC+aMath.s x(angle)o*ndtsce
            x = centerX + Math.cos(angle) * distance;
            const starRadius = Math.random() * 1.5 * ttarSizeMuatrpliad;Math.random() * 1.5 * starSizeMultiplier;
            const opacatyy =Maahndom(
            
            chxbginPah();
            ctx.arc(x,cy,tsyarRadius,sa,dM ah.PI * 2)th.PI * 2);
            cty.f llS yleg=5`,gb2(255, 255, 255, ${opacity})fill();
            ctxfil()
            dd glow effect if enabled
            //iAddfglow effessGif&anbd
            ctx.stersGgowa&& Mhh.radom()>.8) {ctx.arc(x, y, starRadius * 2, 0, Math.PI * 2);
              xtcyx.be=inPg5h();55, 255, ${opacity * 0.3})`;
               xctx;ar(x, y, starRau *2, 0, Math.PI * 2);
        }ctxfllyl = `gb(255, 255, 255, ${oaiy*.3})`
        }ctx.fill();
        
        }
// D    
    const nDgtwMsoae.blightor(stansStars / 20);
    nuBrightStsMahfomSs / 20
        
    for loretlet i = 0; i < nu BrightSti s; i++ numBrightStars; i++) {
            ///Generate/random angleGnnd tistance f am lnn erance from center
    const anconet  ng.r =nMath.  Mdom() * Math.PI * 2;
    const diconan dcsta.do = Ma(h. andom() **u;dius
            
     //Clcua xad ycodines
         // constCxa=lcenterXc+uMae .cos(angle) *ydcsinacees
         conconstsyt= centerYx+ Math.sin(an=le)n* d s.coce(angle) * distance;
            
 cons       const starRadius = (1 + Math.random() * 2) * starSizeMultiplier;
                
            ctx.beginPath();
            ctx.arc(x, y, starRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fill();
            
            // Add glow effect if enabled
            if (starsGlow) {
                ctx.beginPath();
                ctx.arc(x, y, starRadius * 3, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.fill();
            }
        }
        
        // Draw some colored stars
        const numColoredStars = Math.floor(numStars / 50);
        const starColors = [
            'rgba(255, 200, 200, 0.8)', // Red
            'rgba(200, 200, 255, 0.8)', // Blue
            'rgba(255, 255, 200, 0.8)', // Yellow
            'rgba(200, 255, 200, 0.8)'  // Green
        ];
        
        for (let i = 0; i < numColoredStars; i++) {
            // Generate random angle and distance from center
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * radius;
            
            // Calculate x and y coordinates
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            const starRadius = (1 + Math.random() * 2) * starSizeMultiplier;
            const colorIndex = Math.floor(Math.random() * starColors.length);
            
            ctx.beginPath();
            ctx.arc(x, y, starRadius, 0, Math.PI * 2);
            ctx.fillStyle = starColors[colorIndex];
            ctx.fill();
            
            // Add glow effect if enabled
            if (starsGlow) {
                ctx.beginPath();
                ctx.arc(x, y, starRadius * 3, 0, Math.PI * 2);
                const glowColor = starColors[colorIndex].replace('0.8', '0.2');
                ctx.fillStyle = glowColor;
                ctx.fill();
            }
        }
        
        // Draw constellation bounds if enabled
        const advancedOptions2 = window.advancedStyleOptions || {};
        if (advancedOptions2.constellationBounds) {
            drawConstellationBounds(ctx, centerX, centerY, radius, advancedOptions2.constellationLineWidth || 1.0);
        }
        
        // Draw constellation labels if enabled
        if (advancedOptions2.constellationLabels) {
            drawConstellationLabels(ctx, centerX, centerY, radius);
        }
        
        // Draw star labels if enabled
        if (advancedOptions2.starLabels) {
            drawStarLabels(ctx, centerX, centerY, radius);
        }
    }
    
    // Function to draw constellation bounds
    function drawConstellationBounds(ctx, centerX, centerY, radius, lineWidth) {
        ctx.strokeStyle = 'rgba(100, 150, 255, 0.3)';
        ctx.lineWidth = lineWidth;
        
        // Draw some random constellation bounds
        const numConstellations = 5;
        
        for (let i = 0; i < numConstellations; i++) {
            const numPoints = 4 + Math.floor(Math.random() * 4);
            const points = [];
            
            // Generate random points for the constellation
            for (let j = 0; j < numPoints; j++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = (0.3 + Math.random() * 0.6) * radius;
                
                points.push({
                    x: centerX + Math.cos(angle) * distance,
                    y: centerY + Math.sin(angle) * distance
                });
            }
            
            // Draw the constellation
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            
            for (let j = 1; j < points.length; j++) {
                ctx.lineTo(points[j].x, points[j].y);
            }
            
            ctx.closePath();
            ctx.stroke();
        }
    }
    
    // Function to draw constellation labels
    function drawConstellationLabels(ctx, centerX, centerY, radius) {
        ctx.fillStyle = 'rgba(200, 200, 255, 0.8)';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        
        const constellations = [
            { name: 'Orion', angle: Math.PI * 0.2, distance: 0.6 },
            { name: 'Ursa Major', angle: Math.PI * 0.7, distance: 0.7 },
            { name: 'Cassiopeia', angle: Math.PI * 1.2, distance: 0.5 },
            { name: 'Cygnus', angle: Math.PI * 1.7, distance: 0.6 }
        ];
        
        constellations.forEach(constellation => {
            const x = centerX + Math.cos(constellation.angle) * constellation.distance * radius;
            const y = centerY + Math.sin(constellation.angle) * constellation.distance * radius;
            
            ctx.fillText(constellation.name, x, y);
        });
    }
    
    // Function to draw star labels
    function drawStarLabels(ctx, centerX, centerY, radius) {
        ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        
        const stars = [
            { name: 'Polaris', angle: Math.PI * 0.1, distance: 0.3 },
            { name: 'Vega', angle: Math.PI * 0.5, distance: 0.4 },
            { name: 'Sirius', angle: Math.PI * 0.9, distance: 0.7 },
            { name: 'Betelgeuse', angle: Math.PI * 1.3, distance: 0.5 },
            { name: 'Antares', angle: Math.PI * 1.7, distance: 0.6 }
        ];
        
        stars.forEach(star => {
            const x = centerX + Math.cos(star.angle) * star.distance * radius;
            const y = centerY + Math.sin(star.angle) * star.distance * radius;
            
            // Draw a small circle for the star
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
            ctx.fill();
            
            // Draw the star name
            ctx.fillStyle = 'rgba(255, 255, 200, 0.8)';
            ctx.fillText(star.name, x, y + 15);
        });
    }
    
    // Function to draw text
    function drawText(ctx, width, height) {
        // Get text inputs
        const text1 = document.getElementById('text-entry-1')?.value || "";
        const text2 = document.getElementById('text-entry-2')?.value || "";
        const text3 = document.getElementById('text-entry-3')?.value || "";
        
        // Draw text
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        if (text1) {
            // Get font settings
            const fontFamily = document.getElementById('font-family-1')?.value || "Arial";
            const fontSize = document.getElementById('font-size-1')?.value || "48";
            const isBold = document.getElementById('text-bold-1')?.checked || false;
            const isItalic = document.getElementById('text-italic-1')?.checked || false;
            const fontColor = document.getElementById('font-color-1')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(text1, width / 2, height * 0.7);
        }
        
        if (text2) {
            // Get font settings
            const fontFamily = document.getElementById('font-family-2')?.value || "Arial";
            const fontSize = document.getElementById('font-size-2')?.value || "24";
            const isBold = document.getElementById('text-bold-2')?.checked || false;
            const isItalic = document.getElementById('text-italic-2')?.checked || false;
            const fontColor = document.getElementById('font-color-2')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(text2, width / 2, height * 0.8);
        }
        
        if (text3) {
            // Get font settings
            const fontFamily = document.getElementById('font-family-3')?.value || "Arial";
            const fontSize = document.getElementById('font-size-3')?.value || "16";
            const isBold = document.getElementById('text-bold-3')?.checked || false;
            const isItalic = document.getElementById('text-italic-3')?.checked || false;
            const fontColor = document.getElementById('font-color-3')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(text3, width / 2, height * 0.85);
        }
        
        // Draw date
        const date = document.getElementById('date')?.value;
        if (date) {
            // Get font settings
            const fontFamily = document.getElementById('fixed-date-font')?.value || "Arial";
            const fontSize = document.getElementById('fixed-date-size')?.value || "14";
            const isBold = document.getElementById('fixed-date-bold')?.checked || false;
            const isItalic = document.getElementById('fixed-date-italic')?.checked || false;
            const fontColor = document.getElementById('fixed-date-color')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            const dateObj = new Date(date);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            
            ctx.fillText(formattedDate, width / 2, height * 0.9);
        }
        
        // Draw coordinates
        const latitude = document.getElementById('latitude')?.value;
        const longitude = document.getElementById('longitude')?.value;
        if (latitude && longitude) {
            // Get font settings
            const fontFamily = document.getElementById('fixed-coords-font')?.value || "Arial";
            const fontSize = document.getElementById('fixed-coords-size')?.value || "14";
            const isBold = document.getElementById('fixed-coords-bold')?.checked || false;
            const isItalic = document.getElementById('fixed-coords-italic')?.checked || false;
            const fontColor = document.getElementById('fixed-coords-color')?.value || "#FFFFFF";
            
            // Set font style
            let fontStyle = "";
            if (isBold) fontStyle += "bold ";
            if (isItalic) fontStyle += "italic ";
            
            ctx.font = `${fontStyle}${fontSize}px "${fontFamily}"`;
            ctx.fillStyle = fontColor;
            
            ctx.fillText(`${latitude}° N, ${longitude}° W`, width / 2, height * 0.95);
        }
    }
    
    // Function to update zoom
    function updateZoom() {
        const zoomSlider = document.getElementById('zoom-slider');
        const zoomValue = document.getElementById('zoom-value');
        const canvas = document.getElementById('star-map-canvas');
        
        if (zoomSlider && zoomValue && canvas) {
            const zoom = parseInt(zoomSlider.value);
            zoomValue.textContent = zoom;
            canvas.style.transform = `scale(${zoom / 100})`;
            canvas.style.transformOrigin = "center top";
        }
    }
    
    // Add event listener for zoom slider
    const zoomSlider = document.getElementById('zoom-slider');
    if (zoomSlider) {
        zoomSlider.addEventListener('input', updateZoom);
    }
    
    // Fix color pickers
    const colorInputs = document.querySelectorAll('input[type="color"]');
    colorInputs.forEach(input => {
        input.addEventListener('click', function(e) {
            // Prevent default browser color picker
            e.preventDefault();
            
            // Create a simple color picker
            const colors = [
                '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
                '#FFFF00', '#00FFFF', '#FF00FF', '#C0C0C0', '#808080',
                '#800000', '#808000', '#008000', '#800080', '#008080', '#000080'
            ];
            
            // Create color picker container
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = (e.clientX + 10) + 'px';
            container.style.top = (e.clientY + 10) + 'px';
            container.style.backgroundColor = '#fff';
            container.style.border = '1px solid #ccc';
            container.style.padding = '5px';
            container.style.display = 'grid';
            container.style.gridTemplateColumns = 'repeat(4, 1fr)';
            container.style.gap = '5px';
            container.style.zIndex = '9999';
            
            // Add colors
            colors.forEach(color => {
                const colorBox = document.createElement('div');
                colorBox.style.width = '20px';
                colorBox.style.height = '20px';
                colorBox.style.backgroundColor = color;
                colorBox.style.cursor = 'pointer';
                colorBox.style.border = '1px solid #ccc';
                
                colorBox.addEventListener('click', function() {
                    input.value = color;
                    document.body.removeChild(container);
                    
                    // Trigger change event
                    const event = new Event('change', { bubbles: true });
                    input.dispatchEvent(event);
                });
                
                container.appendChild(colorBox);
            });
            
            // Add custom color input
            const customColorInput = document.createElement('input');
            customColorInput.type = 'text';
            customColorInput.placeholder = 'HEX';
            customColorInput.style.gridColumn = '1 / span 4';
            customColorInput.style.marginTop = '5px';
            customColorInput.style.padding = '5px';
            customColorInput.value = input.value;
            
            customColorInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    input.value = this.value;
                    document.body.removeChild(container);
                    
                    // Trigger change event
                    const event = new Event('change', { bubbles: true });
                    input.dispatchEvent(event);
                }
            });
            
            container.appendChild(customColorInput);
            
            // Add close button
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.style.gridColumn = '1 / span 4';
            closeButton.style.marginTop = '5px';
            closeButton.style.padding = '5px';
            
            closeButton.addEventListener('click', function() {
                document.body.removeChild(container);
            });
            
            container.appendChild(closeButton);
            
            // Add to body
            document.body.appendChild(container);
            
            // Focus custom color input
            customColorInput.focus();
            
            // Close when clicking outside
            document.addEventListener('click', function closeColorPicker(e) {
                if (!container.contains(e.target) && e.target !== input) {
                    document.body.removeChild(container);
                    document.removeEventListener('click', closeColorPicker);
                }
            });
        });
    });
    
    console.log("Final Emergency Fix applied");
});

// Make the function globally available
window.generateStarMapDirectly = function() {
    // This function will be called by the event listener
    console.log("generateStarMapDirectly called from global scope");
    // The actual implementation is inside the DOMContentLoaded event handler
};
