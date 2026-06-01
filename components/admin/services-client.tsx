'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveService, deleteService } from '@/app/actions/services'
import { formatRp } from '@/lib/utils'
import type { Service } from '@/types'

interface Props {
  services: Service[]
}

const TONES = [30, 12, 35, 95, 150, 210, 245, 280, 320]

export default function AdminServicesClient({ services }: Props) {
  const [editor, setEditor] = useState<Service | null | 'new'>(null)
  const [confirmDelete, setConfirmDelete] = useState<Service | null>(null)
  const router = useRouter()

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <button
          onClick={() => setEditor('new')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 'var(--r-btn)',
            border: 'none',
            background: 'var(--accent)',
            color: 'var(--accent-ink)',
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontSize: 12.5,
            cursor: 'pointer',
          }}
        >
          + Tambah Layanan
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {services.map((s) => {
          const c1 = `oklch(0.42 0.07 ${s.tone})`
          const c2 = `oklch(0.36 0.06 ${s.tone})`
          return (
            <div
              key={s.id}
              style={{
                padding: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-card)',
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 10,
                  flexShrink: 0,
                  background: `repeating-linear-gradient(135deg, ${c1} 0 10px, ${c2} 10px 20px)`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(160deg, transparent, color-mix(in oklab, var(--ink) 55%, transparent))',
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 17,
                    textTransform: 'uppercase',
                    color: 'var(--text)',
                  }}
                >
                  {s.name}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--text-faint)',
                    marginTop: 3,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 460,
                  }}
                >
                  {s.description}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0, marginRight: 8 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    fontSize: 16,
                    color: 'var(--text)',
                  }}
                >
                  {formatRp(s.price)}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-faint)', marginTop: 2 }}>
                  {s.duration} mnt
                </div>
              </div>
              <button
                onClick={() => setEditor(s)}
                title="Edit"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--r-input)',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-dim)',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  fontSize: 17,
                }}
              >
                ✎
              </button>
              <button
                onClick={() => setConfirmDelete(s)}
                title="Hapus"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 'var(--r-input)',
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  color: 'var(--danger)',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  fontSize: 17,
                }}
              >
                🗑
              </button>
            </div>
          )
        })}
      </div>

      {editor !== null && (
        <ServiceEditorModal
          service={editor === 'new' ? null : editor}
          onClose={() => setEditor(null)}
          onSaved={() => { setEditor(null); router.refresh() }}
        />
      )}

      {confirmDelete && (
        <ConfirmDeleteModal
          service={confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onDeleted={() => { setConfirmDelete(null); router.refresh() }}
        />
      )}
    </>
  )
}

