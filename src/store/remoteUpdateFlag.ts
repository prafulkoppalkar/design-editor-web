let isProcessingRemoteUpdate = false;

export const setIsProcessingRemoteUpdate = (value: boolean) => {
  isProcessingRemoteUpdate = value;
};

export const getIsProcessingRemoteUpdate = () => {
  return isProcessingRemoteUpdate;
};

