// Business details that aren't translated (links, phone, prices). More are added as the content arrives.

/** Public URL of the site, used for share images and metadata. Set NEXT_PUBLIC_SITE_URL on Vercel. */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://medspa.intelligentb2b.com"

/** Shown as the site name in link previews. */
export const siteName = "Torch"

/**
 * WhatsApp chat link (footer, and "Book on WhatsApp instead" when the booking calendar can't load).
 * The number is the phone listed on intelligentb2b.com: +39 339 562 2204.
 */
export const whatsappUrl = "https://wa.me/393395622204"
