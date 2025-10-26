import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UploadedImage {
  id: string;
  url: string;
  name: string;
  uploadedAt: number;
}

export interface UploadState {
  images: UploadedImage[];
}

const initialState: UploadState = {
  images: [],
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    addUploadedImage: (state, action: PayloadAction<UploadedImage>) => {
      state.images.unshift(action.payload);
    },

    addUploadedImages: (state, action: PayloadAction<UploadedImage[]>) => {
      state.images.unshift(...action.payload);
    },

    removeUploadedImage: (state, action: PayloadAction<string>) => {
      state.images = state.images.filter((img) => img.id !== action.payload);
    },

    clearUploadedImages: (state) => {
      state.images = [];
    },
  },
});

export const {
  addUploadedImage,
  addUploadedImages,
  removeUploadedImage,
  clearUploadedImages,
} = uploadSlice.actions;

export default uploadSlice.reducer;

