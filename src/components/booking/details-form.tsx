"use client"

import { useId, useMemo, useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { Locale } from "@/i18n/config"
import type { BookingDict } from "@/i18n/dictionaries/booking"
import {
  REVENUE_OPTIONS,
  bookingSchema,
  fieldErrors,
  type BookingData,
  type BookingFieldError,
  type BookingInput,
  type RevenueOption,
} from "@/lib/booking"
import { countries, defaultCountry } from "@/lib/countries"
import { cn } from "@/lib/utils"

export type DetailsValues = {
  fullName: string
  clinic: string
  country: string
  phoneLocal: string
  email: string
  revenue: RevenueOption | ""
  website: string
}

export function emptyDetails(lang: Locale): DetailsValues {
  return { fullName: "", clinic: "", country: defaultCountry[lang], phoneLocal: "", email: "", revenue: "", website: "" }
}

/** Country code + the number as typed. A number typed with its own "+…" is kept as is. */
export function fullPhone(values: Pick<DetailsValues, "country" | "phoneLocal">): string {
  const typed = values.phoneLocal.trim()
  if (typed.startsWith("+")) return typed
  const dial = countries.find((c) => c.code === values.country)?.dial ?? ""
  return `${dial}${typed.replace(/^0+(?=\d)/, "")}`
}

type FieldErrors = Partial<Record<keyof BookingData, BookingFieldError>>
type Field = "fullName" | "clinic" | "phone" | "email"

const ring = "outline-none focus-visible:ring-4 focus-visible:ring-accent/40"
// Same shadcn Input / Select as the TORCH booking form, 44px tall, with an accent focus ring.
const fieldClass = "h-11 bg-white text-base focus-visible:border-accent focus-visible:ring-accent/20 md:text-sm"
const triggerClass =
  "h-11! cursor-pointer bg-white px-3 text-base focus-visible:border-accent focus-visible:ring-accent/20 md:text-sm"

type Props = {
  t: BookingDict
  lang: Locale
  values: DetailsValues
  onChange: (values: DetailsValues) => void
  toInput: (values: DetailsValues) => BookingInput
  onSubmit: (input: BookingInput) => void
  submitting: boolean
  serverFields?: FieldErrors
  serverError?: string
}

// Step 2: who is booking. Four short fields + one optional select, validated with the same schema
// the server uses: each field on blur, everything on submit (focus jumps to the first problem).
export function DetailsForm({ t, lang, values, onChange, toInput, onSubmit, submitting, serverFields, serverError }: Props) {
  const uid = useId()
  const [errors, setErrors] = useState<FieldErrors>({})
  const shown = { ...serverFields, ...errors }

  const countryNames = useMemo(() => {
    let names: Intl.DisplayNames | null = null
    try {
      names = new Intl.DisplayNames([lang], { type: "region" })
    } catch {
      names = null
    }
    return countries
      .map((c) => ({ ...c, name: names?.of(c.code) ?? c.code }))
      .sort((a, b) => a.name.localeCompare(b.name, lang))
  }, [lang])

  function set<K extends keyof DetailsValues>(key: K, value: DetailsValues[K]) {
    onChange({ ...values, [key]: value })
    const field = key === "country" || key === "phoneLocal" ? "phone" : key
    if (errors[field as keyof BookingData]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  /** Inline check of one field when the visitor leaves it (only once something was typed). */
  function check(field: Field) {
    const raw = field === "phone" ? values.phoneLocal : values[field]
    if (!raw.trim()) return
    const parsed = bookingSchema.safeParse(toInput(values))
    const problem = parsed.success ? undefined : fieldErrors(parsed.error)[field]
    setErrors((e) => ({ ...e, [field]: problem }))
  }

  function message(field: keyof BookingData): string | null {
    const code = shown[field]
    if (!code) return null
    if (code === "required") return t.fieldErrors.required
    if (code === "too_long") return t.fieldErrors.tooLong
    if (field === "email") return t.fieldErrors.invalidEmail
    if (field === "phone") return t.fieldErrors.invalidPhone
    return t.fieldErrors.invalid
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (submitting) return
    const parsed = bookingSchema.safeParse(toInput(values))
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      const first = parsed.error.issues[0]?.path[0]
      if (first) document.getElementById(`${uid}-${String(first)}`)?.focus()
      return
    }
    setErrors({})
    onSubmit(toInput(values))
  }

  const aria = (name: keyof BookingData) => ({
    id: `${uid}-${name}`,
    "aria-invalid": shown[name] ? true : undefined,
    "aria-describedby": shown[name] ? `${uid}-${name}-error` : undefined,
  })
  const errorText = (name: keyof BookingData) => {
    const text = message(name)
    return text ? (
      <p id={`${uid}-${name}-error`} className="mt-1.5 text-sm text-accent-text">
        {text}
      </p>
    ) : null
  }
  const label = (name: string, text: string, optional = false) => (
    <Label htmlFor={`${uid}-${name}`} className="mb-2">
      <span>
        {text}
        {optional ? <span className="font-normal text-neutral-500"> ({t.optional})</span> : null}
      </span>
    </Label>
  )

  return (
    <form noValidate onSubmit={submit} className="relative grid gap-x-4 gap-y-5 sm:grid-cols-2">
      <div>
        {label("fullName", t.fullName)}
        <Input
          {...aria("fullName")}
          autoComplete="name"
          value={values.fullName}
          onChange={(e) => set("fullName", e.target.value)}
          onBlur={() => check("fullName")}
          className={fieldClass}
        />
        {errorText("fullName")}
      </div>

      <div>
        {label("clinic", t.clinic)}
        <Input
          {...aria("clinic")}
          autoComplete="organization"
          value={values.clinic}
          onChange={(e) => set("clinic", e.target.value)}
          onBlur={() => check("clinic")}
          className={fieldClass}
        />
        {errorText("clinic")}
      </div>

      <div>
        {label("phone", t.whatsapp)}
        {/* The country code stays left-to-right, even on the Arabic page. */}
        <div className="flex gap-2" dir="ltr">
          <Select
            items={countryNames.map((c) => ({ value: c.code, label: `${c.code} ${c.dial}` }))}
            value={values.country}
            onValueChange={(v) => v && set("country", v as string)}
          >
            <SelectTrigger aria-label={t.countryLabel} className={cn(triggerClass, "w-28 shrink-0")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent alignItemWithTrigger={false} align="start" className="max-h-72 w-72">
              {countryNames.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  <span className="truncate">{c.name}</span>
                  <span className="ms-auto text-neutral-500 tabular-nums">{c.dial}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            {...aria("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            value={values.phoneLocal}
            onChange={(e) => set("phoneLocal", e.target.value)}
            onBlur={() => check("phone")}
            className={cn(fieldClass, "min-w-0")}
          />
        </div>
        {errorText("phone")}
      </div>

      <div>
        {label("email", t.email)}
        <Input
          {...aria("email")}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => check("email")}
          className={fieldClass}
        />
        {errorText("email")}
      </div>

      <div className="sm:col-span-2">
        {label("revenue", t.revenue, true)}
        <Select
          items={[
            { value: "", label: t.revenueNone },
            ...REVENUE_OPTIONS.map((r) => ({ value: r, label: t.revenueOptions[r] })),
          ]}
          value={values.revenue}
          onValueChange={(v) => set("revenue", (v ?? "") as RevenueOption | "")}
        >
          <SelectTrigger id={`${uid}-revenue`} className={cn(triggerClass, "w-full sm:max-w-xs")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false} align="start">
            <SelectItem value="">{t.revenueNone}</SelectItem>
            {REVENUE_OPTIONS.map((r) => (
              <SelectItem key={r} value={r}>
                {t.revenueOptions[r]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <div className="sm:col-span-2">
        {serverError ? (
          <p role="alert" className="mb-4 border-s-2 border-accent bg-accent-soft px-4 py-3 text-sm font-medium">
            {serverError}
          </p>
        ) : null}
        <div className="flex items-center gap-1.5">
          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting || undefined}
            className={`inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-none bg-neutral-950 px-5 font-mono text-xs font-medium tracking-wide uppercase text-white transition-colors hover:bg-neutral-800 disabled:cursor-wait disabled:opacity-70 sm:flex-none ${ring}`}
          >
            {submitting ? <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : null}
            {submitting ? t.submitting : t.submit}
          </button>
          <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-none bg-accent text-white">
            <ArrowRight className="size-4 rtl:rotate-180" />
          </span>
        </div>
      </div>
    </form>
  )
}
