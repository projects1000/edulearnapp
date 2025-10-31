import React, { useEffect, useState } from 'react';
// @ts-ignore
import netlifyIdentity from 'netlify-identity-widget';

export default function AuthWidget({ onAuthChange }: { onAuthChange?: (u: any) => void }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    netlifyIdentity.init();

    const update = (u: any) => {
      setUser(u);
      if (onAuthChange) onAuthChange(u);
    };

    netlifyIdentity.on('login', (u: any) => {
      update(u);
      netlifyIdentity.close();
    });
    netlifyIdentity.on('logout', () => update(null));

    const current = netlifyIdentity.currentUser();
    if (current) update(current);

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
    };
  }, [onAuthChange]);

  return (
    <div style={{ marginBottom: 16 }}>
      {user ? (
        <>
          <span>Signed in: {user.user?.email || user.email}</span>
          <button style={{ marginLeft: 8 }} onClick={() => netlifyIdentity.logout()}>
            Logout
          </button>
        </>
      ) : (
        <button onClick={() => netlifyIdentity.open('login')}>Login / Signup</button>
      )}
    </div>
  );
}
