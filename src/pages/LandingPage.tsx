import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { setDesigns, setLoading, setError } from '../store/designSlice';
import { getAllDesigns, createDesign } from '../services/designApi';
import DesignCard from '../molecules/DesignCard';
import { Plus } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const designs = useAppSelector((state) => state.design.designs);
  const loading = useAppSelector((state) => state.design.loading);
  const error = useAppSelector((state) => state.design.error);
  const [isCreating, setIsCreating] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Fetch all designs on mount
  useEffect(() => {
    const fetchDesigns = async () => {
      dispatch(setLoading(true));
      try {
        const data = await getAllDesigns();
        dispatch(setDesigns(data));
        dispatch(setError(null));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch designs';
        dispatch(setError(errorMessage));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchDesigns();
  }, [dispatch]);

  // Handle menu open - close other menus
  const handleMenuOpen = (designId: string) => {
    setOpenMenuId(designId);
  };

  // Handle create new design
  const handleCreateDesign = async () => {
    setIsCreating(true);
    try {
      const newDesign = await createDesign({
        name: 'Untitled Design',
        width: 1080,
        height: 1080,
        canvasBackground: '#FFFFFF',
        elements: [],
      });
      // Navigate to editor with new design ID
      navigate(`/editor/${newDesign._id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create design';
      dispatch(setError(errorMessage));
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Design Editor</h1>
            <p className="text-gray-600 mt-1">Create and edit your designs</p>
          </div>
          <button
            onClick={handleCreateDesign}
            disabled={isCreating}
            className="flex items-center gap-2 rounded px-4 py-2 text-gray-700 border border-gray-300 transition-colors hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            {isCreating ? 'Creating...' : 'Create New Design'}
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">Error: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-red-600 hover:text-red-700 underline text-sm"
            >
              Try again
            </button>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow animate-pulse">
                <div className="w-full h-48 bg-gray-200" />
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && designs.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📐</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No designs yet</h2>
            <p className="text-gray-600 mb-6">Create your first design to get started</p>
            <button
              onClick={handleCreateDesign}
              disabled={isCreating}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Plus className="w-5 h-5" />
              Create New Design
            </button>
          </div>
        )}

        {!loading && designs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {designs.map((design) => (
              <DesignCard
                key={design._id}
                design={design}
                onMenuOpen={() => handleMenuOpen(design._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

