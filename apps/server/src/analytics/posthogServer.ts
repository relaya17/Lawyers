import { PostHog } from 'posthog-node'

let client: PostHog | null = null

/**
 * Lazily create a server-side PostHog client. Returns null if POSTHOG_KEY
 * is missing (so webhook/request handlers become no-ops in dev).
 */
export function getPostHog(): PostHog | null {
  if (client) return client
  const key = process.env.POSTHOG_KEY?.trim()
  if (!key) return null
  client = new PostHog(key, {
    host: process.env.POSTHOG_HOST ?? 'https://us.i.posthog.com',
    flushAt: 1,
    flushInterval: 2000,
  })
  return client
}

export type ServerAnalyticsProps = Record<string, string | number | boolean | null | undefined>

/** Fire-and-forget capture. Safe to call when PostHog is not configured. */
export function captureServerEvent(params: {
  distinctId: string
  event: string
  properties?: ServerAnalyticsProps
}): void {
  const ph = getPostHog()
  if (!ph) return
  ph.capture({
    distinctId: params.distinctId,
    event: params.event,
    properties: params.properties ?? {},
  })
}

export async function shutdownPostHog(): Promise<void> {
  if (!client) return
  await client.shutdown()
  client = null
}
