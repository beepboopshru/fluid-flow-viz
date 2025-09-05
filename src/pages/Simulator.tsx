import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import FluidCanvas from '@/components/FluidCanvas';
import ControlPanel from '@/components/ControlPanel';
import { api } from '@/convex/_generated/api';
import { Button } from '@/components/ui/button';

export default function Simulator() {
  const navigate = useNavigate();
  const saveSimulation = useMutation(api.simulations.saveSimulation);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [viscosity, setViscosity] = useState(0.01);
  const [diffusion, setDiffusion] = useState(0.01);
  const [flowSpeed, setFlowSpeed] = useState(1.0);
  const [gridResolution, setGridResolution] = useState(64);
  const [stepSize, setStepSize] = useState(0.016);
  const [visualizationMode, setVisualizationMode] = useState<'velocity' | 'pressure' | 'vorticity'>('velocity');
  const [showParticles, setShowParticles] = useState(true);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    // Reset will be handled by re-initializing the canvas
    window.location.reload();
  };

  const handleExport = useCallback((canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `fluid-simulation-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    toast.success('🎨 Image exported successfully!');
  }, []);

  const handleSave = async () => {
    try {
      const simulationId = await saveSimulation({
        name: `Fluid Sim ${new Date().toLocaleString()}`,
        parameters: {
          viscosity,
          diffusion,
          flowSpeed,
          gridResolution,
          stepSize,
          visualizationMode,
        },
      });
      toast.success('💾 Simulation saved successfully!');
    } catch (error) {
      toast.error('❌ Failed to save simulation');
    }
  };

  const handleShare = async () => {
    try {
      const shareId = Math.random().toString(36).substring(2, 15);
      await saveSimulation({
        name: `Shared Fluid Sim`,
        parameters: {
          viscosity,
          diffusion,
          flowSpeed,
          gridResolution,
          stepSize,
          visualizationMode,
        },
        shareId,
      });
      
      const shareUrl = `${window.location.origin}/shared/${shareId}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('🔗 Share link copied to clipboard!');
    } catch (error) {
      toast.error('❌ Failed to create share link');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF0080] via-[#0080FF] to-[#00FF80] flex">
      {/* Control Panel */}
      <ControlPanel
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        viscosity={viscosity}
        onViscosityChange={setViscosity}
        diffusion={diffusion}
        onDiffusionChange={setDiffusion}
        flowSpeed={flowSpeed}
        onFlowSpeedChange={setFlowSpeed}
        gridResolution={gridResolution}
        onGridResolutionChange={setGridResolution}
        stepSize={stepSize}
        onStepSizeChange={setStepSize}
        visualizationMode={visualizationMode}
        onVisualizationModeChange={setVisualizationMode}
        showParticles={showParticles}
        onShowParticlesChange={setShowParticles}
        onSave={handleSave}
        onShare={handleShare}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 p-8 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            onClick={() => navigate('/')}
            className="bg-white hover:bg-gray-100 text-black font-bold border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all px-6 py-3"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            BACK TO HOME
          </Button>
          
          <h1 className="text-4xl font-bold text-white font-['Space_Grotesk'] text-center flex-1 drop-shadow-[4px_4px_0px_#000000]">
            🌊 FLUID DYNAMICS VISUALIZER 🌊
          </h1>
          
          <div className="w-32"></div> {/* Spacer for centering */}
        </motion.div>

        {/* Canvas Container */}
        <div className="flex-1 flex items-center justify-center">
          <FluidCanvas
            width={800}
            height={600}
            viscosity={viscosity}
            diffusion={diffusion}
            flowSpeed={flowSpeed}
            gridResolution={gridResolution}
            stepSize={stepSize}
            visualizationMode={visualizationMode}
            isPlaying={isPlaying}
            showParticles={showParticles}
            onExport={handleExport}
          />
        </div>

        {/* Instructions */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white border-4 border-black shadow-[8px_8px_0px_#000000] p-4 rounded-none"
        >
          <p className="text-center text-black font-bold font-['Space_Grotesk']">
            🖱️ CLICK & DRAG on the canvas to add velocity and dye • 
            🎛️ Use the control panel to adjust physics parameters • 
            🎨 Switch visualization modes to see different fluid properties
          </p>
        </motion.div>
      </div>
    </div>
  );
}
