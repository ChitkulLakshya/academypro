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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="bg-dark-800/90 backdrop-blur-md border border-dark-700 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
        {tabs.map((tab) => {
          const isActive = active === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative p-2 rounded-full transition-colors"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-orange rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              <Icon 
                size={24} 
                className={`relative z-10 transition-colors ${isActive ? 'text-white' : 'text-dark-400 hover:text-dark-200'}`} 
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
