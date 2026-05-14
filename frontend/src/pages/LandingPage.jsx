import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { BookOpen, Pen, Layers, Sparkles, Zap, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PhysicsHero from "../components/PhysicsHero";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Physics Background */}
      <div className="absolute inset-0 pointer-events-none">
        <PhysicsHero />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 pointer-events-none">
        <div className="container mx-auto px-4 md:py-20 py-5">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="border border-border px-4 py-2 rounded-full text-sm text-muted-foreground backdrop-blur-sm bg-card/30">
                ✨ The modern note-taking experience
              </div>
            </motion.div>

            <h1 className="text-8xl md:text-9xl font-bold mb-8 tracking-tighter">
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="inline-block"
              >
                One
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-block"
              >
                Note
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Capture ideas, organize thoughts, and bring your notes to life in
              a beautifully minimal workspace
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex gap-4 justify-center items-center flex-wrap"
            >
              <Button
                size="lg"
                onClick={() => navigate("/notebook")}
                className="text-lg px-8 py-6 pointer-events-auto group"
              >
                Start Writing
                <motion.span
                  className="inline-block ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/docs")}
                className="text-lg px-8 py-6 pointer-events-auto backdrop-blur-sm"
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
            transition={{ duration: 0.4 }}
            className="max-w-2xl mx-auto p-6 border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm flex items-start gap-4 mb-6"
          >
            <Pen className="w-6 h-6 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">AI Notes & Drawing</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Generate Notes:</strong> Automatically create structured
                notes using AI.
                <br />
                <strong>Optimize Notes:</strong> Refine your notes for clarity
                and conciseness.
                <br />
                <strong>Canvas Drawing:</strong> Generate and optimize drawings
                in real-time with AI.
              </p>
            </div>
          </motion.div>
          {/* Additional Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            <div className="p-6 border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm pointer-events-auto flex items-start gap-4">
              <Sparkles className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Clean Interface</h4>
                <p className="text-sm text-muted-foreground">
                  Minimal design that keeps you focused
                </p>
              </div>
            </div>

            <div className="p-6 border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm pointer-events-auto flex items-start gap-4">
              <Zap className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Lightning Fast</h4>
                <p className="text-sm text-muted-foreground">
                  Instant response, zero lag
                </p>
              </div>
            </div>

            <div className="p-6 border border-border/50 rounded-xl bg-card/40 backdrop-blur-sm pointer-events-auto flex items-start gap-4">
              <Lock className="w-6 h-6 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Private & Secure</h4>
                <p className="text-sm text-muted-foreground">
                  Your notes, your data
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
