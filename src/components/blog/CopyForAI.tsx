import { useState } from 'react';

interface Props {
  mdUrl: string;
  label?: string;
}

type Status = 'idle' | 'copying' | 'copied' | 'error';

const CopyIcon = () => (
  <svg
    aria-hidden
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export default function CopyForAI({ mdUrl, label = 'Copy for AI' }: Props) {
  const [status, setStatus] = useState<Status>('idle');

  async function handleClick() {
    setStatus('copying');
    try {
      const res = await fetch(mdUrl);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const text = await res.text();

      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        try {
          ta.select();
          const copied = document.execCommand('copy');
          if (!copied) throw new Error('execCommand copy failed');
        } finally {
          document.body.removeChild(ta);
        }
      }

      setStatus('copied');
      setTimeout(() => setStatus('idle'), 1500);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  }

  const display =
    status === 'copied'
      ? 'Copied ✓'
      : status === 'copying'
        ? 'Copying…'
        : status === 'error'
          ? 'Failed — try again'
          : label;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={status === 'copying'}
      aria-live="polite"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.25rem 0.625rem',
        borderRadius: 'var(--theme-radius, 0.375rem)',
        border: '1px solid var(--theme-border)',
        background: 'transparent',
        color: 'var(--theme-text-muted)',
        fontSize: '0.75rem',
        fontFamily: 'var(--theme-font-heading, monospace)',
        cursor: status === 'copying' ? 'default' : 'pointer',
        opacity: status === 'copying' ? 0.6 : 1,
        transition: 'color 0.2s ease, border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (status === 'idle') {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--theme-text)';
        }
      }}
      onMouseLeave={(e) => {
        if (status === 'idle') {
          (e.currentTarget as HTMLButtonElement).style.color = 'var(--theme-text-muted)';
        }
      }}
    >
      <CopyIcon />
      {display}
    </button>
  );
}
