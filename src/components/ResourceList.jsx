import React, { useEffect, useMemo, useState } from "react";

function Badge({ children }) {
  return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 border text-gray-700">{children}</span>
}

function Card({ r, canApprove, onApprove }) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-gray-800">{r.title}</div>
          <div className="text-xs text-gray-500">Sem {r.semester} • {r.subject}</div>
        </div>
        <Badge>{r.status}</Badge>
      </div>
      {r.description && <p className="text-sm text-gray-600 mt-2">{r.description}</p>}
      <div className="flex flex-wrap gap-2 mt-2">
        {r.tags?.map((t, i)=> <Badge key={i}>#{t}</Badge>)}
      </div>
      <div className="flex gap-3 mt-3 text-sm">
        {r.file_url && <a className="text-blue-600 hover:underline" href={r.file_url} target="_blank">File</a>}
        {r.content_url && <a className="text-blue-600 hover:underline" href={r.content_url} target="_blank">Content</a>}
      </div>
      <div className="text-xs text-gray-500 mt-2">Uploaded by {r.uploader_name || r.uploaded_by}</div>
      {canApprove && r.status === 'pending' && (
        <div className="mt-3">
          <button onClick={()=>onApprove(r)} className="px-3 py-1.5 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Approve</button>
        </div>
      )}
    </div>
  )
}

export default function ResourceList({ user, filter, pendingMode=false }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const backend = import.meta.env.VITE_BACKEND_URL;

  const load = async () => {
    setLoading(true);
    const qs = new URLSearchParams({ ...(filter||{}), ...(pendingMode ? { status: 'pending' } : {}) });
    const url = pendingMode ? `${backend}/resources/pending` : `${backend}/resources?${qs.toString()}`;
    const res = await fetch(url);
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [JSON.stringify(filter), pendingMode]);

  useEffect(()=>{
    const evt = new EventSource(`${backend}/events`);
    evt.onmessage = (e)=>{
      try {
        const msg = JSON.parse(e.data);
        if (msg.event === 'resource_created' || msg.event === 'resource_approved') {
          load();
        }
      } catch {}
    }
    return ()=> evt.close();
  }, []);

  const canApprove = user && (user.role === 'teacher' || user.role === 'admin');

  const onApprove = async (r) => {
    const res = await fetch(`${backend}/resources/${r.id}/approve`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ approved_by: user.email }) });
    if (res.ok) load();
  }

  if (loading) return <div className="text-gray-500">Loading resources...</div>
  if (!items.length) return <div className="text-gray-500">No resources found.</div>

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((r)=> <Card key={r.id} r={r} canApprove={canApprove} onApprove={onApprove} />)}
    </div>
  );
}
