// src/components/interactions/MicroInteractions.tsx
// Sistema de micro-interações para melhorar UX

import React, { useState, useEffect } from 'react';

// Componente de botão com micro-interações
interface InteractiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function InteractiveButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = ''
}: InteractiveButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);

  const variants = {
    primary: 'bg-green-500 hover:bg-green-600 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    // Criar efeito ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setRipple({ x, y });

    // Limpar ripple após animação
    setTimeout(() => setRipple(null), 600);

    if (onClick) onClick();
  };

  return (
    <button
      className={`
        relative overflow-hidden rounded-lg font-medium transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${isPressed ? 'scale-95' : 'hover:scale-105'}
        ${loading ? 'cursor-wait' : ''}
        ${className}
      `}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={disabled || loading}
    >
      {/* Efeito ripple */}
      {ripple && (
        <div
          className="absolute bg-white bg-opacity-30 rounded-full animate-ping pointer-events-none"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20
          }}
        />
      )}

      {/* Conteúdo do botão */}
      <span className={`relative z-10 ${loading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>

      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}

// Componente de input com micro-interações
interface InteractiveInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  label?: string;
  error?: string;
  success?: boolean;
  className?: string;
}

export function InteractiveInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  label,
  error,
  success,
  className = ''
}: InteractiveInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className={`
          absolute left-3 transition-all duration-200 pointer-events-none
          ${isFocused || hasValue 
            ? 'top-1 text-xs text-gray-500' 
            : 'top-3 text-sm text-gray-400'
          }
        `}>
          {label}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={!label ? placeholder : ''}
        className={`
          w-full px-3 py-3 border-2 rounded-lg transition-all duration-200
          focus:outline-none focus:ring-0
          ${error 
            ? 'border-red-300 bg-red-50 focus:border-red-500' 
            : success 
            ? 'border-green-300 bg-green-50 focus:border-green-500'
            : 'border-gray-300 bg-white focus:border-green-500'
          }
          ${label ? 'pt-6 pb-2' : ''}
        `}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 animate-shake">
          {error}
        </p>
      )}
      
      {success && (
        <div className="absolute right-3 top-3 text-green-500">
          ✓
        </div>
      )}
    </div>
  );
}

// Componente de card com hover effects
interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  hover?: boolean;
  className?: string;
}

export function InteractiveCard({ children, onClick, hover = true, className = '' }: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-300
        ${hover ? 'hover:shadow-lg hover:scale-105' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${isHovered ? 'shadow-xl' : ''}
        ${className}
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}

// Componente de progresso com animação
interface AnimatedProgressProps {
  progress: number;
  label?: string;
  color?: 'green' | 'blue' | 'purple' | 'orange';
  className?: string;
}

export function AnimatedProgress({ 
  progress, 
  label, 
  color = 'green', 
  className = '' 
}: AnimatedProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);

    return () => clearTimeout(timer);
  }, [progress]);

  const colors = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{label}</span>
          <span>{Math.round(animatedProgress)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-1000 ease-out ${colors[color]}`}
          style={{ width: `${animatedProgress}%` }}
        />
      </div>
    </div>
  );
}

// Componente de confetti para celebrações
interface ConfettiProps {
  active: boolean;
  onComplete?: () => void;
}

export function Confetti({ active, onComplete }: ConfettiProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    rotation: number;
    velocity: { x: number; y: number };
  }>>([]);

  useEffect(() => {
    if (!active) return;

    // Criar partículas de confetti
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)] as string,
      rotation: Math.random() * 360,
      velocity: {
        x: (Math.random() - 0.5) * 4,
        y: Math.random() * 3 + 2
      }
    }));

    setParticles(newParticles);

    // Animar partículas
    const animate = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.velocity.x,
          y: particle.y + particle.velocity.y,
          rotation: particle.rotation + 5
        })).filter(particle => particle.y < window.innerHeight + 50)
      );
    };

    const interval = setInterval(animate, 16);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setParticles([]);
      if (onComplete) onComplete();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [active, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            borderRadius: '50%'
          }}
        />
      ))}
    </div>
  );
}

// Hook para animações de entrada
export function useFadeIn(delay = 0) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return {
    isVisible,
    className: `transition-all duration-500 ${
      isVisible 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-4'
    }`
  };
}
