# Free Image Storage with Cloudinary

Use **Cloudinary** for food and restaurant images — **free tier, no credit card required.** Works alongside Firebase (Auth + Firestore).

## Why Cloudinary?

- **No credit card** required for free tier
- **Generous free allowance** (credits for storage, bandwidth, transformations)
- **Simple API** — upload from React Native/Expo
- **CDN delivery** — fast image loading
- **Optional transformations** — resize, crop, format (e.g. WebP)

## Free Tier (No Credit Card)

- **Sign up:** Google, GitHub, or email — no payment info
- **Credits:** Monthly allowance (e.g. 25 credits; 1 credit ≈ 1 GB storage or 1 GB bandwidth or 1k transformations)
- **Upload API:** Rate-unlimited
- **Production use:** Allowed within free limits

For a restaurant app with 15–50 food images and moderate traffic, you stay well within the free tier.

## Setup (One-Time)

### 1. Create Account

1. Go to [cloudinary.com](https://cloudinary.com)
2. Click **Sign Up for Free**
3. Sign up with Google, GitHub, or email
4. Verify email if prompted

### 2. Get Cloud Name

1. Log in to [Cloudinary Console](https://console.cloudinary.com)
2. On the **Dashboard**, copy your **Cloud name** (e.g. `dxxxxxx`)

### 3. Create Unsigned Upload Preset

Client-side uploads use an **unsigned** preset so you never put an API secret in the app.

1. In Console go to **Settings** (gear) → **Upload** tab
2. Scroll to **Upload presets**
3. Click **Add upload preset**
4. **Preset name:** `restaurant_food_images` (or any name)
5. **Signing Mode:** **Unsigned**
6. Optionally set **Folder:** `restaurant-app/food` to keep uploads organized
7. Click **Save**

### 4. Environment Variables

Add to your `.env`:

```env
EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET=restaurant_food_images
```

Replace `your-cloud-name` and `restaurant_food_images` with your actual cloud name and preset name.

## Integration in the App

The app uses `imageStorageService` (Cloudinary) for uploads. Food item records in Firestore store the returned image URL in the `img` field.

- **Upload:** Admin adds/edits a food item with an image → app uploads to Cloudinary → URL is saved in Firestore.
- **Display:** Screens load the `img` URL from Firestore and show it in `<Image source={{ uri: item.img }} />`.
- **Delete:** When a food item is deleted, only the Firestore document is removed. Optionally you can later add server-side or signed deletion for Cloudinary assets if needed.

## API Reference (Unsigned Upload)

Endpoint:

```
POST https://api.cloudinary.com/v1_1/<cloud_name>/image/upload
```

Form data:

- `file` — image file (e.g. from `expo-image-picker` or `fetch(uri)` then blob)
- `upload_preset` — your unsigned preset name

Response includes `secure_url` — use this as `img` in Firestore.

See [Cloudinary Upload API](https://cloudinary.com/documentation/image_upload_api_reference) for full details.

## Security Notes

- **Unsigned preset** is required for client-only uploads. Restrict it in Cloudinary (e.g. folder, max file size) so only your app can upload where you expect.
- **Never** put your Cloudinary API secret in the app or in client-side code.
- Optionally add file type/size checks in the app before calling the upload service.

## Troubleshooting

| Issue | Check |
|-------|--------|
| "Missing env vars" | `EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME` and `EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET` in `.env` |
| Upload fails 401/403 | Preset exists, **Signing Mode** is **Unsigned** |
| Wrong image URL | Use `secure_url` from the upload response and save that in Firestore `img` |

## Resources

- [Cloudinary Free Plan](https://cloudinary.com/documentation/developer_onboarding_faq_free_plan)
- [Image Upload API](https://cloudinary.com/documentation/image_upload_api_reference)
- [Unsigned Upload](https://cloudinary.com/documentation/upload_images#unsigned_upload)
