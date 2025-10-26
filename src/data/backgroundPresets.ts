export interface BackgroundPreset {
  id: string;
  name: string;
  value: string; // CSS color or gradient
  type: 'color' | 'gradient';
}

// Move this to DB instead of storing here and fetch from metadata API 
export const backgroundPresets: BackgroundPreset[] = [

  { id: 'white', name: 'White', value: '#ffffff', type: 'color' },
  { id: 'black', name: 'Black', value: '#000000', type: 'color' },
  { id: 'gray', name: 'Gray', value: '#808080', type: 'color' },
  { id: 'red', name: 'Red', value: '#ff0000', type: 'color' },
  { id: 'blue', name: 'Blue', value: '#0066ff', type: 'color' },
  { id: 'green', name: 'Green', value: '#00cc00', type: 'color' },
  { id: 'yellow', name: 'Yellow', value: '#ffff00', type: 'color' },
  { id: 'purple', name: 'Purple', value: '#cc00ff', type: 'color' },

  {
    id: 'gradient-pink-blue',
    name: 'Pink to Blue',
    value: 'linear-gradient(135deg, #ff1493 0%, #00bfff 100%)',
    type: 'gradient',
  },
  {
    id: 'gradient-orange-yellow',
    name: 'Orange to Yellow',
    value: 'linear-gradient(135deg, #ff8c00 0%, #ffff00 100%)',
    type: 'gradient',
  },
  {
    id: 'gradient-green-cyan',
    name: 'Green to Cyan',
    value: 'linear-gradient(135deg, #00cc00 0%, #00ffff 100%)',
    type: 'gradient',
  },
  {
    id: 'gradient-purple-pink',
    name: 'Purple to Pink',
    value: 'linear-gradient(135deg, #9933ff 0%, #ff1493 100%)',
    type: 'gradient',
  },
  {
    id: 'gradient-blue-purple',
    name: 'Blue to Purple',
    value: 'linear-gradient(135deg, #0066ff 0%, #9933ff 100%)',
    type: 'gradient',
  },
  {
    id: 'gradient-red-orange',
    name: 'Red to Orange',
    value: 'linear-gradient(135deg, #ff0000 0%, #ff8c00 100%)',
    type: 'gradient',
  },
  {
    id: 'gradient-light-blue-light-pink',
    name: 'Light Blue to Light Pink',
    value: 'linear-gradient(135deg, #add8e6 0%, #ffb6c1 100%)',
    type: 'gradient',
  },
  {
    id: 'gradient-dark-blue-dark-purple',
    name: 'Dark Blue to Dark Purple',
    value: 'linear-gradient(135deg, #000080 0%, #4b0082 100%)',
    type: 'gradient',
  },
];

