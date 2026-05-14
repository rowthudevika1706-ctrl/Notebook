import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { verifyOTP } from "../helper/api";

// ✅ Schema for OTP verification
const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

const VerifyOtpForm = ({ userId, setStep }) => {
  const [errorShake, setErrorShake] = useState(false);

  const form = useForm({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      // Example API call:
      await verifyOTP({ userId, otp: values.otp });
      toast.success(`OTP Verified Successfully ${values.otp}`);
      setStep("PASSWORD");
    } catch (error) {
      toast.error(error.message || "OTP verification failed 😢");
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 600);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        animate={errorShake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <Card className="min-w-[400px] p-8 rounded-2xl shadow-lg border border-border/50 backdrop-blur-md bg-card/70">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 w-full"
            >
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-center"
              >
                Verify OTP
              </motion.h1>

              {/* OTP Input */}
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OTP</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 6-digit OTP"
                        type="text"
                        maxLength={6}
                        inputMode="numeric"
                        {...field}
                        className="transition-all focus:ring-2 focus:ring-primary/50 tracking-widest"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="h-11 text-lg relative overflow-hidden"
              >
                <AnimatePresence>
                  {form.formState.isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Verifying...
                    </motion.div>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Verify →
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </form>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyOtpForm;
