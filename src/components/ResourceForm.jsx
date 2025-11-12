import React, { useState } from "react";

export default function ResourceForm({ user, onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState(user?.semester || 1);
  const [fileUrl, setFileUrl] = useState("");
  const [contentUrl, setContentUrl] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const backend = import.meta.env.VITE_BACKEND_URL;

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${backend}/resources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          subject,
          semester: Number(semester),
          tags: tags.split(",").map(t=>t.trim()).filter(Boolean),
          file_url: fileUrl || null,
          content_url: contentUrl || null,
          uploaded_by: user.email,
          uploader_name: user.name,
        }),
      });
      if (!res.ok) throw new Error("Failed to create resource");
      const data = await res.json();
      onCreated?.(data);
      setTitle(""); setDescription(""); setSubject(""); setSemester(user?.semester || 1); setFileUrl(""); setContentUrl(""); setTags("");
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-xl shadow border p-4 space-y-3">
      <h3 className="font-semibold text-gray-800">Submit a resource</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Title</label>
          <input className="w-full border rounded px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm text-gray-600">Subject</label>
          <input className="w-full border rounded px-3 py-2" value={subject} onChange={e=>setSubject(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm text-gray-600">Semester</label>
          <select className="w-full border rounded px-3 py-2" value={semester} onChange={e=>setSemester(e.target.value)}>
            {Array.from({length:8}).map((_,i)=> <option key={i+1} value={i+1}>{i+1}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Tags (comma separated)</label>
          <input className="w-full border rounded px-3 py-2" value={tags} onChange={e=>setTags(e.target.value)} placeholder="notes, syllabus, lab" />
        </div>
      </div>
      <div>
        <label className="text-sm text-gray-600">Description</label>
        <textarea className="w-full border rounded px-3 py-2" rows={3} value={description} onChange={e=>setDescription(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">File URL</label>
          <input className="w-full border rounded px-3 py-2" value={fileUrl} onChange={e=>setFileUrl(e.target.value)} placeholder="https://drive.google.com/..." />
        </div>
        <div>
          <label className="text-sm text-gray-600">Content URL</label>
          <input className="w-full border rounded px-3 py-2" value={contentUrl} onChange={e=>setContentUrl(e.target.value)} placeholder="https://github.com/... or https://..." />
        </div>
      </div>
      <div className="flex justify-end">
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2">
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
}
