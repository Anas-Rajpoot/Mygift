'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isBefore,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns'

interface LuxuryDatePickerProps {
  selected: Date | null
  onSelect: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  className?: string
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function LuxuryDatePicker({ selected, onSelect, minDate, maxDate, className }: LuxuryDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selected ?? new Date()))
  const [direction, setDirection] = useState(1)

  const min = useMemo(() => {
    const d = minDate ? new Date(minDate) : new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [minDate])

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 })
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 })
    return eachDayOfInterval({ start: calStart, end: calEnd })
  }, [currentMonth])

  const canGoPrev = !isBefore(startOfMonth(currentMonth), min)
  const canGoNext = maxDate ? isBefore(currentMonth, startOfMonth(maxDate)) : true

  const isDisabled = (day: Date) => isBefore(day, min)
  const isDifferentMonth = (day: Date) => day.getMonth() !== currentMonth.getMonth()

  return (
    <div className={className} style={{ width: '100%', background: '#1a0c10', border: '1px solid rgba(201,168,76,0.25)', padding: '32px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <button
          disabled={!canGoPrev}
          onClick={() => {
            setDirection(-1)
            setCurrentMonth((m) => subMonths(m, 1))
          }}
          style={{ width: 40, height: 40, border: '1px solid rgba(201,168,76,0.2)', background: 'none', color: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: canGoPrev ? 1 : 0.35 }}
        >
          <ChevronLeft size={18} />
        </button>
        <div style={{ fontFamily: 'Cinzel, serif', fontSize: 16, fontWeight: 600, color: '#fdf4e8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          {format(currentMonth, 'MMMM yyyy')}
        </div>
        <button
          disabled={!canGoNext}
          onClick={() => {
            setDirection(1)
            setCurrentMonth((m) => addMonths(m, 1))
          }}
          style={{ width: 40, height: 40, border: '1px solid rgba(201,168,76,0.2)', background: 'none', color: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: canGoNext ? 1 : 0.35 }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
        {weekDays.map((d) => (
          <div key={d} style={{ textAlign: 'center', fontFamily: 'Cinzel, serif', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(201,168,76,0.5)', padding: '8px 0', textTransform: 'uppercase' }}>
            {d}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={format(currentMonth, 'yyyy-MM')}
          custom={direction}
          initial={{ x: direction > 0 ? 40 : -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: direction > 0 ? -40 : 40, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}
        >
          {days.map((day) => {
            const selectedDay = !!selected && isSameDay(day, selected)
            const today = isToday(day)
            const disabled = isDisabled(day)
            const offMonth = isDifferentMonth(day)
            return (
              <motion.button
                key={day.toISOString()}
                disabled={disabled || offMonth}
                onClick={() => onSelect(day)}
                whileHover={!disabled && !selectedDay && !offMonth ? { scale: 1.05 } : undefined}
                whileTap={!disabled && !offMonth ? { scale: 0.95 } : undefined}
                style={{
                  aspectRatio: '1',
                  minHeight: 44,
                  position: 'relative',
                  background: selectedDay ? '#c9a84c' : 'transparent',
                  border: selectedDay ? 'none' : today ? '1px solid rgba(201,168,76,0.4)' : '1px solid transparent',
                  color: selectedDay ? '#0f0608' : disabled ? 'rgba(253,244,232,0.15)' : offMonth ? 'rgba(253,244,232,0.2)' : today ? '#c9a84c' : '#fdf4e8',
                  fontFamily: 'Lufga, sans-serif',
                  fontSize: selectedDay ? 15 : 14,
                  fontWeight: selectedDay || today ? 700 : 400,
                  boxShadow: selectedDay ? '0 0 0 2px rgba(201,168,76,0.3)' : 'none',
                  cursor: disabled || offMonth ? 'default' : 'pointer',
                }}
              >
                {format(day, 'd')}
                {today && !selectedDay && (
                  <span style={{ position: 'absolute', bottom: 6, left: '50%', transform: 'translateX(-50%)', width: 3, height: 3, background: '#c9a84c', borderRadius: '50%' }} />
                )}
              </motion.button>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {selected && (
        <div style={{ marginTop: 24, padding: '16px 20px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Calendar size={16} color="#c9a84c" />
            <div>
              <div style={{ fontFamily: 'Cinzel, serif', fontSize: 9, letterSpacing: '0.3em', color: 'rgba(201,168,76,0.6)' }}>SELECTED DELIVERY DATE</div>
              <div style={{ fontFamily: 'Lufga, sans-serif', fontWeight: 500, fontSize: 16, color: '#fdf4e8' }}>{format(selected, 'EEEE, d MMMM yyyy')}</div>
            </div>
          </div>
          <span style={{ fontFamily: 'Cinzel, serif', fontSize: 9, letterSpacing: '0.2em', padding: '4px 12px', border: `1px solid ${isToday(selected) ? 'rgba(90,170,122,0.3)' : 'rgba(201,168,76,0.2)'}`, background: isToday(selected) ? 'rgba(90,170,122,0.12)' : 'rgba(201,168,76,0.08)', color: isToday(selected) ? '#5aaa7a' : '#c9a84c' }}>
            {isToday(selected) ? 'Same-day available' : 'Standard delivery'}
          </span>
        </div>
      )}
    </div>
  )
}
