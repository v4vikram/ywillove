'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The server has no idea which theme the browser resolved, so rendering the real
  // icon before mount would hydrate with the wrong one.
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      className="grid size-8 place-items-center transition-opacity hover:opacity-60"
    >
      {mounted ? (
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.5">
          {isDark ? (
            <>
              <circle cx="12" cy="12" r="4" />
              <path
                strokeLinecap="round"
                d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10l1.4 1.4m0-12.8l-1.4 1.4m-10 10l-1.4 1.4"
              />
            </>
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"
            />
          )}
        </svg>
      ) : (
        <span className="size-4" />
      )}
    </button>
  );
}
