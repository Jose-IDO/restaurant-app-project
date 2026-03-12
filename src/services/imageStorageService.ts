/**
 * Free image storage via Cloudinary (no credit card required).
 * Used for food item images and restaurant assets.
 */

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

export const imageStorageService = {
  /**
   * Upload an image to Cloudinary and return the public URL.
   * @param uri - Local file URI (e.g. from expo-image-picker or file picker)
   * @param filename - Optional filename for the asset (e.g. food_123)
   */
  async uploadImage(uri: string, filename?: string): Promise<string> {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error(
        'Missing Cloudinary config. Add EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET to .env'
      );
    }

    const formData = new FormData();

    const ext = uri.split('.').pop()?.toLowerCase() || 'jpg';
    const safeName = filename || `upload_${Date.now()}`;
    const name = `${safeName}.${ext}`;

    // React Native: append file as { uri, type, name }
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name,
    } as any);
    formData.append('upload_preset', UPLOAD_PRESET);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(errText || `Upload failed: ${uploadRes.status}`);
    }

    const data = (await uploadRes.json()) as { secure_url?: string; url?: string };
    const url = data.secure_url || data.url;
    if (!url) {
      throw new Error('Cloudinary did not return an image URL');
    }
    return url;
  },
};
