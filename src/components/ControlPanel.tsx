import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Share, Save } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  viscosity: number;
  onViscosityChange: (value: number) => void;
  diffusion: number;
  onDiffusionChange: (value: number) => void;
  flowSpeed: number;
  onFlowSpeedChange: (value: number) => void;
  gridResolution: number;
  onGridResolutionChange: (value: number) => void;
  stepSize: number;
  onStepSizeChange: (value: number) => void;
  visualizationMode: 'velocity' | 'pressure' | 'vorticity';
  onVisualizationModeChange: (mode: 'velocity' | 'pressure' | 'vorticity') => void;
  showParticles: boolean;
  onShowParticlesChange: (show: boolean) => void;
  onSave: () => void;
  onShare: () => void;
}

export default function ControlPanel({
  isPlaying,
  onPlayPause,
  onReset,
  viscosity,
  onViscosityChange,
  diffusion,
  onDiffusionChange,
  flowSpeed,
  onFlowSpeedChange,
  gridResolution,
  onGridResolutionChange,
  stepSize,
  onStepSizeChange,
  visualizationMode,
  onVisualizationModeChange,
  showParticles,
  onShowParticlesChange,
  onSave,
  onShare,
}: ControlPanelProps) {
  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="w-80 h-full bg-[#00FF80] border-4 border-black shadow-[8px_8px_0px_#000000] p-6 overflow-y-auto"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black mb-2 font-['Space_Grotesk']">
            🌊 FLUID CONTROLS
          </h2>
          <div className="w-full h-1 bg-black"></div>
        </div>

        {/* Playback Controls */}
        <Card className="p-4 bg-[#0080FF] border-4 border-black shadow-[4px_4px_0px_#000000]">
          <h3 className="text-lg font-bold text-white mb-3 font-['Space_Grotesk']">
            ⚡ SIMULATION
          </h3>
          <div className="flex gap-2">
            <Button
              onClick={onPlayPause}
              className="flex-1 bg-[#FF0080] hover:bg-[#CC0066] text-white font-bold border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'PAUSE' : 'PLAY'}
            </Button>
            <Button
              onClick={onReset}
              className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Physics Parameters */}
        <Card className="p-4 bg-[#FF0080] border-4 border-black shadow-[4px_4px_0px_#000000]">
          <h3 className="text-lg font-bold text-white mb-3 font-['Space_Grotesk']">
            🔬 PHYSICS
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white font-bold mb-2">
                VISCOSITY: {viscosity.toFixed(3)}
              </label>
              <Slider
                value={[viscosity]}
                onValueChange={(value) => onViscosityChange(value[0])}
                min={0.001}
                max={0.1}
                step={0.001}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-white font-bold mb-2">
                DIFFUSION: {diffusion.toFixed(3)}
              </label>
              <Slider
                value={[diffusion]}
                onValueChange={(value) => onDiffusionChange(value[0])}
                min={0.001}
                max={0.1}
                step={0.001}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-white font-bold mb-2">
                FLOW SPEED: {flowSpeed.toFixed(1)}
              </label>
              <Slider
                value={[flowSpeed]}
                onValueChange={(value) => onFlowSpeedChange(value[0])}
                min={0.1}
                max={5.0}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Simulation Settings */}
        <Card className="p-4 bg-[#0080FF] border-4 border-black shadow-[4px_4px_0px_#000000]">
          <h3 className="text-lg font-bold text-white mb-3 font-['Space_Grotesk']">
            ⚙️ SETTINGS
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white font-bold mb-2">
                GRID RESOLUTION: {gridResolution}
              </label>
              <Slider
                value={[gridResolution]}
                onValueChange={(value) => onGridResolutionChange(value[0])}
                min={32}
                max={128}
                step={16}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-white font-bold mb-2">
                STEP SIZE: {stepSize.toFixed(3)}
              </label>
              <Slider
                value={[stepSize]}
                onValueChange={(value) => onStepSizeChange(value[0])}
                min={0.001}
                max={0.1}
                step={0.001}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Visualization */}
        <Card className="p-4 bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_#000000]">
          <h3 className="text-lg font-bold text-black mb-3 font-['Space_Grotesk']">
            👁️ VISUALIZATION
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-black font-bold mb-2">
                MODE
              </label>
              <Select value={visualizationMode} onValueChange={onVisualizationModeChange}>
                <SelectTrigger className="w-full bg-white border-2 border-black font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="velocity">🌊 VELOCITY</SelectItem>
                  <SelectItem value="pressure">💨 PRESSURE</SelectItem>
                  <SelectItem value="vorticity">🌀 VORTICITY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-black font-bold">
                PARTICLE TRACERS
              </label>
              <Switch
                checked={showParticles}
                onCheckedChange={onShowParticlesChange}
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <Card className="p-4 bg-[#FF0080] border-4 border-black shadow-[4px_4px_0px_#000000]">
          <h3 className="text-lg font-bold text-white mb-3 font-['Space_Grotesk']">
            💾 ACTIONS
          </h3>
          <div className="space-y-2">
            <Button
              onClick={onSave}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-bold border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Save className="w-4 h-4 mr-2" />
              SAVE SIMULATION
            </Button>
            <Button
              onClick={onShare}
              className="w-full bg-orange-500 hover:bg-orange-400 text-black font-bold border-2 border-black shadow-[4px_4px_0px_#000000] hover:shadow-[2px_2px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <Share className="w-4 h-4 mr-2" />
              SHARE LINK
            </Button>
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-4 bg-white border-4 border-black shadow-[4px_4px_0px_#000000]">
          <h3 className="text-lg font-bold text-black mb-3 font-['Space_Grotesk']">
            📖 HOW TO USE
          </h3>
          <div className="text-sm text-black space-y-2">
            <p><strong>CLICK & DRAG:</strong> Add velocity & dye</p>
            <p><strong>VISCOSITY:</strong> Fluid thickness</p>
            <p><strong>DIFFUSION:</strong> Dye spreading</p>
            <p><strong>FLOW SPEED:</strong> Force multiplier</p>
            <p><strong>PARTICLES:</strong> Show streamlines</p>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
