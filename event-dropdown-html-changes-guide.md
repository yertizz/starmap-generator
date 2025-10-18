# Event Dropdown HTML Changes Guide - July 1, 2025

## CRITICAL: HTML Changes You Need to Make Locally

**File to Modify:** `Star_Map_Generator.html`

### STEP 1: Add Suggestions Container

**Find this section in your HTML:**
```html
<select id="occasion" name="occasion" style="width: 330px; min-width: 300px;">
    <option value=" selected">Select an option</option>
    <option value="custom">Add Your Own...</option>
</select>
```

**Add this DIV immediately AFTER the closing `</select>` tag:**
```html
<div id="occasion-suggestions" class="suggestions-container" style="display: none;"></div>
```

**Complete section should look like:**
```html
<label for="occasion">Design/Event/Occasion:</label>
<select id="occasion" name="occasion" style="width: 330px; min-width: 300px;">
    <option value=" selected">Select an option</option>
    <option value="custom">Add Your Own...</option>
</select>
<div id="occasion-suggestions" class="suggestions-container" style="display: none;"></div>
```

### STEP 2: Add CSS Styling (Optional but Recommended)

**Find the `<style>` section in your HTML and add this CSS:**
```css
/* Event dropdown suggestions styling */
#occasion-suggestions {
    position: relative;
    width: 330px;
    max-height: 200px;
    overflow-y: auto;
    background: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 1000;
    margin-top: 2px;
}

#occasion-suggestions .suggestion-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
}

#occasion-suggestions .suggestion-item:hover {
    background-color: #f5f5f5;
}

#occasion-suggestions .suggestion-item:last-child {
    border-bottom: none;
}

#occasion-suggestions .suggestion-item span {
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

#occasion-suggestions .delete-suggestion {
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 12px;
    cursor: pointer;
    margin-left: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

#occasion-suggestions .delete-suggestion:hover {
    background: #c82333;
}
```

## WHAT THIS ACCOMPLISHES:

✅ **Suggestions Container:** Creates the dropdown container for Event history  
✅ **Proper Styling:** Matches the look of Address/Zip dropdowns  
✅ **Red "X" Delete Buttons:** For removing user-added items  
✅ **Responsive Design:** Adapts to the Event dropdown width  

## AFTER YOU MAKE THESE CHANGES:

1. **Save the HTML file**
2. **CMU (refresh the page)**
3. **Test the Event dropdown:**
   - Click on the Event dropdown
   - Type a custom event and press Enter
   - Focus on the dropdown to see history suggestions
   - Test the red "X" delete functionality

## JAVASCRIPT ALREADY IMPLEMENTED:

✅ **Server-side storage:** Uses existing PHP system  
✅ **50-item limit:** Event dropdown gets 50 items (vs 30 for Address/Zip)  
✅ **Red "X" delete:** Only for user-added items  
✅ **History management:** Full integration with existing system  

## NEXT STEPS AFTER HTML CHANGES:

1. Test basic functionality
2. Add your 38 predefined event options (Phase 3)
3. Final testing

**Ready for you to make these HTML changes locally!**
