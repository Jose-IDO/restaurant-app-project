import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'app_last_activity_epoch_ms';
/** One week of no app use → session treated as expired (client-side). */
export const INACTIVITY_LOGOUT_MS = 7 * 24 * 60 * 60 * 1000;

export const sessionActivityService = {
  async recordActivity(): Promise<void> {
    try {
      await AsyncStorage.setItem(KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  },

  async clearActivity(): Promise<void> {
    try {
      await AsyncStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  },

  /**
   * True if we have a stored timestamp and it is older than one week.
   * False if missing (first run / legacy) — caller should record activity after login.
   */
  async isInactiveBeyondThreshold(): Promise<boolean> {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw == null) return false;
      const last = parseInt(raw, 10);
      if (Number.isNaN(last)) return false;
      return Date.now() - last > INACTIVITY_LOGOUT_MS;
    } catch {
      return false;
    }
  },
};
