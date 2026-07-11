import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { Pill, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useLoginMutation } from '../hooks/useAuthMutations';

export default function LoginPage() {
  const { mutate, isPending } = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(formData);
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-x-hidden">
      
      {/* Left Column: Brand Hero & Value Prop (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#075985] via-[#0369a1] to-[#0284c7] overflow-hidden items-center justify-center p-16 xl:p-20">
        
        {/* Animated ambient glowing backdrops in vibrant Sky Blue */}
        <motion.div 
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#bae6fd]/15 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{
            scale: [1.1, 1, 1.1],
            x: [0, -30, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-[#0284c7]/25 rounded-full blur-[120px]" 
        />
        
        {/* Concentric rotating tech circles */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute right-[-10%] top-[15%] w-[450px] h-[450px] border-[2px] border-dashed border-white/10 rounded-full pointer-events-none" 
        />

        {/* Left Column Content Container */}
        <div className="relative z-10 w-full max-w-md flex flex-col justify-between h-full pr-8">
          {/* Logo Brand */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-10 h-10 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-md">
              <Pill className="w-5 h-5 text-[#bae6fd]" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">PharmaBridge</span>
          </motion.div>

          {/* Hero text & bullets */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6 my-auto"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#bae6fd]/15 border border-[#bae6fd]/25 backdrop-blur-sm text-xs font-semibold text-[#bae6fd] w-fit"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Premium Healthcare Solutions</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl xl:text-5xl font-serif font-bold text-white tracking-tight leading-[1.15]"
            >
              Connecting Health, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#bae6fd] to-[#bae6fd]">
                Bridging Care.
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-[#bae6fd]/85 text-sm leading-relaxed font-normal"
            >
              Join a unified network connecting patients and pharmacy stores. Track medication, request orders, and verify prescriptions instantly.
            </motion.p>

            {/* List of inline features */}
            <motion.div variants={itemVariants} className="space-y-3 pt-4 text-xs text-[#bae6fd]/90 border-t border-white/10">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-white/10 rounded-md">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span>Direct Patient Connection</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 bg-white/10 rounded-md">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <span>Safe & Secure Platform</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Footer status */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="pt-4 border-t border-white/10 flex justify-between items-center text-[#bae6fd]/60 text-xs"
          >
            <span>© 2026 PharmaBridge</span>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bae6fd] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#bae6fd]"></span>
              </span>
              <span>Active</span>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Wave Divider cutting into the dark column */}
        <svg
          className="absolute right-0 top-0 h-full w-32 text-white fill-current translate-x-[1px] pointer-events-none z-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.path
          
            animate={{
              d: [
                "M100,0 L0,0 C30,20 30,80 0,100 L100,100 Z",
                "M100,0 L0,0 C45,30 15,70 0,100 L100,100 Z",
                "M100,0 L0,0 C15,15 45,85 0,100 L100,100 Z",
                "M100,0 L0,0 C30,20 30,80 0,100 L100,100 Z"
              ]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </div>

      {/* Right Column: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-12 xl:px-20 py-12 bg-white relative overflow-hidden">
        
        {/* Ambient light graphic for mobile/tablet screens */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-[60%] h-[30%] bg-[#bae6fd]/20 rounded-full blur-3xl -z-10" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto w-full max-w-md"
        >
          {/* Brand Logo for Mobile */}
          <div className="flex lg:hidden justify-center mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#0284c7] rounded-xl flex items-center justify-center shadow-md">
                <Pill className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0369a1] font-sans">PharmaBridge</span>
            </div>
          </div>

          <div className="text-center lg:text-left mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#bae6fd]/30 text-[#0369a1] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>Welcome back to PharmaBridge</span>
            </div>
            <h2 className="text-3xl font-serif font-bold text-[#0369a1] tracking-tight font-sans">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Please sign in to your account or{' '}
              <Link to="/register" className="font-semibold text-[#0284c7] hover:text-[#0369a1] hover:underline transition-all">
                create an account
              </Link>
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Inputs Container */}
            <div className="space-y-4">
              
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#0284c7]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-[#bae6fd] rounded-xl placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] sm:text-sm transition-all bg-[#F8FAFC] focus:bg-white text-[#0369a1]"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                    Password
                  </label>
                  <Link to="/forget-password" className="text-xs font-semibold text-[#0284c7] hover:text-[#0369a1] transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#0284c7]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="appearance-none block w-full pl-10 pr-10 py-2.5 border border-[#bae6fd] rounded-xl placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#0284c7]/10 focus:border-[#0284c7] sm:text-sm transition-all bg-[#F8FAFC] focus:bg-white text-[#0369a1]"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-[#0369a1] transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <motion.button
                type="submit"
                disabled={isPending}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-[#0284c7]/10 text-sm font-bold text-white bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#0284c7] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </motion.button>
            </div>
          </form>

          {/* Policy disclaimer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 leading-relaxed">
              By signing in, you agree to our{' '}
              <a href="#" className="font-semibold text-slate-500 hover:text-[#0369a1] underline">Terms of Service</a> and{' '}
              <a href="#" className="font-semibold text-slate-500 hover:text-[#0369a1] underline">Privacy Policy</a>.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
