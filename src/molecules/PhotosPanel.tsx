import { useRef } from 'react';
import { Upload as UploadIcon, Trash2 } from 'lucide-react';
import { unsplashPhotos } from '../data/unsplashPhotos';
import { useAppDispatch, useAppSelector } from '../store';
import { addElement } from '../store/canvasSlice';
import { addUploadedImages, removeUploadedImage } from '../store/uploadSlice';
import { UploadedImage } from '../store/uploadSlice';

export default function PhotosPanel() {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedImages = useAppSelector((state) => state.upload.images);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files).filter((file) => file.type.startsWith('image/'));

    if (fileArray.length === 0) {
      alert('Please upload only image files');
      return;
    }

    const newImages: UploadedImage[] = [];
    let loadedCount = 0;

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        const uploadedImage: UploadedImage = {
          id: `uploaded_${Date.now()}_${Math.random()}`,
          url: imageUrl,
          name: file.name,
          uploadedAt: Date.now(),
        };

        newImages.push(uploadedImage);
        loadedCount++;

        // Dispatch when all files are loaded
        if (loadedCount === fileArray.length) {
          dispatch(addUploadedImages(newImages));
        }
      };
      reader.onerror = () => {
        loadedCount++;
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteUploadedImage = (id: string) => {
    dispatch(removeUploadedImage(id));
  };

  const handleAddPhoto = (photo: typeof unsplashPhotos[0]) => {
    const newElement = {
      id: `photo_${Date.now()}`,
      type: 'image' as const,
      name: `Image-${photo.title}`,
      x: 540, // Center of 1080px canvas
      y: 540,
      rotation: 0,
      fill: '#ffffff',
      stroke: '#cccccc',
      strokeWidth: 0,
      opacity: 1,
      width: 300,
      height: 225,
      imageUrl: photo.url,
      photographer: photo.photographer,
    };

    dispatch(addElement(newElement as any));
  };

  const handleAddUploadedImage = (image: UploadedImage) => {
    const newElement = {
      id: `photo_${Date.now()}`,
      type: 'image' as const,
      name: `Image-${image.name}`,
      x: 540, // Center of 1080px canvas
      y: 540,
      rotation: 0,
      fill: '#ffffff',
      stroke: '#cccccc',
      strokeWidth: 0,
      opacity: 1,
      width: 300,
      height: 225,
      imageUrl: image.url,
      photographer: 'You',
    };

    dispatch(addElement(newElement as any));
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b border-gray-200 px-4 py-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-6 transition-colors hover:border-blue-500 hover:bg-blue-50"
        >
          <UploadIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Upload pictures</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {uploadedImages.length > 0 && (
          <div className="border-b border-gray-200 px-4 py-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Uploaded by you</h3>
            <div className="grid grid-cols-3 gap-2">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative overflow-hidden rounded-lg"
                >
                  <button
                    onClick={() => handleAddUploadedImage(image)}
                    className="relative w-full h-20 transition-transform hover:scale-105 overflow-hidden"
                    title={image.name}
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />
                  </button>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDeleteUploadedImage(image.id)}
                    className="absolute top-1 right-1 rounded bg-red-500 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                    title="Delete image"
                  >
                    <Trash2 className="h-3 w-3 text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="px-4 py-4">
          <div className="grid grid-cols-2 gap-3">
            {unsplashPhotos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => handleAddPhoto(photo)}
                className="group relative overflow-hidden rounded-lg transition-transform hover:scale-105"
                title={`${photo.title} by ${photo.photographer}`}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="h-40 w-full object-cover"
                />

                <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/30" />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-2 text-left opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="text-xs font-medium text-white truncate">{photo.title}</p>
                  <p className="text-xs text-gray-300">by {photo.photographer}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

