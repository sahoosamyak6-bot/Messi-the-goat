import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { arcadeCopyText, shareArcadeResult } from '../utils/arcade-share';
import { copyTextToClipboard } from '../utils/share-helper';
import './arcade-share.css';

/** No operation runs until the visitor presses a share or copy button. */
export function ArcadeShareResult({ result }: { result: string }) {
  const [nativeShare, setNativeShare] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [showText, setShowText] = useState(false);
  const operation = useRef<AbortController | null>(null);
  const id = useId();
  useEffect(() => { setNativeShare(typeof navigator.share === 'function'); }, []);
  // Invalidate before paint when a restart or another result replaces this result.
  useLayoutEffect(() => {
    operation.current?.abort(); operation.current = null;
    setBusy(false); setMessage(''); setShowText(false);
    return () => { operation.current?.abort(); operation.current = null; };
  }, [result]);
  const run = async (kind: 'share' | 'copy') => {
    if (operation.current) return;
    const current = new AbortController(); operation.current = current;
    setBusy(true); setMessage('');
    try {
      if (kind === 'copy') {
        const copied = await copyTextToClipboard(arcadeCopyText(result), { signal: current.signal });
        if (current.signal.aborted || operation.current !== current) return;
        setMessage(copied ? 'Result copied. Paste it wherever you choose.' : 'Could not copy. Select the result text below and copy it manually.');
        if (!copied) setShowText(true);
      } else {
        const outcome = await shareArcadeResult(result, typeof navigator.share === 'function' ? data => navigator.share(data) : undefined, current.signal);
        if (current.signal.aborted || operation.current !== current) return;
        if (outcome === 'cancelled') setMessage('Sharing cancelled. Nothing was copied.');
        else if (outcome === 'completed') setMessage('Share sheet completed. Delivery depends on the app you selected.');
        else if (outcome === 'unavailable') { setMessage('Device sharing is unavailable. Use Copy result or select the text below.'); setShowText(true); }
      }
    } catch {
      if (!current.signal.aborted && operation.current === current) { setMessage('This device could not finish the action. Select the result text below to copy manually.'); setShowText(true); }
    } finally {
      if (!current.signal.aborted && operation.current === current) { operation.current = null; setBusy(false); }
    }
  };
  return <div className="arcade-share-result" aria-label="Share this result">
    <div className="arcade-share-actions">
      {nativeShare && <button type="button" disabled={busy} onClick={() => void run('share')}>Share result</button>}
      <button type="button" disabled={busy} onClick={() => void run('copy')}>Copy result</button>
      <button type="button" aria-expanded={showText} aria-controls={`${id}-text`} onClick={() => setShowText(value => !value)}>{showText ? 'Hide result text' : 'Show result text'}</button>
    </div>
    <p className="arcade-share-status" role="status" aria-atomic="true">{busy ? 'Waiting for your device…' : message}</p>
    <div id={`${id}-text`} hidden={!showText}><label htmlFor={`${id}-result`}>Your result — select to copy manually</label><textarea id={`${id}-result`} readOnly value={arcadeCopyText(result)} rows={5} /></div>
  </div>;
}
