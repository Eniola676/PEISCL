# Setup Instructions

Complete guide to get your PEISCL site running.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- A code editor (VS Code recommended)
- Terminal/Command Line access

Check versions:
```bash
node --version  # Should be 18+
npm --version   # Should be 8+
```

## 🎯 Step-by-Step Setup

### Step 1: Install Dependencies

Open terminal in the project folder and run:

```bash
npm install
```

This installs:
- React 18
- TypeScript
- Vite (build tool)
- Tailwind CSS
- clsx & tailwind-merge (for className utilities)

**Expected output:**
```
added 150 packages in 30s
```

### Step 2: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 3: Open in Browser

Visit: http://localhost:5173

You should see the hero section with:
- Purple gradient background (from 21st.dev)
- Large "Master the skills that matter." heading
- "Explore courses" button

## ✅ Verification Checklist

Test these features:

- [ ] Hero section loads with gradient background
- [ ] "Explore courses" button scrolls to catalog
- [ ] All 4 track sections visible (Data & AI, Web & Office, etc.)
- [ ] "Register for this track" buttons open modal
- [ ] Registration form has 3 fields (Name, WhatsApp, Program)
- [ ] Form submission shows confirmation modal
- [ ] Animations work (fade-in, slide-up)
- [ ] Mobile responsive (test at 375px width)

## 🔧 Common Issues & Solutions

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 5173 already in use

**Solution:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Issue: TypeScript errors in editor

**Solution:**
1. Install VS Code TypeScript extension
2. Restart VS Code
3. Run type check:
```bash
npx tsc --noEmit
```

### Issue: Tailwind styles not working

**Solution:**
1. Verify `src/index.css` has Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. Restart dev server:
```bash
# Ctrl+C to stop, then
npm run dev
```

### Issue: Gradient background not showing

**Solution:**
1. Check browser console for errors (F12)
2. Verify `src/components/ui/gradient-blur-bg.tsx` exists
3. Clear browser cache (Ctrl+Shift+R)

## 🚀 Building for Production

### Test Production Build

```bash
# Create production build
npm run build

# Preview it
npm run preview
```

Visit: http://localhost:4173

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

Follow prompts:
1. Set up project: Y
2. Link to existing project: N
3. Project name: peiscl
4. Settings: (default)
5. Deploy: Y

## 🔌 Backend Setup (Optional)

To enable registration saving and WhatsApp messages:

### 1. Start Backend Server

In a **separate terminal**:

```bash
npm run server
```

**Expected output:**
```
========================================
PEISCL Registration Server
========================================
Server running on: http://localhost:3000
```

### 2. Configure WhatsApp API

Choose **ONE** option:

#### Option A: Twilio

1. Sign up: https://www.twilio.com/
2. Get WhatsApp Sandbox number
3. Edit `server.js` lines 17-19 with your credentials
4. Uncomment Twilio code (lines 71-87)
5. Install: `npm install twilio`
6. Restart server

#### Option B: WhatsApp Cloud API

1. Setup: https://developers.facebook.com/apps
2. Create Business App → WhatsApp → Get Started
3. Get Access Token & Phone Number ID
4. Edit `server.js` lines 22-23
5. Uncomment Cloud API code (lines 91-120)
6. Install: `npm install node-fetch@2`
7. Restart server

### 3. Test Registration

1. Open: http://localhost:5173
2. Click any "Register for this track" button
3. Fill form with test data
4. Submit
5. Check:
   - Browser console for "Saving registration"
   - `registrations.json` file created
   - WhatsApp message sent (if configured)

## 📱 Mobile Testing

### Local Network Testing

1. Start dev server with host flag:
```bash
npm run dev -- --host
```

2. Note your local IP (e.g., 192.168.1.100)

3. On mobile, visit: `http://YOUR_IP:5173`

### Test WhatsApp Share

Create a WhatsApp message:
```
Check out PEISCL courses: http://YOUR_IP:5173
```

## 📊 Admin Dashboard

View registrations:

1. Open: http://localhost:5173/admin.html
2. See all registrations in a table
3. Filter by track/status
4. Export to CSV

## 🎨 Customization Guide

### Change Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    DEFAULT: "hsl(243 75% 59%)", // Change this
  }
}
```

Or edit `src/index.css`:
```css
:root {
  --primary: 243 75% 59%; /* Indigo */
}
```

### Change Gradient

Edit `src/components/ui/gradient-blur-bg.tsx`:
```tsx
radial-gradient(circle 800px at 100% 200px, #d5c5ff, transparent)
```

Try:
- `#ffcce5` for pink
- `#ccf0ff` for blue
- `#d5ffc5` for green

### Add New Course

Edit `src/App.tsx`, find the `tracks` array:
```tsx
{
  number: "01",
  title: "Data & AI",
  courses: [
    { name: "Your New Course", tag: "New" }, // Add here
  ]
}
```

## 🆘 Getting Help

### Check Logs

Browser Console (F12):
- Errors appear in red
- Warnings in yellow

Terminal:
- Watch for TypeScript errors
- Check API responses

### Debug Steps

1. **Clear everything:**
```bash
rm -rf node_modules dist .vite
npm install
npm run dev
```

2. **Check file structure:**
```bash
tree src/  # or `ls -R src/` on Mac
```

Should show:
```
src/
├── components/
│   ├── ui/
│   │   └── gradient-blur-bg.tsx
│   ├── Hero.tsx
│   ├── TrackSection.tsx
│   ├── RegistrationModal.tsx
│   └── ConfirmationModal.tsx
├── lib/
│   └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
```

3. **Test TypeScript:**
```bash
npx tsc --noEmit
```

Should return no errors.

## 📞 Support

Still stuck? Contact:

- **Phone**: 08097545740
- **Email**: ictpanorama5@gmail.com

---

## Next Steps

Once setup is complete:

1. ✅ Test all features locally
2. ✅ Customize colors/content
3. ✅ Configure WhatsApp (optional)
4. ✅ Test on mobile
5. ✅ Deploy to production
6. ✅ Share link via WhatsApp

Happy coding! 🚀
