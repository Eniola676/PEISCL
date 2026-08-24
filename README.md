# PEISCL — Tech Skills Training

A minimalist, Apple-inspired course catalog and registration site built with React, TypeScript, and Tailwind CSS. Features a beautiful gradient blur background from [21st.dev](https://21st.dev) and optimized for mobile WhatsApp traffic.

## ✨ Features

- **Apple-inspired design**: Extreme whitespace, confident typography, subtle animations
- **React + TypeScript**: Modern, type-safe development
- **Tailwind CSS**: Utility-first styling with custom design tokens
- **Gradient blur background**: Beautiful purple gradient grid from 21st.dev
- **Mobile-first**: Optimized for WhatsApp status link traffic
- **Four training tracks**: Data & AI, Web & Office, Digital & Security, Systems & Startup
- **Instant registration**: Name, WhatsApp, Course selection
- **WhatsApp confirmation**: Automatic message on registration
- **Fast & lightweight**: Vite for instant dev server and optimized builds

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:5173
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
Panaroma/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── gradient-blur-bg.tsx    # 21st.dev gradient background
│   │   ├── Hero.tsx                    # Hero section with gradient
│   │   ├── TrackSection.tsx            # Course track sections
│   │   ├── RegistrationModal.tsx       # Registration form
│   │   └── ConfirmationModal.tsx       # Success confirmation
│   ├── lib/
│   │   └── utils.ts                    # Utility functions (cn)
│   ├── App.tsx                         # Main app component
│   ├── main.tsx                        # Entry point
│   └── index.css                       # Global styles + Tailwind
│
├── server.cjs                           # Backend API (optional)
├── admin.html                          # Admin dashboard (static)
├── vite.config.ts                      # Vite configuration
├── tailwind.config.js                  # Tailwind configuration
├── tsconfig.json                       # TypeScript configuration
└── package.json                        # Dependencies
```

## 🎨 Component Integration

### Gradient Blur Background (from 21st.dev)

The hero section uses a custom gradient blur background component located at `src/components/ui/gradient-blur-bg.tsx`:

```tsx
import { GradientBlurBg } from "@/components/ui/gradient-blur-bg";

export const Hero = () => {
  return (
    <GradientBlurBg>
      {/* Your content here */}
    </GradientBlurBg>
  );
};
```

**Features:**
- Purple radial gradient positioned at top-right
- Subtle grid pattern overlay
- Fully responsive
- Zero external dependencies

### shadcn/ui Compatible Structure

This project follows shadcn/ui conventions:
- ✅ `src/components/ui/` for reusable UI components
- ✅ `src/lib/utils.ts` with `cn()` helper for className merging
- ✅ Tailwind CSS with design tokens
- ✅ TypeScript for type safety

To add more shadcn components, simply copy them into `src/components/ui/`.

## 🔌 WhatsApp Integration

### Option A: Twilio WhatsApp API

1. **Get credentials**: https://www.twilio.com/console
2. **Edit `server.cjs`** (lines 17-19):
   ```javascript
   TWILIO_ACCOUNT_SID: 'ACxxxxxxxxxxxx',
   TWILIO_AUTH_TOKEN: 'your_auth_token',
   TWILIO_WHATSAPP_NUMBER: 'whatsapp:+14155238886'
   ```
3. **Uncomment** Twilio section in `server.cjs` (lines 71-87)
4. **Install**: `npm install twilio`
5. **Run backend**: `npm run server` (separate terminal)

### Option B: WhatsApp Cloud API (Meta)

1. **Setup**: https://developers.facebook.com/docs/whatsapp/cloud-api
2. **Edit `server.cjs`** (lines 22-23):
   ```javascript
   WHATSAPP_ACCESS_TOKEN: 'your_access_token',
   WHATSAPP_PHONE_NUMBER_ID: 'your_phone_number_id'
   ```
3. **Uncomment** Cloud API section in `server.cjs` (lines 91-120)
4. **Install**: `npm install node-fetch@2`
5. **Run backend**: `npm run server`

### Environment Variables (Recommended)

Create `.env` file:
```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

## 📱 Mobile Testing

The site is optimized for mobile devices. Test with:

```bash
# Get your local IP
npm run dev -- --host

# Visit on mobile: http://YOUR_IP:5173
```

### WhatsApp Link

Share via WhatsApp:
```
https://wa.me/?text=Check%20out%20our%20courses%3A%20https%3A%2F%2Fyour-site.com
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

**Note**: For backend API, use Vercel Serverless Functions.

### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

### Other Platforms

- **Railway.app**: Connect GitHub repo, auto-deploys
- **Render**: Docker or native Node.js support
- **DigitalOcean**: Use App Platform or Droplets

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: { DEFAULT: "hsl(243 75% 59%)" }, // Indigo
  // Add your brand colors
}
```

Or use CSS variables in `src/index.css`:
```css
:root {
  --primary: 243 75% 59%;
}
```

### Fonts

Change in `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;600&display=swap');

body {
  font-family: 'YourFont', sans-serif;
}
```

### Courses

Edit `src/App.tsx` (lines 6-40) to add/remove courses.

### Background Gradient

Modify `src/components/ui/gradient-blur-bg.tsx`:
```tsx
radial-gradient(circle 800px at 100% 200px, #d5c5ff, transparent)
//                        ↑      ↑     ↑      ↑
//                     size    x     y    color
```

## 📊 Admin Dashboard

Visit `/admin.html` to view registrations (works with both localStorage and API).

**Features:**
- View all registrations
- Filter by track/status
- Search by name
- Export to CSV
- Real-time stats

## 🛠️ Development

### Adding New Components

1. Create component in `src/components/`
2. Use TypeScript for props
3. Import and use in `App.tsx`

Example:
```tsx
// src/components/MyComponent.tsx
interface MyComponentProps {
  title: string;
}

export const MyComponent = ({ title }: MyComponentProps) => {
  return <div>{title}</div>;
};
```

### Using Tailwind

```tsx
// Utility classes
<div className="bg-white p-6 rounded-lg shadow-xl">

// Custom animations (defined in index.css)
<div className="animate-fade-in">

// Responsive
<div className="text-xl md:text-3xl lg:text-5xl">
```

### Adding Icons

Install lucide-react:
```bash
npm install lucide-react
```

Use:
```tsx
import { Check, X, Menu } from 'lucide-react';

<Check className="w-6 h-6" />
```

## 🔧 Troubleshooting

### TypeScript Errors

```bash
# Clear cache and restart
rm -rf node_modules dist .vite
npm install
npm run dev
```

### Tailwind Not Working

1. Verify `index.css` imports Tailwind directives
2. Check `tailwind.config.js` content paths
3. Restart dev server

### Build Errors

```bash
# Type check
npx tsc --noEmit

# Fix and rebuild
npm run build
```

## 📝 Scripts

```bash
npm run dev       # Start dev server (port 5173)
npm run build     # Build for production
npm run preview   # Preview production build
npm run server    # Start backend API (port 3000)
```

## 🤝 Support

**Contact:**
- Phone: 08097545740
- Email: ictpanorama5@gmail.com

## 📄 License

MIT License - Free to use and modify.

---

Built with ❤️ for PEISCL
Gradient background component from [21st.dev](https://21st.dev)
