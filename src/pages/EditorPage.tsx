import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { setCurrentDesign, setLoading, setError, clearCurrentDesign, clearUnsaved, setClientId, setSocketConnected } from '../store/designSlice';
import { setCanvasDimensions, setCanvasBackground, reorderElements } from '../store/canvasSlice';
import { initHistory } from '../store/historySlice';
import { getDesignById } from '../services/designApi';
import { socketService } from '../services/socketService';
import { setIsProcessingRemoteUpdate } from '../store/remoteUpdateFlag';
import TopToolbar from '../organisms/TopToolbar';
import LeftSidebar from '../organisms/LeftSidebar';
import CanvasArea from '../organisms/CanvasArea';
import SidePanel from '../organisms/SidePanel';
import ElementsPanel from '../molecules/ElementsPanel';
import PhotosPanel from '../molecules/PhotosPanel';
import UploadPanel from '../molecules/UploadPanel';
import BackgroundPanel from '../molecules/BackgroundPanel';
import LayersPanel from '../molecules/LayersPanel';
import ResizePanel from '../molecules/ResizePanel';
import StylesPanel from '../molecules/StylesPanel';
import CommentsPanel from '../molecules/CommentsPanel';
import { CanvasProvider } from '../context/CanvasContext';

type PanelType = 'elements' | 'photos' | 'upload' | 'background' | 'layers' | 'styles' | 'resize' | 'comments' | null;

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentDesign = useAppSelector((state) => state.design.currentDesign);
  const loading = useAppSelector((state) => state.design.loading);
  const error = useAppSelector((state) => state.design.error);
  const [activePanelType, setActivePanelType] = useState<PanelType>(null);


  useEffect(() => {
    if (!id) {
      navigate('/home');
      return;
    }

    const fetchDesign = async () => {
      dispatch(setLoading(true));
      try {
        const design = await getDesignById(id);
        const clientId = crypto.randomUUID();
        dispatch(setClientId(clientId));

        try {
          const socketUrl = import.meta.env.VITE_SOCKET_URL || 'https://design-editor-backend-production.up.railway.app';
          socketService.connect(socketUrl);
          console.log('Socket connection initiated to:', socketUrl);

          await new Promise<void>((resolve) => {
            let connectionAttempts = 0;
            const waitForConnection = setInterval(() => {
              connectionAttempts++;
              if (socketService.isConnected()) {
                clearInterval(waitForConnection);
                dispatch(setSocketConnected(true));
                socketService.joinDesign(id, clientId);
                resolve();
              } else if (connectionAttempts > 50) {
                clearInterval(waitForConnection);
                dispatch(setSocketConnected(false));
                resolve();
              }
            }, 100);
          });
        } catch (socketErr) {
          console.warn('Socket connection error:', socketErr);
          dispatch(setSocketConnected(false));
        }

        setIsProcessingRemoteUpdate(true);
        dispatch(setCurrentDesign(design));
        dispatch(setCanvasDimensions({ width: design.width, height: design.height }));
        dispatch(setCanvasBackground(design.canvasBackground));
        dispatch(reorderElements(design.elements));
        setIsProcessingRemoteUpdate(false);

        dispatch(initHistory({
          elements: design.elements,
          canvasBackground: design.canvasBackground,
          canvasWidth: design.width,
          canvasHeight: design.height,
        }));

        dispatch(clearUnsaved());
        dispatch(setError(null));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch design';
        console.error('Error fetching design:', errorMessage);
        dispatch(setError(errorMessage));
        setTimeout(() => navigate('/home'), 2000);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchDesign();

    return () => {
      if (id) {
        socketService.leaveDesign(id);
      }
      dispatch(clearCurrentDesign());
    };
  }, [id, dispatch, navigate]);

  const handleToolClick = (toolType: PanelType) => {
    if (activePanelType === toolType) {
      setActivePanelType(null);
    } else {
      setActivePanelType(toolType);
    }
  };

  const handleClosePanel = () => {
    setActivePanelType(null);
  };


  const getPanelTitle = () => {
    if (!activePanelType) return '';
    return activePanelType.charAt(0).toUpperCase() + activePanelType.slice(1);
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading design...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <p className="text-red-600 font-medium mb-4">Error: {error}</p>
          <p className="text-gray-600 text-sm mb-6">Redirecting to home...</p>
          <button
            onClick={() => navigate('/home')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!currentDesign) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">No design found</p>
        </div>
      </div>
    );
  }

  return (
    <CanvasProvider>
      <div className="flex h-screen w-screen flex-col overflow-hidden">
        <TopToolbar
          onCommentsClick={() => handleToolClick('comments')}
          isCommentsOpen={activePanelType === 'comments'}
        />

        <div className="flex flex-1 overflow-auto">
          <LeftSidebar
            onToolClick={(toolType) => handleToolClick(toolType as PanelType)}
            activeToolType={activePanelType}
          />

          <CanvasArea />
        </div>

        <SidePanel
          isOpen={activePanelType !== null}
          onClose={handleClosePanel}
          title={getPanelTitle()}
          position={activePanelType === 'comments' ? 'right' : 'left'}
        >
          {/* TODO: Make this type vs component mapping */}
          {activePanelType === 'elements' && <ElementsPanel />}
          {activePanelType === 'photos' && <PhotosPanel />}
          {activePanelType === 'upload' && <UploadPanel />}
          {activePanelType === 'background' && <BackgroundPanel />}
          {activePanelType === 'layers' && <LayersPanel />}
          {activePanelType === 'styles' && <StylesPanel />}
          {activePanelType === 'resize' && <ResizePanel />}
          {activePanelType === 'comments' && <CommentsPanel />}
        </SidePanel>
      </div>
    </CanvasProvider>
  );
}

