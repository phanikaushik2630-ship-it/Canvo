import { BusinessData } from '../types';
import { defaultBusinessData } from '../data/defaultBusiness';

const STORAGE_KEY = 'convo_business_data_v1';
const CHAT_HISTORY_KEY = 'convo_chat_history_v1';

export function loadStoredBusinessData(): BusinessData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultBusinessData;
    const parsed = JSON.parse(raw);
    // Ensure all critical sections exist
    return {
      profile: { ...defaultBusinessData.profile, ...(parsed.profile || {}) },
      hours: parsed.hours || defaultBusinessData.hours,
      menu: parsed.menu || defaultBusinessData.menu,
      faqs: parsed.faqs || defaultBusinessData.faqs,
      botConfig: { ...defaultBusinessData.botConfig, ...(parsed.botConfig || {}) },
      apiSettings: { ...defaultBusinessData.apiSettings, ...(parsed.apiSettings || {}) },
    };
  } catch (err) {
    console.error('Failed to parse stored business data:', err);
    return defaultBusinessData;
  }
}

export function saveStoredBusinessData(data: BusinessData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save business data to localStorage:', err);
  }
}

export function resetStoredBusinessData(): BusinessData {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return defaultBusinessData;
  } catch (err) {
    console.error('Failed to reset storage:', err);
    return defaultBusinessData;
  }
}

export function exportBusinessDataAsJson(data: BusinessData): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  const filename = `${data.profile.id || 'business'}-convo-config.json`;
  downloadAnchor.setAttribute("download", filename);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export async function importBusinessDataFromJson(file: File): Promise<BusinessData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.profile || !json.hours || !json.menu) {
          throw new Error('Invalid format: missing profile, hours, or menu');
        }
        resolve(json as BusinessData);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}
