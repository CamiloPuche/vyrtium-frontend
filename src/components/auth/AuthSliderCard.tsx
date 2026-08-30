'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import {
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import { getApiErrorMessage } from '../../lib/utils';

interface AuthSliderCardProps {
  initialMode?: 'login' | 'register';
}

export function AuthSliderCard({ initialMode = 'login' }: AuthSliderCardProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const router = useRouter();
  const { login, register, isAuthenticated, isLoading } = useAuth();

  // Auto-redirect if session is already active
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      setIsSubmittingLogin(true);
      await login({ email: loginEmail.trim(), password: loginPassword });
      toast.success('¡Inicio de sesión exitoso!');
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(err, 'Credenciales inválidas');
      toast.error(errorMsg);
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    if (registerPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    try {
      setIsSubmittingRegister(true);
      await register({
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
      });
      toast.success('¡Registro exitoso! Bienvenido a Vyrtium');
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMsg = getApiErrorMessage(err, 'Error al registrar usuario');
      toast.error(errorMsg);
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  return (
    <div className="relative w-full max-w-4xl min-h-[580px] bg-slate-100 rounded-[2.5rem] p-3 sm:p-4 shadow-2xl overflow-hidden border border-slate-200/80">
      {/* Back to Store link */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-30 inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ShoppingBag className="w-4 h-4 text-indigo-600" />
        <span>Ir a Inicio</span>
      </Link>

      <div className="relative w-full h-full min-h-[540px] flex overflow-hidden rounded-[2rem] bg-white">
        {/* ================= REGISTER FORM (Left side in Register mode) ================= */}
        <div
          className={`w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out ${
            mode === 'register'
              ? 'opacity-100 z-20 translate-x-0'
              : 'opacity-0 z-10 pointer-events-none md:translate-x-full'
          }`}
        >
          <div className="max-w-sm mx-auto w-full">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Crear Cuenta
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Regístrate para administrar inventario y productos
              </p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Nombre Completo
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Ej. Camilo Puche"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    placeholder="admin@vyrtium.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showRegisterPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingRegister}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-98 cursor-pointer mt-2"
              >
                {isSubmittingRegister ? 'Registrando...' : 'Registrarse'}
              </button>
            </form>

            {/* Mobile Switcher */}
            <div className="md:hidden mt-6 text-center">
              <p className="text-xs text-slate-500">
                ¿Ya tienes una cuenta?{' '}
                <button
                  onClick={() => setMode('login')}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Iniciar Sesión
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* ================= LOGIN FORM (Right side in Login mode) ================= */}
        <div
          className={`w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center transition-all duration-700 ease-in-out md:absolute md:right-0 md:h-full ${
            mode === 'login'
              ? 'opacity-100 z-20 translate-x-0'
              : 'opacity-0 z-10 pointer-events-none md:-translate-x-full'
          }`}
        >
          <div className="max-w-sm mx-auto w-full">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Iniciar Sesión
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ingresa tus credenciales para acceder al panel
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="usuario@ejemplo.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-98 cursor-pointer mt-2"
              >
                {isSubmittingLogin ? 'Iniciando...' : 'Iniciar Sesión'}
              </button>
            </form>

            {/* Mobile Switcher */}
            <div className="md:hidden mt-6 text-center">
              <p className="text-xs text-slate-500">
                ¿No tienes una cuenta?{' '}
                <button
                  onClick={() => setMode('register')}
                  className="font-bold text-indigo-600 hover:underline cursor-pointer"
                >
                  Registrarse
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* ================= ANIMATED SLIDING OVERLAY PANEL (DESKTOP) ================= */}
        <div
          className={`hidden md:flex absolute top-0 w-1/2 h-full z-30 transition-all duration-700 ease-in-out ${
            mode === 'login'
              ? 'left-0 translate-x-0'
              : 'left-0 translate-x-full'
          }`}
        >
          <div
            className={`w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white p-12 flex flex-col justify-between shadow-2xl transition-all duration-700 ${
              mode === 'login'
                ? 'rounded-r-[4rem] rounded-l-none'
                : 'rounded-l-[4rem] rounded-r-none'
            }`}
          >
            {/* Top brand header */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-indigo-200" />
              </div>
              <span className="text-xs font-black tracking-widest uppercase text-indigo-200">
                Vyrtium Core
              </span>
            </div>

            {/* Center Dynamic Content */}
            <div className="space-y-4 my-auto">
              {mode === 'login' ? (
                <>
                  <h3 className="text-3xl font-black tracking-tight leading-tight">
                    ¡Bienvenido de Vuelta!
                  </h3>
                  <p className="text-xs text-indigo-100 leading-relaxed max-w-xs">
                    ¿Aún no tienes una cuenta de administrador registrada en la plataforma?
                  </p>
                  <button
                    onClick={() => setMode('register')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-white/80 text-white text-xs font-bold hover:bg-white hover:text-indigo-700 transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    <span>Registrarse</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-black tracking-tight leading-tight">
                    ¡Hola de Nuevo!
                  </h3>
                  <p className="text-xs text-indigo-100 leading-relaxed max-w-xs">
                    ¿Ya posees una cuenta activa? Inicia sesión para acceder al panel de control.
                  </p>
                  <button
                    onClick={() => setMode('login')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border-2 border-white/80 text-white text-xs font-bold hover:bg-white hover:text-indigo-700 transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    <span>Iniciar Sesión</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
