import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowUpRight } from 'lucide-react'

const ROLES = [
  {
    id: 'player',
    label: 'Player',
    desc: 'Track Performance, View Stats.',
    emoji: '🏆',
  },
  {
    id: 'coach',
    label: 'Coach',
    desc: 'Manage Team, Track Players',
    emoji: '👨‍🏫',
  },
  {
    id: 'parent',
    label: 'Parent',
    desc: 'Track Child Progress Easily',
    emoji: '👨‍👩‍👦',
  },
]

export default function WelcomeScreen({ onComplete }) {
  const [selectedRole, setSelectedRole] = useState('coach')

  const handleContinue = () => {
    onComplete(selectedRole)
  }

  return (
    <div className="relative min-h-dvh bg-dark-900 flex flex-col overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=1000&auto=format&fit=crop" 
          alt="Cricket Kids" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/10 via-dark-900/60 to-dark-900" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/90 to-transparent h-3/4 top-auto" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-6 pb-10 pt-20">
        
        {/* Header Text */}
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-bold leading-tight text-white mb-2">
            Welcome to<br />
            Cricket Academy
          </h1>
          <p className="text-dark-300 text-sm">Choose your role to get started</p>
        </div>

        {/* Role Selection Cards */}
        <div className="space-y-4 mb-8">
          {ROLES.map((role) => {
            const isSelected = selectedRole === role.id
            return (
              <motion.button
                key={role.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedRole(role.id)}
                className={`w-full flex items-center p-4 rounded-2xl border transition-all duration-300 ${
                  isSelected 
                    ? 'bg-dark-800/80 border-orange shadow-[0_0_15px_rgba(245,166,35,0.15)]' 
                    : 'bg-dark-800/50 border-dark-700 hover:border-dark-600'
                }`}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-dark-700/50 flex items-center justify-center text-2xl mr-4">
                  {role.emoji}
                </div>
                
                {/* Text */}
                <div className="flex-1 text-left">
                  <h3 className="text-white font-semibold text-base">{role.label}</h3>
                  <p className="text-dark-300 text-xs mt-0.5">{role.desc}</p>
                </div>

                {/* Radio/Check */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-orange text-white' : 'border-2 border-dark-600'
                }`}>
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Footer Text */}
        <p className="text-center text-dark-400 text-xs mb-8">
          You can change your role anytime in settings
        </p>

        {/* Bottom Navigation / Pagination */}
        <div className="flex items-center justify-between mt-auto">
          {/* Pagination Dots */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-2 rounded-full bg-orange" />
            <div className="w-2 h-2 rounded-full bg-dark-600" />
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="w-14 h-14 rounded-full bg-orange flex items-center justify-center text-white shadow-[0_0_20px_rgba(245,166,35,0.3)]"
          >
            <ArrowUpRight size={24} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
