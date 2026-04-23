/**
 * מחלץ JSON מתשובת מודל — כולל גדרת ```json ... ``` אם קיימת.
 */
export function extractJsonObject(raw: string): unknown {
  const trimmed = raw.trim()
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  const body = fence ? fence[1].trim() : trimmed
  return JSON.parse(body)
}
