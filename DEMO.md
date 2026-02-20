# 🎬 Demo Guide - BDD Visual Recorder

## 🚀 Quick Demo (5 minutes)

### Step 1: Start the Application
```bash
./start.sh
```
Wait for: "✅ Application is ready!"

### Step 2: Open in Browser
Navigate to: **http://localhost:5173**

### Step 3: Fill in Details
- **Project Name**: `MyProject`
- **Scenario Name**: `Login Test`
- **URL**: `https://example.com` (or any website)

### Step 4: Launch Browser
Click **🚀 Launch** button
- A Playwright browser window will open
- You'll see "✓ Browser launched successfully"

### Step 5: Add Steps
Click **+ Add Step** to add more steps. Example:
1. `Given` - "user is on the login page"
2. `When` - "user enters credentials"
3. `Then` - "user clicks login button"

### Step 6: Record Actions

**For Step 1:**
1. Click **⏺ Record** button
2. **Watch for**:
   - 🔴 Red "RECORDING" banner appears at top of browser
   - Record button turns red and pulses
   - Step row turns pink

3. **In the browser**:
   - Hover over elements → See pink highlight
   - See selector tooltip (e.g., `#email`, `.button`)
   - Click or type → Actions captured instantly

4. Click **⏹ Stop Recording**
   - Banner disappears
   - View button shows count: "👁 View (3)"

**Repeat for other steps**

### Step 7: View Generated Code
Click **👁 View** button on any step

You'll see 4 tabs:
1. **Gherkin** - BDD feature file
2. **Page Object** - Constructor-based POM
3. **Step Definitions** - CucumberJS steps
4. **Raw Playwright** - Direct Playwright code

### Step 8: Export Framework
Click **📦 Export** button
- Complete framework generated in `backend/exports/`
- Ready to run with `npm install && npx cucumber-js`

## 🎯 What to Look For

### ✅ Recording Indicators
- [ ] Red banner: "🔴 RECORDING - Click or type to capture actions"
- [ ] Pink highlight on hover
- [ ] Selector tooltip showing exact selector
- [ ] Pulsing record button
- [ ] Pink step row background

### ✅ Action Capture
- [ ] Click actions captured
- [ ] Input/fill actions captured with values
- [ ] Action count updates in real-time
- [ ] View button enables after recording

### ✅ Code Generation
- [ ] Gherkin has proper format
- [ ] Page Object has constructor with locators
- [ ] Step Definitions have method calls
- [ ] Raw Playwright code is runnable

## 🐛 Troubleshooting

**View button still disabled?**
- Make sure you clicked elements in the browser
- Check browser console for errors
- Stop and start recording again

**No highlight in browser?**
- Recording might not have started
- Check backend logs: `tail -f logs/backend.log`
- Refresh browser and try again

**Code is empty?**
- Make sure actions were captured (check console)
- Try recording again
- Check that WebSocket is connected

## 📸 Expected Visual Flow

```
1. Click Record
   ↓
2. Red banner appears in browser
   ↓
3. Hover element → Pink highlight + selector tooltip
   ↓
4. Click/Type → Action captured (see console)
   ↓
5. Stop Recording → View button shows count
   ↓
6. Click View → See all generated code
```

## 🎊 Success Criteria

You've successfully used the tool when:
- ✅ Browser launches and navigates to URL
- ✅ Recording shows visual indicators
- ✅ Actions are captured (View button enabled)
- ✅ Generated code is complete and correct
- ✅ Export creates runnable framework

## 💡 Pro Tips

1. **Use data-test-id**: Add `data-test-id` attributes for stable selectors
2. **Record step by step**: Record each step separately for clarity
3. **Check console**: Watch browser console for captured actions
4. **Test export**: Run exported framework to verify it works
5. **Save often**: Click Save button to preserve your work

## 🎥 Example Recording Session

```
Project: E-commerce Test
Scenario: User Login

Step 1: Given user is on login page
  Record: Navigate to login page
  Actions: 1 (goto)

Step 2: When user enters credentials
  Record: Fill email, fill password
  Actions: 2 (fill, fill)

Step 3: Then user clicks login
  Record: Click login button
  Actions: 1 (click)

Total: 4 actions captured
Export: Complete framework ready!
```

Enjoy recording! 🎉
