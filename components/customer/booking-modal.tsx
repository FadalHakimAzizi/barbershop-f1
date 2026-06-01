'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBooking, getSlotOccupancy, getBlockedSlots } from '@/app/actions/bookings'
import { MAX_SLOT_CAPACITY } from '@/lib/constants'
import { formatRp } from '@/lib/utils'
import type { ServiceWithCount } from '@/types'

interface Props {
  services: ServiceWithCount[]
  initialService?: ServiceWithCount | null
  onClose: () => void
  onDone: () => void
}

const TIMES = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00']

function isTimePast(slotTime: string, selectedDate: string, today: string): boolean {
  if (selectedDate !== today) return false
  const [slotH, slotM] = slotTime.split(':').map(Number)
  const now = new Date()
  return slotH * 60 + slotM <= now.getHours() * 60 + now.getMinutes()
}

export default function BookingModal({ services, initialService, onClose, onDone }: Props) {
  const [step, setStep] = useState(initialService ? 2 : 1)
  const [picked, setPicked] = useState<ServiceWithCount[]>(
    initialService ? [initialService] : []
  )
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()
  const [slotCounts, setSlotCounts] = useState<Record<string, number>>({})
  const [blockedTimes, setBlockedTimes] = useState<string[]>([])
  const [dayBlockReason, setDayBlockReason] = useState('')
  const [loadingSlots, setLoadingSlots] = useState(false)
  const router = useRouter()

  const today = new Date().toISOString().slice(0, 10)
  const steps = ['Pilih Layanan', 'Jadwal', 'Konfirmasi']
  const canNext = step === 1 ? picked.length > 0 : step === 2 ? !!(date && time) : true

  const totalPrice = picked.reduce((sum, p) => sum + Number(p.price), 0)
  const totalDuration = picked.reduce((sum, p) => sum + Number(p.duration), 0)

  function toggleService(s: ServiceWithCount) {
    setPicked((prev) =>
      prev.some((p) => p.id === s.id)
        ? prev.filter((p) => p.id !== s.id)
        : [...prev, s]
    )
  }

  // Fetch slot occupancy + blocked times whenever date changes
  useEffect(() => {
    if (!date) return
    setLoadingSlots(true)
    Promise.all([getSlotOccupancy(date), getBlockedSlots(date)]).then(([counts, { times, dayReason }]) => {
      setSlotCounts(counts)
      setBlockedTimes(times)
      setDayBlockReason(dayReason)
      setLoadingSlots(false)
    })
  }, [date])

  function handleDateChange(val: string) {
    setDate(val)
    if (time && isTimePast(time, val, today)) setTime('')
  }

  function next() {
    if (step < 3) { setStep(step + 1); return }
    if (picked.length === 0) return
    startTransition(async () => {
      const res = await createBooking({
        serviceIds: picked.map((p) => p.id),
        date,
        time,
      })
      if (res.error) { setError(res.error); return }
      onDone()
      router.refresh()
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
          maxWidth: 720,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: 'var(--r-card)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header + stepper */}
        <div
          style={{
            padding: '24px 28px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {steps.map((label, i) => {
              const n = i + 1
              const done = n < step
              const on = n === step
              return (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 12.5,
                        fontWeight: 700,
                        fontFamily: 'var(--font-display)',
                        background: done
                          ? 'var(--accent)'
                          : on
                          ? 'color-mix(in oklab, var(--accent) 18%, transparent)'
                          : 'var(--surface-2)',
                        color: done
                          ? 'var(--accent-ink)'
                          : on
                          ? 'var(--accent)'
                          : 'var(--text-faint)',
                        border: on ? '1px solid var(--accent)' : '1px solid transparent',
                      }}
                    >
                      {done ? '✓' : n}
                    </div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: on || done ? 600 : 500,
                        color: on || done ? 'var(--text)' : 'var(--text-faint)',
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{ width: 22, height: 1, background: 'var(--border-strong)' }} />
                  )}
                </div>
              )
            })}
          </div>
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

        {/* Content */}
        <div style={{ padding: 28 }}>

          {/* Step 1 — multi-select services */}
          {step === 1 && (
            <div>
              {/* Selection counter */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                }}
              >
                <span style={{ fontSize: 13, color: 'var(--text-faint)' }}>
                  Pilih satu atau lebih layanan
                </span>
                {picked.length > 0 && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'color-mix(in oklab, var(--accent) 16%, transparent)',
                      color: 'var(--accent)',
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: 'var(--r-pill)',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    ✓ {picked.length} dipilih · {formatRp(totalPrice)}
                  </span>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {services.map((s) => {
                  const on = picked.some((p) => p.id === s.id)
                  const c1 = `oklch(0.42 0.07 ${s.tone})`
                  const c2 = `oklch(0.36 0.06 ${s.tone})`
                  return (
                    <button
                      key={s.id}
                      onClick={() => toggleService(s)}
                      style={{
                        textAlign: 'left',
                        display: 'flex',
                        gap: 13,
                        padding: 12,
                        borderRadius: 'var(--r-input)',
                        cursor: 'pointer',
                        background: on
                          ? 'color-mix(in oklab, var(--accent) 12%, transparent)'
                          : 'var(--surface-2)',
                        border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
                        transition: 'all .15s',
                        alignItems: 'center',
                      }}
                    >
                      <div
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 8,
                          background: `repeating-linear-gradient(135deg, ${c1} 0 7px, ${c2} 7px 14px)`,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 600,
                            fontSize: 15.5,
                            textTransform: 'uppercase',
                            color: 'var(--text)',
                            letterSpacing: '0.01em',
                          }}
                        >
                          {s.name}
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-faint)', marginTop: 3 }}>
                          {s.duration} mnt · {formatRp(s.price)}
                        </div>
                      </div>
                      {/* Checkbox indicator */}
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 5,
                          border: `2px solid ${on ? 'var(--accent)' : 'var(--border-strong)'}`,
                          background: on ? 'var(--accent)' : 'transparent',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                          transition: 'all .12s',
                          fontSize: 11,
                          color: 'var(--accent-ink)',
                          fontWeight: 700,
                        }}
                      >
                        {on && '✓'}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 2 — date + time */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--text-dim)',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  Tanggal Booking
                </label>
                <input
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--r-input)',
                    padding: '13px 14px',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-body)',
                    fontSize: 15,
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      color: 'var(--text-dim)',
                    }}
                  >
                    Pilih Jam
                  </div>
                  {date === today && (
                    <span style={{ fontSize: 12, color: 'var(--text-faint)' }}>
                      Jam yang sudah lewat tidak tersedia
                    </span>
                  )}
                </div>

                {blockedTimes.includes('ALL') ? (
                  <div style={{ padding: '16px 20px', background: 'color-mix(in oklab, var(--danger) 10%, transparent)', border: '1px solid color-mix(in oklab, var(--danger) 30%, transparent)', borderRadius: 'var(--r-input)', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ color: 'var(--danger)', fontSize: 14, fontWeight: 600 }}>✕ Tanggal ini tidak tersedia</div>
                    {dayBlockReason && (
                      <div style={{ color: 'var(--danger)', fontSize: 13, opacity: 0.8 }}>Alasan: {dayBlockReason}</div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 9, opacity: loadingSlots ? 0.5 : 1, transition: 'opacity .2s' }}>
                    {TIMES.map((t) => {
                      const past = isTimePast(t, date, today)
                      const blocked = blockedTimes.includes(t)
                      const count = slotCounts[t] || 0
                      const full = count >= MAX_SLOT_CAPACITY
                      const disabled = past || blocked || full
                      const on = time === t
                      return (
                        <button
                          key={t}
                          onClick={() => !disabled && setTime(t)}
                          disabled={disabled}
                          title={full ? `Penuh (${count}/${MAX_SLOT_CAPACITY})` : blocked ? 'Diblokir' : past ? 'Sudah lewat' : undefined}
                          style={{
                            padding: '11px 0',
                            borderRadius: 'var(--r-input)',
                            cursor: disabled ? 'not-allowed' : 'pointer',
                            fontFamily: 'var(--font-display)',
                            fontWeight: 600,
                            fontSize: 14,
                            letterSpacing: '0.03em',
                            background: on ? 'var(--accent)' : 'var(--surface-2)',
                            color: disabled ? 'var(--text-faint)' : on ? 'var(--accent-ink)' : 'var(--text)',
                            border: `1px solid ${on ? 'var(--accent)' : 'var(--border)'}`,
                            transition: 'all .12s',
                            opacity: disabled ? 0.38 : 1,
                            textDecoration: past ? 'line-through' : 'none',
                            position: 'relative',
                          }}
                        >
                          {t}
                          {full && !past && (
                            <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.04em', color: 'var(--danger)', marginTop: 2 }}>PENUH</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3 — confirmation */}
          {step === 3 && picked.length > 0 && (
            <div>
              {/* Service list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                {picked.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      gap: 14,
                      alignItems: 'center',
                      padding: '12px 14px',
                      borderRadius: 'var(--r-input)',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        background: `repeating-linear-gradient(135deg, oklch(0.42 0.07 ${s.tone}) 0 8px, oklch(0.36 0.06 ${s.tone}) 8px 16px)`,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 600,
                          fontSize: 15,
                          textTransform: 'uppercase',
                          color: 'var(--text)',
                          letterSpacing: '0.01em',
                        }}
                      >
                        {s.name}
                      </div>
                      <div style={{ fontSize: 12.5, color: 'var(--text-faint)', marginTop: 2 }}>
                        {s.duration} mnt · {formatRp(s.price)}
                      </div>
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: 14,
                        color: 'var(--accent)',
                      }}
                    >
                      {formatRp(s.price)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {([
                  ['📅', 'Tanggal', date || '—'],
                  ['🕒', 'Jam', time || '—'],
                  ['💰', 'Total Bayar', formatRp(totalPrice)],
                  ['✂', 'Total Durasi', totalDuration + ' menit'],
                ] as [string, string, string][]).map(([ic, l, v]) => (
                  <div
                    key={l}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 14,
                      borderRadius: 'var(--r-input)',
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ color: 'var(--accent)', fontSize: 20 }}>{ic}</span>
                    <div>
                      <div
                        style={{
                          fontSize: 11.5,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: 'var(--text-faint)',
                          fontWeight: 600,
                        }}
                      >
                        {l}
                      </div>
                      <div style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text)', marginTop: 2 }}>
                        {v}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>✕ {error}</div>
              )}

              <div
                style={{
                  marginTop: 16,
                  padding: 14,
                  borderRadius: 'var(--r-input)',
                  background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
                  border: '1px dashed color-mix(in oklab, var(--accent) 40%, transparent)',
                  fontSize: 13.5,
                  color: 'var(--text-dim)',
                  display: 'flex',
                  gap: 9,
                }}
              >
                <span style={{ color: 'var(--accent)', flexShrink: 0 }}>✓</span>
                {picked.length > 1
                  ? <span>{picked.length} pesanan akan tersimpan dengan status <b style={{ color: 'var(--text)' }}>&nbsp;Menunggu&nbsp;</b> dan dikonfirmasi oleh admin.</span>
                  : <span>Pesanan akan tersimpan dengan status <b style={{ color: 'var(--text)' }}>&nbsp;Menunggu&nbsp;</b> dan dikonfirmasi oleh admin.</span>
                }
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '18px 28px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <button
            onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
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
            ← {step === 1 ? 'Batal' : 'Kembali'}
          </button>
          <button
            onClick={next}
            disabled={!canNext || isPending}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 22px',
              borderRadius: 'var(--r-btn)',
              border: 'none',
              background: !canNext || isPending
                ? 'color-mix(in oklab, var(--accent) 40%, transparent)'
                : 'var(--accent)',
              color: 'var(--accent-ink)',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: 14,
              cursor: !canNext || isPending ? 'not-allowed' : 'pointer',
            }}
          >
            {isPending
              ? 'Memproses...'
              : step === 3
              ? `✓ Konfirmasi ${picked.length > 1 ? picked.length + ' Pesanan' : 'Pesanan'}`
              : 'Lanjut →'}
          </button>
        </div>
      </div>
    </div>
  )
}
