import { motion } from 'framer-motion'
import { Home, Calendar, Trophy, MessageCircle, User } from 'lucide-react'

export default function BottomNav({ active, onChange }) {
  const tabs = [
    { id: 'home', icon: Home },
    { id: 'schedule', icon: Calendar },
    { id: 'leaderboard', icon: Trophy },
    { id: 'chat', icon: MessageCircle },
    { id: 'profile', icon: User },
  ]

  return (
    <div className="bg-[#161616] rounded-full p-1.5 flex items-center justify-between shadow-2xl">
      {tabs.map((tab) => {
        const isActive = active === tab.id
        const Icon = tab.icon
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="relative w-[56px] h-[56px] rounded-full flex items-center justify-center transition-colors"
          >
            {/* Inactive Background */}
            {!isActive && (
              <div className="absolute inset-0 bg-[#222222] rounded-full" />
            )}
            
            {/* Active Background */}
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-orange rounded-full"
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              />
            )}
            
            {/* Icon */}
            <Icon 
              size={24} 
              strokeWidth={1.5}
              className="relative z-10 text-white" 
            />
          </button>
        )
      })}
    </div>
  )
}
