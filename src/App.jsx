import React, { useEffect, useMemo, useState } from 'react'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-violet-50">
      <Header user={user} onLogout={onLogout} />

      <main className="max-w-6xl mx-auto p-4">
        {!user ? (
          <Login onLogin={setUser} />
        ) : (
          <div className="space-y-6 mt-6">
            <div className="bg-white/80 backdrop-blur rounded-xl shadow border p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button className={`px-3 py-1.5 rounded-md text-sm ${tab==='explore'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setTab('explore')}>Explore</button>
                <button className={`px-3 py-1.5 rounded-md text-sm ${tab==='pending'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setTab('pending')}>Pending</button>
                <button className={`px-3 py-1.5 rounded-md text-sm ${tab==='submit'?'bg-blue-600 text-white':'bg-gray-100'}`} onClick={()=>setTab('submit')}>Submit</button>
              </div>
              <div className="flex items-center gap-3">
                <select value={semesterFilter} onChange={e=>setSemesterFilter(e.target.value)} className="border rounded-md px-3 py-1.5 text-sm">
                  <option value="all">All Semesters</option>
                  {Array.from({length:8}).map((_,i)=> <option key={i+1} value={i+1}>Sem {i+1}</option>)}
                </select>
                <input value={subjectFilter} onChange={e=>setSubjectFilter(e.target.value)} placeholder="Filter by subject" className="border rounded-md px-3 py-1.5 text-sm" />
              </div>
            </div>

            {tab === 'submit' && (
              <ResourceForm user={user} onCreated={()=>setTab('pending')} />
            )}

            {tab === 'pending' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Pending resources</h3>
                <ResourceList user={user} filter={filter} pendingMode={true} />
              </div>
            )}

            {tab === 'explore' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800">Explore approved resources</h3>
                <ResourceList user={user} filter={filter} />
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="text-center text-xs text-gray-500 py-6">
        Built for CSE students and teachers • Live updates included
      </footer>
    </div>
  )
}

export default App