function ServiceEditorModal({
  service,
  onClose,
  onSaved,
}: {
  service: Service | null
  onClose: () => void
  onSaved: () => void
}) {
  const editing = !!service
  const [name, setName] = useState(service?.name || '')
  const [desc, setDesc] = useState(service?.description || '')
  const [price, setPrice] = useState(service ? String(service.price) : '')
  const [duration, setDuration] = useState(service ? String(service.duration) : '')
  const [tone, setTone] = useState(service?.tone ?? 30)
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    if (!name || !desc || !price || !duration) { setError('Semua kolom wajib diisi.'); return }
    const fd = new FormData()
    if (service?.id) fd.append('id', service.id)
    fd.append('name', name.trim())
    fd.append('description', desc.trim())
    fd.append('price', price)
    fd.append('duration', duration)
    fd.append('tone', String(tone))
    startTransition(async () => {
      const res = await saveService(fd)
      if (res?.error) { setError(res.error); return }
      onSaved()
    })
  }

  return (
    <div
      className="fi-fade"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 560,
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'var(--surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--r-card)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            padding: '22px 26px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: 22,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              margin: 0,
              color: 'var(--text)',
            }}
          >
            {editing ? 'Edit Layanan' : 'Tambah Layanan'}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'var(--surface-2)',
              border: 'none',
              borderRadius: '50%',
              width: 34,
              height: 34,
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              color: 'var(--text-dim)',
              fontSize: 18,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: 26, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <FormField label="Nama Layanan" value={name} onChange={setName} placeholder="cth. Classic Haircut" icon="✂" required />
          <div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 8 }}>
              Deskripsi <span style={{ color: 'var(--accent)' }}>*</span>
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Deskripsi singkat layanan"
              rows={3}
              style={{
                width: '100%',
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--r-input)',
                padding: '12px 14px',
                color: 'var(--text)',
                fontFamily: 'var(--font-body)',
                fontSize: 15,
                outline: 'none',
                resize: 'vertical',
                lineHeight: 1.5,
              }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <FormField label="Harga (Rp)" value={price} onChange={setPrice} placeholder="65000" type="number" icon="💰" required />
            <FormField label="Durasi (menit)" value={duration} onChange={setDuration} placeholder="45" type="number" icon="🕒" required />
          </div>
          <div>
            <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 10 }}>
              Warna Gambar
            </div>
            <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
              {TONES.map((tn) => (
                <button
                  key={tn}
                  type="button"
                  onClick={() => setTone(tn)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    cursor: 'pointer',
                    background: `repeating-linear-gradient(135deg, oklch(0.42 0.07 ${tn}) 0 7px, oklch(0.36 0.06 ${tn}) 7px 14px)`,
                    border: tone === tn ? '2px solid var(--accent)' : '2px solid transparent',
                    outline: tone === tn ? 'none' : '1px solid var(--border)',
                  }}
                />
              ))}
            </div>
          </div>
          {error && (
            <div style={{ color: 'var(--danger)', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 7 }}>
              ✕ {error}
            </div>
          )}
        </div>

        <div style={{ padding: '18px 26px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              padding: '12px 22px',
              borderRadius: 'var(--r-btn)',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 'var(--r-btn)',
              border: 'none',
              background: 'var(--accent)',
              color: 'var(--accent-ink)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: 14,
              cursor: isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {isPending ? 'Menyimpan...' : `✓ ${editing ? 'Simpan Perubahan' : 'Tambah Layanan'}`}
          </button>
        </div>
      </div>
    </div>
  )
}

function ConfirmDeleteModal({
  service,
  onClose,
  onDeleted,
}: {
  service: Service
  onClose: () => void
  onDeleted: () => void
}) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(async () => {
      await deleteService(service.id)
      onDeleted()
    })
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 510,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        display: 'grid',
        placeItems: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'var(--surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--r-card)',
          padding: 28,
          textAlign: 'center',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'color-mix(in oklab, var(--danger) 16%, transparent)',
            color: 'var(--danger)',
            display: 'grid',
            placeItems: 'center',
            margin: '0 auto 16px',
            fontSize: 26,
          }}
        >
          🗑
        </div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            fontSize: 21,
            textTransform: 'uppercase',
            margin: '0 0 8px',
            color: 'var(--text)',
          }}
        >
          Hapus Layanan?
        </h3>
        <p style={{ color: 'var(--text-dim)', fontSize: 14.5, margin: '0 0 24px' }}>
          Layanan <b style={{ color: 'var(--text)' }}>{service.name}</b> akan dihapus permanen.
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: 'var(--r-btn)',
              border: 'none',
              background: 'transparent',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px',
              borderRadius: 'var(--r-btn)',
              border: '1px solid var(--danger)',
              background: 'transparent',
              color: 'var(--danger)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: 14,
              cursor: isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {isPending ? 'Menghapus...' : '🗑 Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  required,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  icon?: string
  required?: boolean
}) {
  const [focus, setFocus] = useState(false)
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 8 }}>
        {label} {required && <span style={{ color: 'var(--accent)' }}>*</span>}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--surface-2)',
          border: `1px solid ${focus ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--r-input)',
          padding: '0 14px',
          transition: 'border-color .15s',
          boxShadow: focus ? '0 0 0 3px color-mix(in oklab, var(--accent) 18%, transparent)' : 'none',
        }}
      >
        {icon && <span style={{ color: 'var(--text-faint)', flexShrink: 0 }}>{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text)',
            fontFamily: 'var(--font-body)',
            fontSize: 15,
            padding: '13px 0',
          }}
        />
      </div>
    </label>
  )
}
