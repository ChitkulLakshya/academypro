import { useState } from 'react'
import { motion } from 'framer-motion'
import { ANIM } from '../utils/constants'
import { ACADEMY_INFO, CURRENT_USER } from '../data/mockData'
import { GearIcon, BellIcon, UserIcon } from './BottomNav'

const SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'profile', icon: '👤', label: 'Edit Profile', desc: 'Name, avatar, contact info' },
      { id: 'password', icon: '🔒', label: 'Change Password', desc: 'Update your credentials' },
      { id: 'email', icon: '📧', label: 'Email Preferences', desc: 'Manage notification emails' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { id: 'push', icon: '🔔', label: 'Push Notifications', desc: 'Session reminders, reviews', toggle: true },
      { id: 'sound', icon: '🔊', label: 'Sound', desc: 'In-app notification sounds', toggle: true },
      { id: 'vibrate', icon: '📳', label: 'Vibration', desc: 'Haptic feedback on actions', toggle: true },
    ],
  },
  {
    title: 'Appearance',
    items: [
      { id: 'theme', icon: '🎨', label: 'Theme', desc: 'Dark mode is always on' },
      { id: 'accent', icon: '🟠', label: 'Accent Color', desc: 'Orange (default)' },
      { id: 'font', icon: '🔤', label: 'Font Size', desc: 'Adjust text scaling' },
    ],
  },
  {
    title: 'Data & Privacy',
    items: [
      { id: 'export', icon: '📤', label: 'Export Data', desc: 'Download your academy data' },
      { id: 'cache', icon: '🗑️', label: 'Clear Cache', desc: 'Free up storage space' },
      { id: 'privacy', icon: '🛡️', label: 'Privacy Policy', desc: 'How we handle your data' },
    ],
  },
  {
    title: 'About',
    items: [
      { id: 'version', icon: 'ℹ️', label: 'App Version', desc: 'v1.0.0-beta' },
      { id: 'feedback', icon: '💬', label: 'Send Feedback', desc: 'Help us improve' },
      { id: 'rate', icon: '⭐', label: 'Rate AcademyPro', desc: 'Leave a review' },
    ],
  },
]

export default function SettingsScreen({ onBack }) {
  const [toggleStates, setToggleStates] = useState({
    push: true,
    sound: true,
    vibrate: false,
  })

  const handleToggle = (id) => {
    setToggleStates(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <motion.div
      className="px-4 pt-12 pb-4 min-h-screen"
      variants={ANIM.stagger}
      initial="hidden"
      animate="show"
    >
      {/* header */}
      <motion.div variants={ANIM.fadeUp} className="flex items-center gap-3 mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9a9a9e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <div>
          <h1 className="text-xl font-bold">Settings</h1>
          <p className="text-xs text-dark-400 mt-0.5">Manage your preferences</p>
        </div>
      </motion.div>

      {/* user card */}
      <motion.div variants={ANIM.fadeUp} className="card p-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center text-dark-950 font-bold text-lg">
            {CURRENT_USER.name.split(' ').map(w => w[0]).join('')}
          </div>
          <div className="flex-1">
            <h2 className="font-bold">{CURRENT_USER.name}</h2>
            <p className="text-xs text-dark-400 mt-0.5">{CURRENT_USER.role} · {ACADEMY_INFO.shortName}</p>
          </div>
          <button className="text-xs font-medium text-orange bg-orange/10 px-3 py-1.5 rounded-lg">
            Edit
          </button>
        </div>
      </motion.div>

      {/* quick stats row */}
      <motion.div variants={ANIM.fadeUp} className="grid grid-cols-3 gap-2.5 mb-5">
        <QuickStat label="Sessions" value="42" icon="📅" />
        <QuickStat label="Reviews" value="128" icon="📝" />
        <QuickStat label="Players" value="50" icon="👥" />
      </motion.div>

      {/* settings sections */}
      {SECTIONS.map(section => (
        <motion.div key={section.title} variants={ANIM.fadeUp} className="mb-5">
          <h3 className="text-[11px] text-dark-500 font-semibold uppercase tracking-wider mb-2 px-1">
            {section.title}
          </h3>
          <div className="card overflow-hidden">
            {section.items.map((item, idx) => (
              <SettingsRow
                key={item.id}
                item={item}
                isLast={idx === section.items.length - 1}
                toggleState={toggleStates[item.id]}
                onToggle={() => handleToggle(item.id)}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {/* danger zone */}
      <motion.div variants={ANIM.fadeUp} className="mb-5">
        <h3 className="text-[11px] text-danger/70 font-semibold uppercase tracking-wider mb-2 px-1">
          Danger Zone
        </h3>
        <div className="card overflow-hidden">
          <button className="w-full flex items-center gap-3 p-4 hover:bg-dark-700/30 transition-colors">
            <span className="text-base">🚪</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-danger">Log Out</p>
              <p className="text-[11px] text-dark-500">Sign out of your account</p>
            </div>
          </button>
          <div className="h-px bg-dark-700 mx-4" />
          <button className="w-full flex items-center gap-3 p-4 hover:bg-dark-700/30 transition-colors">
            <span className="text-base">⚠️</span>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium text-danger">Delete Account</p>
              <p className="text-[11px] text-dark-500">Permanently remove all data</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* footer */}
      <motion.div variants={ANIM.fadeUp} className="text-center py-4">
        <p className="text-[11px] text-dark-600">AcademyPro v1.0.0-beta</p>
        <p className="text-[10px] text-dark-700 mt-1">Made with ❤️ for sports coaches</p>
      </motion.div>
    </motion.div>
  )
}

function SettingsRow({ item, isLast, toggleState, onToggle }) {
  return (
    <>
      <button
        className="w-full flex items-center gap-3 p-4 hover:bg-dark-700/30 transition-colors active:bg-dark-700/50"
        onClick={item.toggle ? onToggle : undefined}
      >
        <span className="text-base shrink-0">{item.icon}</span>
        <div className="flex-1 text-left">
          <p className="text-sm font-medium">{item.label}</p>
          <p className="text-[11px] text-dark-500">{item.desc}</p>
        </div>
        {item.toggle ? (
          <ToggleSwitch on={toggleState} />
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </button>
      {!isLast && <div className="h-px bg-dark-700 mx-4" />}
    </>
  )
}

function ToggleSwitch({ on }) {
  return (
    <div className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${on ? 'bg-orange' : 'bg-dark-600'}`}>
      <motion.div
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
        animate={{ left: on ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </div>
  )
}

function QuickStat({ label, value, icon }) {
  return (
    <div className="card-inner p-3.5 text-center">
      <span className="text-lg block mb-1">{icon}</span>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] text-dark-400 mt-0.5">{label}</p>
    </div>
  )
}

// exported for reuse
export function SettingToggle({ label, desc, on, onToggle }) {
  return (
    <button
      className="w-full flex items-center justify-between p-3 card-inner"
      onClick={onToggle}
    >
      <div>
        <p className="text-sm font-medium">{label}</p>
        {desc && <p className="text-[10px] text-dark-500 mt-0.5">{desc}</p>}
      </div>
      <ToggleSwitch on={on} />
    </button>
  )
}
