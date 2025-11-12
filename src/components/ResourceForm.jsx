import React, { useState } from "react";
import { motion } from "framer-motion";

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
    <motion.form onSubmit={submit} className="bg-white/80 backdrop-blur rounded-xl shadow border p-4 space-y-3"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: .25 }}
    >
      <h3 className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600">Submit a resource</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">Title</label>
          <input className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-violet-200 outline-none" value={title} onChange={e=>setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm text-gray-600">Subject</label>
          <input className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-violet-200 outline-none" value={subject} onChange={e=>setSubject(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm text-gray-600">Semester</label>
          <select className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-violet-200 outline-none" value={semester} onChange={e=>setSemester(e.target.value)}>
            {Array.from({length:8}).map((_,i)=> <option key={i+1} value={i+1}>{i+1}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Tags (comma separated)</label>
          <input className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-violet-200 outline-none" value={tags} onChange={e=>setTags(e.target.value)} placeholder="notes, syllabus, lab" />
        </div>
      </div>
      <div>
        <label className="text-sm text-gray-600">Description</label>
        <textarea className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-violet-200 outline-none" rows={3} value={description} onChange={e=>setDescription(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-gray-600">File URL</label>
          <input className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-violet-200 outline-none" value={fileUrl} onChange={e=>setFileUrl(e.target.value)} placeholder="https://drive.google.com/..." />
        </div>
        <div>
          <label className="text-sm text-gray-600">Content URL</label>
          <input className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-violet-200 outline-none" value={contentUrl} onChange={e=>setContentUrl(e.target.value)} placeholder="https://github.com/... or https://..." />
        </div>
      </div>
      <div className="flex justify-end">
        <button disabled={loading} className="rounded-md px-4 py-2 text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:opacity-95 transition">
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </motion.form>
  );
}
