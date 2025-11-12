import React, { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Login from './components/Login'
import ResourceForm from './components/ResourceForm'
import ResourceList from './components/ResourceList'

function App() {
  const [user, setUser] = useState(null)
  const [semesterFilter, setSemesterFilter] = useState('all')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [tab, setTab] = useState('explore')

  const onLogout = () => setUser(null)

  const filter = useMemo(()=>{
    const f = {}
    if (semesterFilter !== 'all') f.semester = Number(semesterFilter)
    if (subjectFilter.trim()) f.subject = subjectFilter.trim()
    return f
  }, [semesterFilter, subjectFilter])

  const TabButton = ({ id, children }) => (
    <button
      onClick={()=>setTab(id)}
      className={`relative px-3 py-2 rounded-md text-sm transition-colors ${tab===id?'text-white':''}`}
    >
      <span className={`${tab===id? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 text-white shadow-md':'bg-white/70 text-gray-700 border'} px-3 py-1.5 rounded-md inline-block transition-all`}>{children}</span>
      <AnimatePresence>
        {tab===id && (
          <motion.span
            layoutId="tab-underline"
            className="absolute inset-0 rounded-md"
            style={{ background: 'linear-gradient(90deg, rgba(79,70,229,.15), rgba(147,51,234,.15))' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </button>
  )

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-100" />
      <motion.div
        className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-gradient-to-br from-indigo-400/30 to-fuchsia-400/30 blur-3xl"
        animate={{ x: [0, 40, -20, 0], y: [0, 20, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-32 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-sky-400/30 to-violet-400/30 blur-3xl"
        animate={{ x: [0, -30, 10, 0], y: [0, -15, 25, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <Header user={user} onLogout={onLogout} />

      <main className="relative max-w-6xl mx-auto p-4">
        {!user ? (
          <Login onLogin={setUser} />
        ) : (
          <motion.div className="space-y-6 mt-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .4 }}>
            <div className="bg-white/70 backdrop-blur rounded-xl shadow border p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <TabButton id="explore">Explore</TabButton>
                <TabButton id="pending">Pending</TabButton>
                <TabButton id="submit">Submit</TabButton>
              </div>
              <div className="flex items-center gap-3">
                <select value={semesterFilter} onChange={e=>setSemesterFilter(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm bg-white/80">
                  <option value="all">All Semesters</option>
                  {Array.from({length:8}).map((_,i)=> <option key={i+1} value={i+1}>Sem {i+1}</option>)}
                </select>
                <input value={subjectFilter} onChange={e=>setSubjectFilter(e.target.value)} placeholder="Filter by subject" className="border rounded-md px-3 py-1.5 text-sm bg-white/80" />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {tab === 'submit' && (
                <motion.div key="submit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .25 }}>
                  <ResourceForm user={user} onCreated={()=>setTab('pending')} />
                </motion.div>
              )}

              {tab === 'pending' && (
                <motion.div key="pending" className="space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .25 }}>
                  <h3 className="font-semibold text-gray-800">Pending resources</h3>
                  <ResourceList user={user} filter={filter} pendingMode={true} />
                </motion.div>
              )}

              {tab === 'explore' && (
                <motion.div key="explore" className="space-y-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: .25 }}>
                  <h3 className="font-semibold text-gray-800">Explore approved resources</h3>
                  <ResourceList user={user} filter={filter} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <footer className="relative text-center text-xs text-gray-600 py-6">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 font-medium">Built for CSE students and teachers</span> • Live updates included
      </footer>
    </div>
  )
}

export default App
