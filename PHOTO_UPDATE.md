# Photo Feature Update

## Changes Made

### 1. **PhotoUpload Component** (Tasks Section)
- Removed camera capture functionality
- Keeps file upload only
- Clean dashed border button with "Upload Photo" text
- Photos display in grid below upload button
- All photos persist in localStorage

### 2. **PhotoUploadOnly Component** (New)
- Dedicated upload-only component for Leaving Home Mode
- Same file upload as PhotoUpload but standalone
- No photo gallery (used with task confirmations)
- Success feedback when photo uploads
- Can be reused in other confirmation flows

### 3. **ConfirmationModal** (Leaving Home)
- Changed from camera to photo upload
- Now uses `PhotoUploadOnly` component
- Users upload photos instead of taking them
- Photos saved with confirmation records

## User Workflows

### Tasks Section (Manage Tasks)
1. Create or edit a task
2. Click "Add Photo" button on task card
3. Button expands to show PhotoUpload component
4. Click "Upload Photo" button
5. Select image from device
6. Photo displays in grid below
7. Can upload multiple photos per task

### Leaving Home Mode
1. Start Leaving Home Mode from navbar
2. For items requiring photo:
   - Confirmation modal appears
   - Click "Upload Photo" button
   - Select image from device
   - Success message shows
   - Continue to next step

## Photo Storage
- All photos converted to base64
- Stored in localStorage under task ID
- Persists across page refreshes
- Can delete individual photos
- Photos remain even if task is archived

## Benefits
- File upload works on all devices (mobile/desktop)
- No camera permissions needed
- Users can upload existing photos
- Faster workflow - no need to take new photos
- More reliable than camera capture
