# Podcast Hub - Setup Guide

## Features Implemented

### 1. Sticky Navbar
- Fixed navigation bar at the top of every page
- Smooth scroll to top when clicking the logo
- Responsive design with mobile menu
- Backdrop blur effect on scroll
- Active link highlighting
- Dark/Light theme toggle integrated

### 2. Contact Form
- Full contact form with validation
- Email functionality using Nodemailer
- Success/Error feedback
- Responsive design matching the theme
- Backend API endpoint for form submission

### 3. Logo & Favicon
- Custom SVG logo and favicon
- Theme-aware design
- Optimized for all devices

## Installation & Setup

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/podcast-hub
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Email Configuration

The contact form currently uses Ethereal Email for development testing. To use a real email service in production:

1. Open `Backend/src/controllers/contactController.ts`

2. Replace the Ethereal configuration with your email service:

```typescript
// For Gmail:
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// For SendGrid, Mailgun, etc., follow their documentation
```

3. Add email credentials to your `.env` file:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
RECIPIENT_EMAIL=recipient@example.com
```

## Features Overview

### Navbar Features:
- ✅ Fixed/Sticky positioning
- ✅ Smooth scroll to top on logo click
- ✅ Responsive mobile menu with animations
- ✅ Active route highlighting
- ✅ Dark/Light theme toggle
- ✅ Backdrop blur on scroll
- ✅ Mobile menu overlay

### Contact Page Features:
- ✅ Form validation
- ✅ Email integration
- ✅ Success/Error messages
- ✅ Loading states
- ✅ Responsive design
- ✅ Smooth animations

### Theme Support:
- ✅ Dark and Light themes
- ✅ Logo adapts to theme
- ✅ Consistent color palette
- ✅ Smooth theme transitions

## Testing the Contact Form

1. Start both backend and frontend servers
2. Navigate to `http://localhost:3000/contact`
3. Fill out the form and submit
4. Check the console for the preview URL (Ethereal Email)
5. Click the preview URL to see the sent email

## Project Structure

```
podcast-hub/
├── Backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── contactController.ts
│   │   ├── routes/
│   │   │   ├── contactRoutes.ts
│   │   │   └── index.ts
│   │   └── server.ts
│   └── package.json
├── Frontend/
│   ├── public/
│   │   ├── icon.svg
│   │   ├── logo.svg
│   │   └── site.webmanifest
│   ├── src/
│   │   ├── app/
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── components/
│   │       └── Navbar.tsx
│   └── package.json
└── SETUP.md
```

## Troubleshooting

### Backend not connecting:
- Ensure MongoDB is running
- Check the PORT in `.env`
- Verify CORS settings in `app.ts`

### Contact form not working:
- Check backend is running on port 5000
- Verify the API endpoint URL in `contact/page.tsx`
- Check browser console for errors

### Navbar not sticky:
- Clear browser cache
- Check if CSS is loading properly
- Verify Tailwind CSS is configured

## Next Steps

1. Replace Ethereal Email with a production email service
2. Add environment variables for API URLs
3. Deploy backend and frontend separately
4. Update API URLs in production build
5. Add email templates for better formatting

## Support

For issues or questions, please open an issue on the GitHub repository.
