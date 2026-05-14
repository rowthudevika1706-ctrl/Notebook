import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import PhysicsHero from "../components/PhysicsHero";
import VerifyOtpForm from "../components/VerifyOtpForm";
import ConformPassword from "../components/ConformPassword";

const VerifyOTP = () => {
  const { userId } = useParams();
  const [step, setStep] = useState("OTP");

  return (
    <motion.div
      className="w-screen h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/80 to-card/80"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <PhysicsHero />
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/40 to-background/80 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-foreground/5 rounded-full blur-3xl pointer-events-none" />

      <div>
        {step === "OTP" ? (
          <VerifyOtpForm userId={userId} setStep={setStep} />
        ) : (
          <ConformPassword userId={userId} />
        )}
      </div>
    </motion.div>
  );
};
export default VerifyOTP;
