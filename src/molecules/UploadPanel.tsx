import { Upload } from 'lucide-react';

export default function UploadPanel() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      <div className="rounded-full bg-gray-100 p-6 mb-4">
        <Upload className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload</h3>
      <p className="text-sm text-gray-500 max-w-xs">
        Upload your own images, videos, and other media files. This feature is coming soon!
      </p>
    </div>
  );
}

