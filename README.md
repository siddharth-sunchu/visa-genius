# Visa Genius

A modern web application designed to help researchers and scientists complete their EB1A immigration application. The application guides users through all required sections including personal bio, eligibility criteria, and recommendation letters.

## Features

- **Landing Page**: Professional design with hero banner and clear call-to-action
- **User Authentication**: Account creation and Google OAuth integration
- **Dashboard**: Step-by-step EB1A application guidance
- **Personal Information**: Bio and achievements collection
- **EB1A Criteria**: Organized USCIS categories completion
- **Recommendation Letters**: AI-powered letter generation with referee details
- **Responsive Design**: Mobile, tablet, and desktop optimized

## Tech Stack

- React 18 with TypeScript
- Ant Design (AntD) for UI components
- React Router for navigation
- Axios for API calls

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── VisaGeniusLogo.tsx      # Custom logo component
│   └── VisaGeniusTextLogo.tsx  # Logo with text component
├── pages/              # Main application pages
├── layouts/            # Layout components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── assets/             # Static assets
    └── icons/          # Custom icons and logos
```

## Branding & Icons

The application features custom Visa Genius branding with:
- **Logo Design**: Combines a brain with circuit patterns and a visa card to represent intelligence and immigration
- **Color Scheme**: Ant Design standard blue (#1890ff) with gold accents (#fbbf24) for the genius element
- **Favicon**: SVG-based favicon that scales well across all devices
- **App Icons**: Multiple sizes for PWA support and app stores
- **Animations**: Smooth hover effects and staggered entrance animations for enhanced UX

## Development

- `npm start` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run eject` - Eject from Create React App

## Future Enhancements

- Node.js backend for data persistence
- AI model integration for letter generation
- Admin dashboard for case managers
- Payment gateway integration
- Real-time collaboration features
