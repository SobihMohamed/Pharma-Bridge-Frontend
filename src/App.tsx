import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'sonner';

import { router } from '@/router';
import { queryClient } from '@/lib/queryClient';
import '@/lib/i18n';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Enforce English (LTR) globally
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = 'en';
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}

export default App;
