import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useQuery } from 'convex/react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FluidCanvas from '@/components/FluidCanvas';
import { api } from '@/convex/_generated/api';

export default function SharedSimulation() {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const simulation = useQuery(api.simulations.getSimulation, shareId ? { shareId } : "skip");
  
  const [isPlaying, setIsPlaying] = useState(false);

  if (!shareId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF0080] via-[#0080FF] to-[#00FF80] flex items-center justify-center">
        <div className="text-white text-2xl font-bold">Invalid share link</div>
      </div>
    );
  }

  if (simulation === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF0080] via-[#0080FF] to-[#00FF80] flex items-center justify-center">
        <div className="flex items-center gap-4 text-white">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-2xl font-bold font-['Space_Grotesk']">Loading simulation...</span>
        </div>
      </div>
    );
  }

  if (simulation === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF0080] via-[#0080FF] to-[#00FF80] flex items-center justify-center">
        <div className="text-center">
          <div className="text-white text-2xl font-bold mb-4">Simulation not found</div>
          <Button
            onClick={() => navigate('/')}
            className="bg-white hover:bg-gray-100 text-black font-bold border-4 border-black shadow-[8px_8px_0px_#000000]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleExport = (canvas: HTMLCanvasElement) => {
    const link = document.createElement('a');
    link.download = `shared-fluid-simulation-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF0080] via-[#0080FF] to-[#00FF80] p-8">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8"
      >
        <Button
          onClick={() => navigate('/')}
          className="bg-white hover:bg-gray-100 text-black font-bold border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all px-6 py-3"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          BACK TO HOME
        </Button>
        
        <h1 className="text-4xl font-bold text-white font-['Space_Grotesk'] text-center flex-1 drop-shadow-[4px_4px_0px_#000000]">
          🌊 SHARED SIMULATION 🌊
        </h1>
        
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-[#FF0080] hover:bg-[#CC0066] text-white font-bold border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all px-6 py-3"
        >
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </Button>
      </motion.div>

      {/* Simulation Info */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white border-4 border-black shadow-[8px_8px_0px_#000000] p-4 mb-8 max-w-4xl mx-auto"
      >
        <h2 className="text-xl font-bold text-black font-['Space_Grotesk'] mb-2">
          {simulation.name}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-black">
          <div><strong>Viscosity:</strong> {simulation.parameters.viscosity}</div>
          <div><strong>Diffusion:</strong> {simulation.parameters.diffusion}</div>
          <div><strong>Flow Speed:</strong> {simulation.parameters.flowSpeed}</div>
          <div><strong>Grid Resolution:</strong> {simulation.parameters.gridResolution}</div>
          <div><strong>Step Size:</strong> {simulation.parameters.stepSize}</div>
          <div><strong>Mode:</strong> {simulation.parameters.visualizationMode}</div>
        </div>
      </motion.div>

      {/* Canvas */}
      <div className="flex justify-center">
        <FluidCanvas
          width={800}
          height={600}
          viscosity={simulation.parameters.viscosity}
          diffusion={simulation.parameters.diffusion}
          flowSpeed={simulation.parameters.flowSpeed}
          gridResolution={simulation.parameters.gridResolution}
          stepSize={simulation.parameters.stepSize}
          visualizationMode={simulation.parameters.visualizationMode as 'velocity' | 'pressure' | 'vorticity'}
          isPlaying={isPlaying}
          showParticles={true}
          onExport={handleExport}
        />
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 bg-white border-4 border-black shadow-[8px_8px_0px_#000000] p-4 max-w-4xl mx-auto"
      >
        <p className="text-center text-black font-bold font-['Space_Grotesk']">
          🖱️ CLICK & DRAG on the canvas to interact with this shared simulation • 
          📸 Use the export button to save a snapshot
        </p>
      </motion.div>
    </div>
  );
}
