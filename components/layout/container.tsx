'use client';

import { useEffect, useState } from 'react';
import { LoginDialog } from '../auth/login-dialog';

export default function Container({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('openLoginDialog', onOpen as EventListener);
    return () => window.removeEventListener('openLoginDialog', onOpen as EventListener);
  }, []);

  return (
    <>
      {children}
      {/* Globally-mounted auth modal */}
      <LoginDialog isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}