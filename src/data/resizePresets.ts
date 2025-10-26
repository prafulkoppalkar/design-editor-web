export interface ResizePreset {
  id: string;
  platform: string;
  name: string;
  width: number;
  height: number;
  icon: string;
}

// Move this to DB instead of storing here and fetch from metadata API 
export const resizePresets: ResizePreset[] = [
  {
    id: 'instagram-post',
    platform: 'Instagram',
    name: 'Post',
    width: 1080,
    height: 1080,
    icon: '📷',
  },
  {
    id: 'instagram-story',
    platform: 'Instagram',
    name: 'Story',
    width: 1080,
    height: 1920,
    icon: '📱',
  },
  {
    id: 'facebook-post',
    platform: 'Facebook',
    name: 'Post',
    width: 1200,
    height: 630,
    icon: '🖼️',
  },
  {
    id: 'facebook-square',
    platform: 'Facebook',
    name: 'Square',
    width: 1080,
    height: 1080,
    icon: '⬜',
  },
  {
    id: 'youtube-thumbnail',
    platform: 'YouTube',
    name: 'Thumbnail',
    width: 1280,
    height: 720,
    icon: '🎬',
  },
  {
    id: 'youtube-short',
    platform: 'YouTube',
    name: 'Short',
    width: 1080,
    height: 1920,
    icon: '🎥',
  },
];

export const groupedPresets = resizePresets.reduce((acc, preset) => {
  if (!acc[preset.platform]) {
    acc[preset.platform] = [];
  }
  acc[preset.platform].push(preset);
  return acc;
}, {} as Record<string, ResizePreset[]>);

