import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { auth_api } from "../helper/api";
import useUserStore from "@/store/userStore";
import PhysicsHero from "../components/PhysicsHero";

// ✅ Schema
const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const Auth = () => {
  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const response = await auth_api(values);
      toast.success("Login successful 🎉");
      setUser(response.user);
      navigate("/notebook");
    } catch (error) {
      toast.error(error.message || "Login failed 😢");
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 600);
    }
  };

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
                Note Book
              </motion.h1>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        {...field}
                        className="transition-all focus:ring-2 focus:ring-primary/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          {...field}
                          className="pr-10 transition-all focus:ring-2 focus:ring-primary/50"
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
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
                      Get Starting...
                    </motion.div>
                  ) : (
                    <motion.span
                      key="text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Get Started →
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>

              {/* Forgot Password */}
              <p className="text-sm text-center mt-2">
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-blue-600 cursor-pointer hover:underline"
                >
                  Forgot Password?
                </span>
              </p>
            </form>
          </Form>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Auth;
