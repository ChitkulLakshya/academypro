import { motion } from 'framer-motion'
import { Bell, Zap, Award, TrendingUp, Star } from 'lucide-react'

export default function HomeScreen() {
  return (
    <div className="min-h-dvh bg-dark-900 text-white pb-24 px-6 pt-12 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
            alt="Alex Johnson"
            className="w-10 h-10 rounded-full bg-dark-700 border border-dark-600"
          />
          <div>
            <p className="text-dark-300 text-xs">Hi 👋</p>
            <p className="font-semibold text-sm">Alex Johnson</p>
          </div>
        </div>
        <button className="w-10 h-10 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center">
          <Bell size={18} className="text-white" />
        </button>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-[28px] font-bold leading-tight">
          Welcome Back,<br />
          Track Performance
        </h1>
      </div>

      {/* Main Performance Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-dark-800 to-dark-900 rounded-[32px] p-6 mb-6 border border-dark-700/50 shadow-lg relative overflow-hidden"
      >
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-orange/10 blur-3xl rounded-full pointer-events-none" />

        {/* Team Info */}
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-xl">
              🏏
            </div>
            <span className="font-semibold text-lg">Lions U19</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center font-bold text-white">
            78
          </div>
        </div>

        {/* Progress */}
        <div className="text-center mb-4 relative z-10">
          <h2 className="text-[40px] font-bold mb-2">67%</h2>
          
          {/* Custom Progress Bar */}
          <div className="relative h-2 bg-dark-700 rounded-full mt-4">
            <div className="absolute top-0 left-0 h-full w-[67%] bg-gradient-to-r from-orange-dark to-orange rounded-full" />
            {/* Thumb */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[67%] -translate-x-1/2 w-4 h-4 bg-orange rounded-full border-2 border-dark-900 shadow-[0_0_10px_rgba(245,166,35,0.5)]" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Batting */}
        <StatCard 
          icon={<Zap size={16} className="text-success" />} 
          iconBg="bg-success/20"
          title="Batting" 
          value="82" 
          color="bg-success" 
        />
        {/* Bowling */}
        <StatCard 
          icon={<Award size={16} className="text-orange" />} 
          iconBg="bg-orange/20"
          title="Bowling" 
          value="82" 
          color="bg-orange" 
        />
        {/* Fielding */}
        <StatCard 
          icon={<TrendingUp size={16} className="text-danger" />} 
          iconBg="bg-danger/20"
          title="Fielding" 
          value="75" 
          color="bg-danger" 
        />
        {/* Fitness */}
        <StatCard 
          icon={<Star size={16} className="text-info" />} 
          iconBg="bg-info/20"
          title="Fitness" 
          value="85" 
          color="bg-info" 
        />
      </div>

      {/* Quick Stats Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
          <div className="min-w-[140px] bg-dark-800 rounded-2xl p-4 border border-dark-700">
            <p className="text-dark-300 text-xs mb-1">Runs This Season</p>
            <p className="text-xl font-bold">450</p>
          </div>
          <div className="min-w-[140px] bg-dark-800 rounded-2xl p-4 border border-dark-700">
            <p className="text-dark-300 text-xs mb-1">Wickets Taken</p>
            <p className="text-xl font-bold">24</p>
          </div>
          <div className="min-w-[140px] bg-dark-800 rounded-2xl p-4 border border-dark-700">
            <p className="text-dark-300 text-xs mb-1">Catches</p>
            <p className="text-xl font-bold">12</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, iconBg, title, value, color }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-dark-800 rounded-[24px] p-4 border border-dark-700"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${iconBg}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-dark-200">{title}</span>
      </div>
      <div className="text-[28px] font-bold mb-3">{value}</div>
      
      {/* Dashed Progress Bar */}
      <div className="flex gap-1 h-1.5">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-sm skew-x-[-20deg] ${i < parseInt(value) / 10 ? color : 'bg-dark-700'}`} 
          />
        ))}
      </div>
    </motion.div>
  )
}
