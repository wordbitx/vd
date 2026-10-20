export type ReminderPrefs = { whatsappReminders: boolean; emailReminders: boolean; smsNoShow: boolean };

const DEFAULTS: ReminderPrefs = { whatsappReminders: true, emailReminders: true, smsNoShow: true };

/** Reminder preferences are stored as a PREFS:{json}| prefix on the user's internal note. */
export function readReminderPrefs(notes?: string): ReminderPrefs {
  const match = /^PREFS:(\{.*?\})\|/.exec(notes ?? "");
  if (!match) return DEFAULTS;
  try {
    return { ...DEFAULTS, ...(JSON.parse(match[1]) as Partial<ReminderPrefs>) };
  } catch {
    return DEFAULTS;
  }
}

export const stripInternalPrefixes = (notes?: string) => (notes ?? "").replace(/^PREFS:\{.*?\}\|/, "").replace(/^NOTE:/, "");
