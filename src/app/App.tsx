import React, { useState } from 'react';
import AuthWidget from '../components/AuthWidget';
import ContactForm from '../components/ContactForm';
// @ts-ignore
import netlifyIdentity from 'netlify-identity-widget';

export default function App() {
  const [user, setUser] = useState<any>(null);

  const handleAuthChange = (u: any) => {
    setUser(u);
  };

  const getToken = async () => {
    const current = netlifyIdentity.currentUser();
    if (!current) return null;
    if (current.token && current.token.access_token) return current.token.access_token;
    if (current?.jwt) return current.jwt;
    if (current?.access_token) return current.access_token;
    try {
      const refreshed = await current?.refresh();
      return refreshed?.token?.access_token || null;
    } catch (e) {
      return null;
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Netlify Identity + Functions Demo</h1>
      <AuthWidget onAuthChange={handleAuthChange} />
      <ContactForm getToken={getToken} />
    </div>
  );
}
