import React, { useState } from 'react';

export default function ContactForm({ getToken }: { getToken: () => Promise<string | null> }) {
  const [form, setForm] = useState({ name: '', message: '' });
  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const token = await getToken();
      if (!token) {
        setStatus('not-authenticated');
        return;
      }
      const resp = await fetch('/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data?.error || 'Save failed');
      setStatus('success');
      setForm({ name: '', message: '' });
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      <div>
        <label>Name</label>
        <input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Message</label>
        <textarea name="message" value={form.message} onChange={handleChange} />
      </div>
      <button type="submit">Save</button>
      {status === 'loading' && <p>Sending…</p>}
      {status === 'success' && <p>Saved successfully 🎉</p>}
      {status === 'not-authenticated' && <p>Please log in first.</p>}
      {status === 'error' && <p>Something went wrong</p>}
    </form>
  );
}
