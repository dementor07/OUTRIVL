'use client';

import { useCallback, useRef, useState, useSyncExternalStore } from 'react';
import { C } from '@/lib/tokens';
import { mono } from '@/components/ui/type';
import { getSlot, getSlotServer, setSlot, subscribeSlot } from '@/lib/slot-store';

/**
 * A fillable image slot.
 *
 * Products are the protagonists, so the product page holds real logos and
 * screenshots rather than letters in boxes. Drop a file or click to pick one;
 * the image persists locally so the page keeps its assets across reloads while
 * the backend is still fixtures.
 */
export function ImageSlot({
  slotId,
  placeholder = 'Drop image',
  fit = 'cover',
  height,
}: {
  slotId: string;
  placeholder?: string;
  fit?: 'cover' | 'contain';
  height?: string;
}) {
  const key = `outrivl:slot:${slotId}`;
  const src = useSyncExternalStore(subscribeSlot, () => getSlot(key), getSlotServer);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const accept = useCallback(
    (file: File | undefined) => {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => setSlot(key, String(reader.result));
      reader.readAsDataURL(file);
    },
    [key],
  );

  return (
    <div
      onClick={() => input.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        accept(e.dataTransfer.files?.[0]);
      }}
      style={{
        position: 'relative', width: '100%', height: height ?? '100%', minHeight: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        overflow: 'hidden',
        background: over ? 'rgba(207,218,79,0.06)' : 'transparent',
        outline: over ? `1px solid ${C.acid}` : 'none',
        // Dither, so an empty slot reads as a reserved surface rather than a hole.
        backgroundImage: src ? 'none' : 'radial-gradient(rgba(233,224,196,0.07) 1px, transparent 1px)',
        backgroundSize: '4px 4px',
      }}
    >
      <input ref={input} type="file" accept="image/*" hidden onChange={(e) => accept(e.target.files?.[0])} />
      {src ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- user-supplied
              data URL; next/image cannot optimise it and would reject the src. */}
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: fit, display: 'block' }} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSlot(key, null);
            }}
            title="Remove image"
            style={{ position: 'absolute', top: '4px', right: '4px', padding: '2px 6px', background: 'rgba(5,5,5,0.8)', border: `1px solid ${C.line}`, ...mono({ w: 700, s: 8, c: C.ink }) }}
          >
            ✕
          </button>
        </>
      ) : (
        <span style={{ textAlign: 'center', padding: '8px', ...mono({ w: 500, s: 8.5, c: C.ink, ls: 0.14 }) }}>
          {placeholder.toUpperCase()}
        </span>
      )}
    </div>
  );
}
