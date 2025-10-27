# Theme Customization Feature

## Overview
The theme customization feature allows users to personalize their DevLink profile page just like Linktree, with custom backgrounds, button styles, colors, and fonts.

## Setup Instructions

### 1. Run Database Migration

First, add the theme columns to your database:

```bash
mysql -u root -p DevLink < src/config/theme_migration.sql
```

Or manually:

```sql
ALTER TABLE users 
ADD COLUMN background_type ENUM('color', 'gradient', 'image') DEFAULT 'color',
ADD COLUMN background_value VARCHAR(255) DEFAULT '#ffffff',
ADD COLUMN button_style ENUM('fill', 'outline', 'shadow', 'soft-shadow') DEFAULT 'fill',
ADD COLUMN button_color VARCHAR(50) DEFAULT '#000000',
ADD COLUMN button_text_color VARCHAR(50) DEFAULT '#ffffff',
ADD COLUMN font_family VARCHAR(50) DEFAULT 'Inter',
ADD COLUMN theme_preset VARCHAR(50) DEFAULT NULL;
```

### 2. Background Images

The app uses 5 background images located in `/public/theme/`:
- 1.jpeg
- 2.jpeg
- 3.jpeg
- 4.jpeg
- 5.jpeg

Make sure these images exist in your `public/theme` folder.

## Features

### 🎨 Background Customization
- **Solid Colors**: Choose from 8 preset colors or use any custom color
- **Gradients**: Select from 6 beautiful gradient presets
- **Images**: Choose from 5 pre-loaded background images

### 🔘 Button Styles
- **Fill**: Solid filled buttons
- **Outline**: Outlined buttons with transparent background
- **Shadow**: Filled buttons with prominent shadow
- **Soft Shadow**: Filled buttons with subtle shadow

### 🎨 Color Customization
- **Button Color**: Choose any color for your buttons
- **Text Color**: Customize button text color for perfect contrast

### 📝 Font Families
Choose from 6 popular fonts:
- Inter
- Poppins
- Roboto
- Montserrat
- Open Sans
- Lato

## Usage

### Theme Editor
1. Navigate to `/theme` in your app
2. Select a background type (Color, Gradient, or Image)
3. Choose your preferred background
4. Pick a button style
5. Customize button and text colors
6. Select your font family
7. Click "Save Theme"

### Public Profile
- Your public profile is available at `/{username}`
- Share this link with anyone to showcase your customized page
- All your visible links will be displayed with your chosen theme

## API Endpoints

### GET /api/theme
Fetch user theme settings
```typescript
const response = await axios.get(`/api/theme?userId=${userId}`);
```

### PUT /api/theme
Update theme settings
```typescript
await axios.put('/api/theme', {
  clerkUserId: userId,
  background_type: 'gradient',
  background_value: 'linear-gradient(...)',
  button_style: 'fill',
  button_color: '#000000',
  button_text_color: '#ffffff',
  font_family: 'Inter'
});
```

### GET /api/public-profile
Fetch public profile
```typescript
const response = await axios.get(`/api/public-profile?username=${username}`);
```

### POST /api/track-click
Track link clicks
```typescript
await axios.post('/api/track-click', { linkId: '123' });
```

## Pages

### /theme
Theme customization page with:
- Live preview on the right side
- Theme options on the left side
- Real-time updates as you customize

### /[username]
Public profile page that:
- Displays user's customized theme
- Shows all visible links
- Tracks link clicks
- Fully shareable

## Database Schema

Theme settings are stored in the `users` table:

```sql
background_type      ENUM('color', 'gradient', 'image')
background_value     VARCHAR(255)
button_style         ENUM('fill', 'outline', 'shadow', 'soft-shadow')
button_color         VARCHAR(50)
button_text_color    VARCHAR(50)
font_family          VARCHAR(50)
theme_preset         VARCHAR(50)
```

## Customization Tips

1. **High Contrast**: Ensure good contrast between button color and text color
2. **Background Images**: Use high-quality images for best results
3. **Font Selection**: Choose fonts that match your brand
4. **Button Styles**: Outline style works best with lighter backgrounds

## Troubleshooting

### Theme not saving
- Check database connection
- Verify user is authenticated
- Check browser console for errors

### Background images not showing
- Ensure images exist in `/public/theme/`
- Check image file names (1.jpeg - 5.jpeg)
- Verify file permissions

### Public profile not found
- Ensure user has set a username
- Check username in database
- Verify username in URL is correct

## Future Enhancements

- [ ] Custom background upload
- [ ] More button style variations
- [ ] Theme presets (save and reuse)
- [ ] Animation options
- [ ] Custom CSS injection
- [ ] Theme marketplace
