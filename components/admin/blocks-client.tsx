'use client'

import { useState, useTransition } from 'react'
import { addBlockedSlot, removeBlockedSlot } from '@/app/actions/blocks'

const TIMES = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']

interface BlockedSlot {
  id: string
  date: string
  time: string | null
  reason: string
  created_at: string
}

export default function BlocksClient({ blocks }: { blocks: BlockedSlot[] }) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState<string>('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const today = new Date().toISOString().slice(0, 10)

  function handleAdd() {
    if (!date) { setError('Pilih tanggal terlebih dahulu.'); return }
    setError('')
    startTransition(async () => {
      const res = await addBlockedSlot({ date, time: time || null, reason })
      if (res.error) { setError(res.error); return }
      setDate(''); setTime(''); setReason('')
    })
  }

  function handleRemove(id: string) {
    startTransition(async () => { await removeBlockedSlot(id) })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Add form */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', padding: 24 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, textTransform: 'uppercase', margin: '0 0 20px', color: 'var(--text)' }}>
          Tambah Blokir
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block', marginBottom: 8 }}>Tanggal</label>
            <input
              type="date" min={today} value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-input)', padding: '11px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block', marginBottom: 8 }}>Jam (kosong = blokir seharian)</label>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-input)', padding: '11px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            >
              <option value="">— Seluruh hari —</option>
              {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block', marginBottom: 8 }}>Alasan</label>
            <input
              type="text" value={reason} placeholder="Misal: Hari Libur Nasional"
              onChange={(e) => setReason(e.target.value)}
              style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--r-input)', padding: '11px 14px', color: 'var(--text)', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        </div>
        {error && <div style={{ color: 'var(--danger)', fontSize: 13, marginTop: 12 }}>✕ {error}</div>}
        <div style={{ marginTop: 16 }}>
          <button
            onClick={handleAdd}
            disabled={isPending || !date}
            style={{ padding: '11px 22px', borderRadius: 'var(--r-btn)', border: 'none', background: !date || isPending ? 'color-mix(in oklab, var(--accent) 40%, transparent)' : 'var(--accent)', color: 'var(--accent-ink)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: !date || isPending ? 'not-allowed' : 'pointer' }}
          >
            {isPending ? 'Menyimpan...' : '+ Tambah Blokir'}
          </button>
        </div>
      </div>

      {/* Existing blocks list */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r-card)', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 0.8fr 1.5fr auto', gap: 12, fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-faint)', fontFamily: 'var(--font-display)' }}>
          <div>Tanggal</div><div>Jam</div><div>Alasan</div><div></div>
        </div>
        {blocks.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-dim)', fontSize: 14 }}>Belum ada blokir terdaftar.</div>
        ) : (
          blocks.map((b) => (
            <div key={b.id} style={{ padding: '13px 20px', borderBottom: '1px solid var(--border)', display: 'grid', gridTemplateColumns: '1fr 0.8fr 1.5fr auto', gap: 12, alignItems: 'center', fontSize: 14 }}>
              <div style={{ fontWeight: 600, color: 'var(--text)' }}>{b.date}</div>
              <div style={{ color: b.time ? 'var(--text)' : 'var(--warn)' }}>{b.time || '— Seharian —'}</div>
              <div style={{ color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.reason || '—'}</div>
              <button
                onClick={() => handleRemove(b.id)}
                disabled={isPending}
                style={{ padding: '5px 11px', borderRadius: 'var(--r-btn)', border: '1px solid color-mix(in oklab, var(--danger) 30%, transparent)', background: 'color-mix(in oklab, var(--danger) 10%, transparent)', color: 'var(--danger)', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 11.5, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                Hapus
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
