import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Waves, 
  Zap, 
  Palette, 
  Settings, 
  Share2, 
  Download,
  Play,
  ArrowRight,
  Sparkles
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <Waves className="w-8 h-8" />,
      title: "REAL-TIME SIMULATION",
      description: "Watch fluid dynamics unfold in real-time with advanced numerical solvers",
      color: "bg-[#0080FF]"
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "VIBRANT VISUALIZATION", 
      description: "See velocity, pressure, and vorticity with stunning color gradients",
      color: "bg-[#FF0080]"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "INTERACTIVE FORCES",
      description: "Click and drag to add velocity fields and inject colorful dye",
      color: "bg-[#00FF80]"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "PHYSICS CONTROLS",
      description: "Adjust viscosity, diffusion, and flow parameters in real-time",
      color: "bg-yellow-400"
    },
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "SHARE SIMULATIONS",
      description: "Generate unique links to share your fluid masterpieces",
      color: "bg-orange-500"
    },
    {
      icon: <Download className="w-8 h-8" />,
      title: "EXPORT FRAMES",
      description: "Save beautiful snapshots of your fluid simulations",
      color: "bg-purple-500"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-[#FF0080] via-[#0080FF] to-[#00FF80]"
    >
      {/* Navigation */}
      <nav className="p-6 flex justify-between items-center">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center">
            <Waves className="w-6 h-6 text-[#0080FF]" />
          </div>
          <h1 className="text-2xl font-bold text-white font-['Space_Grotesk'] drop-shadow-[2px_2px_0px_#000000]">
            FLUID DYNAMICS
          </h1>
        </motion.div>

        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="flex gap-4"
        >
          {isAuthenticated ? (
            <Button
              onClick={() => navigate('/simulator')}
              className="bg-white hover:bg-gray-100 text-black font-bold border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all px-6 py-3"
            >
              <Play className="w-5 h-5 mr-2" />
              LAUNCH SIMULATOR
            </Button>
          ) : (
            <Button
              onClick={() => navigate('/auth')}
              className="bg-white hover:bg-gray-100 text-black font-bold border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all px-6 py-3"
            >
              GET STARTED
            </Button>
          )}
        </motion.div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl font-bold text-white mb-6 font-['Space_Grotesk'] drop-shadow-[8px_8px_0px_#000000] leading-tight">
            FLUID DYNAMICS
            <br />
            <span className="text-yellow-400">VISUALIZER</span>
          </h1>
          
          <p className="text-2xl text-white font-bold mb-8 drop-shadow-[4px_4px_0px_#000000] max-w-3xl mx-auto">
            🌊 SIMULATE • 🎨 VISUALIZE • 🔬 EXPLORE
            <br />
            Real-time fluid flow simulation in your browser
          </p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-6"
          >
            <Button
              onClick={() => navigate(isAuthenticated ? '/simulator' : '/auth')}
              className="bg-[#FF0080] hover:bg-[#CC0066] text-white font-bold border-4 border-black shadow-[12px_12px_0px_#000000] hover:shadow-[6px_6px_0px_#000000] hover:translate-x-[6px] hover:translate-y-[6px] transition-all px-12 py-6 text-2xl"
            >
              <Sparkles className="w-8 h-8 mr-3" />
              START SIMULATING
              <ArrowRight className="w-8 h-8 ml-3" />
            </Button>
          </motion.div>
        </motion.div>

        {/* Demo Preview */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-20 flex justify-center"
        >
          <div className="relative">
            <div className="w-96 h-72 bg-black border-8 border-white shadow-[16px_16px_0px_#000000] relative overflow-hidden">
              {/* Animated fluid preview */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0080FF] via-[#FF0080] to-[#00FF80] opacity-70 animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white font-bold text-xl font-['Space_Grotesk'] drop-shadow-[2px_2px_0px_#000000]">
                  🌊 LIVE PREVIEW 🌊
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-yellow-400 border-4 border-black shadow-[8px_8px_0px_#000000] px-4 py-2 rotate-12">
              <span className="font-bold text-black font-['Space_Grotesk']">INTERACTIVE!</span>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                rotate: Math.random() > 0.5 ? 2 : -2,
                transition: { duration: 0.2 }
              }}
            >
              <Card className={`${feature.color} border-4 border-black shadow-[8px_8px_0px_#000000] p-6 h-full hover:shadow-[12px_12px_0px_#000000] hover:translate-x-[-4px] hover:translate-y-[-4px] transition-all cursor-pointer`}>
                <div className="text-center">
                  <div className="mb-4 flex justify-center text-black">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-3 font-['Space_Grotesk']">
                    {feature.title}
                  </h3>
                  <p className="text-black font-medium">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <Card className="bg-white border-8 border-black shadow-[16px_16px_0px_#000000] p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-black mb-6 font-['Space_Grotesk']">
              READY TO DIVE INTO FLUID DYNAMICS?
            </h2>
            <p className="text-xl text-black mb-8 font-medium">
              Join thousands of scientists, students, and curious minds exploring the beauty of fluid flow.
              No installation required - start simulating in seconds!
            </p>
            <Button
              onClick={() => navigate(isAuthenticated ? '/simulator' : '/auth')}
              className="bg-[#00FF80] hover:bg-[#00CC66] text-black font-bold border-4 border-black shadow-[8px_8px_0px_#000000] hover:shadow-[4px_4px_0px_#000000] hover:translate-x-[4px] hover:translate-y-[4px] transition-all px-8 py-4 text-xl"
            >
              <Waves className="w-6 h-6 mr-3" />
              LAUNCH SIMULATOR NOW
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t-8 border-black bg-white p-8 mt-20">
        <div className="container mx-auto text-center">
          <p className="text-black font-bold font-['Space_Grotesk']">
            Built with ❤️ for fluid dynamics enthusiasts everywhere
          </p>
          <p className="text-black mt-2">
            Powered by advanced numerical methods and modern web technology
          </p>
        </div>
      </footer>
    </motion.div>
  );
}