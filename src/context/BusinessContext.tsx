import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessData, BusinessProfile, DaySchedule, MenuItem, FAQItem, BotConfig, ApiSettings } from '../types';
import { defaultBusinessData } from '../data/defaultBusiness';
import { useAuth } from './AuthContext';
import { 
  fetchPublicBusinessBySlug, 
  fetchMyBusinesses, 
  createBusinessApi, 
  updateBusinessProfileApi, 
  updateBusinessHoursApi, 
  createMenuItemApi, 
  updateMenuItemApi, 
  deleteMenuItemApi, 
  createFaqApi, 
  updateFaqApi, 
  deleteFaqApi, 
  updateBotConfigApi,
  fetchExchangeRatesApi
} from '../services/api';
import { FALLBACK_EXCHANGE_RATES } from '../utils/currency';

interface BusinessContextType {
  businessData: BusinessData;
  setBusinessData: React.Dispatch<React.SetStateAction<BusinessData>>;
  myBusinesses: BusinessData[];
  isLoading: boolean;
  activeBusinessId: string;
  exchangeRates: Record<string, number>;
  visitorCurrency: string;
  setVisitorCurrency: (currencyCode: string) => void;
  loadBusinessBySlug: (slug: string) => Promise<boolean>;
  selectMyBusiness: (id: string) => void;
  createNewBusiness: (name: string, category?: string) => Promise<BusinessData>;
  updateProfile: (profile: Partial<BusinessProfile>) => Promise<void>;
  updateHours: (hours: DaySchedule[]) => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<MenuItem>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<MenuItem>;
  deleteMenuItem: (id: string) => Promise<void>;
  addFaq: (faq: Omit<FAQItem, 'id'>) => Promise<FAQItem>;
  updateFaq: (id: string, faq: Partial<FAQItem>) => Promise<FAQItem>;
  deleteFaq: (id: string) => Promise<void>;
  updateBotConfig: (config: Partial<BotConfig>) => Promise<void>;
  updateApiSettings: (settings: Partial<ApiSettings>) => void;
  refreshMyBusinesses: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [businessData, setBusinessData] = useState<BusinessData>(defaultBusinessData);
  const [myBusinesses, setMyBusinesses] = useState<BusinessData[]>([]);
  const [activeBusinessId, setActiveBusinessId] = useState<string>(defaultBusinessData.profile.id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(FALLBACK_EXCHANGE_RATES);
  const [visitorCurrency, setVisitorCurrency] = useState<string>('USD');

  // Load live exchange rates on initial mount
  useEffect(() => {
    fetchExchangeRatesApi().then(res => {
      if (res && res.rates) {
        setExchangeRates(res.rates);
      }
    }).catch(() => {});
  }, []);

  // When user logs in/out, fetch their businesses or reset
  useEffect(() => {
    if (user) {
      refreshMyBusinesses();
    } else {
      setMyBusinesses([]);
      setBusinessData(defaultBusinessData);
      setActiveBusinessId(defaultBusinessData.profile.id);
    }
  }, [user]);

  const refreshMyBusinesses = async () => {
    try {
      setIsLoading(true);
      const list = await fetchMyBusinesses();
      setMyBusinesses(list);
      if (list.length > 0) {
        // Set the active business to the first one if current active is not in list
        const currentInList = list.find(b => b.profile.id === activeBusinessId);
        const target = currentInList || list[0];
        setBusinessData(target);
        setActiveBusinessId(target.profile.id);
      }
    } catch (err) {
      console.warn('Failed to load my businesses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBusinessBySlug = async (slug: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const data = await fetchPublicBusinessBySlug(slug);
      setBusinessData(data);
      setActiveBusinessId(data.profile.id);
      return true;
    } catch (err) {
      console.warn('Failed to fetch business by slug:', slug, err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const selectMyBusiness = (id: string) => {
    const found = myBusinesses.find(b => b.profile.id === id);
    if (found) {
      setBusinessData(found);
      setActiveBusinessId(id);
    }
  };

  const createNewBusiness = async (name: string, category?: string): Promise<BusinessData> => {
    const created = await createBusinessApi({ name, category: category || 'Local Business' });
    setMyBusinesses(prev => [...prev, created]);
    setBusinessData(created);
    setActiveBusinessId(created.profile.id);
    return created;
  };

  const updateProfile = async (profileUpdate: Partial<BusinessProfile>) => {
    setBusinessData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profileUpdate }
    }));
    if (user && businessData.profile.id) {
      await updateBusinessProfileApi(businessData.profile.id, profileUpdate);
      setMyBusinesses(prev => prev.map(b => b.profile.id === businessData.profile.id ? { ...b, profile: { ...b.profile, ...profileUpdate } } : b));
    }
  };

  const updateHours = async (hours: DaySchedule[]) => {
    setBusinessData(prev => ({ ...prev, hours }));
    if (user && businessData.profile.id) {
      const updatedHours = await updateBusinessHoursApi(businessData.profile.id, hours);
      setMyBusinesses(prev => prev.map(b => b.profile.id === businessData.profile.id ? { ...b, hours: updatedHours } : b));
    }
  };

  const addMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    if (user && businessData.profile.id) {
      const created = await createMenuItemApi(businessData.profile.id, item);
      setBusinessData(prev => ({ ...prev, menu: [created, ...prev.menu] }));
      setMyBusinesses(prev => prev.map(b => b.profile.id === businessData.profile.id ? { ...b, menu: [created, ...b.menu] } : b));
      return created;
    } else {
      const localItem: MenuItem = { ...item, id: `menu_${Date.now()}` };
      setBusinessData(prev => ({ ...prev, menu: [localItem, ...prev.menu] }));
      return localItem;
    }
  };

  const updateMenuItem = async (id: string, itemUpdate: Partial<MenuItem>): Promise<MenuItem> => {
    setBusinessData(prev => ({
      ...prev,
      menu: prev.menu.map(i => i.id === id ? { ...i, ...itemUpdate } : i)
    }));
    if (user && businessData.profile.id) {
      const updated = await updateMenuItemApi(businessData.profile.id, id, itemUpdate);
      setMyBusinesses(prev => prev.map(b => b.profile.id === businessData.profile.id ? { ...b, menu: b.menu.map(i => i.id === id ? updated : i) } : b));
      return updated;
    }
    return { ...itemUpdate, id } as MenuItem;
  };

  const deleteMenuItem = async (id: string) => {
    setBusinessData(prev => ({
      ...prev,
      menu: prev.menu.filter(i => i.id !== id)
    }));
    if (user && businessData.profile.id) {
      await deleteMenuItemApi(businessData.profile.id, id);
      setMyBusinesses(prev => prev.map(b => b.profile.id === businessData.profile.id ? { ...b, menu: b.menu.filter(i => i.id !== id) } : b));
    }
  };

  const addFaq = async (faq: Omit<FAQItem, 'id'>): Promise<FAQItem> => {
    if (user && businessData.profile.id) {
      const created = await createFaqApi(businessData.profile.id, faq);
      setBusinessData(prev => ({ ...prev, faqs: [...prev.faqs, created] }));
      setMyBusinesses(prev => prev.map(b => b.profile.id === businessData.profile.id ? { ...b, faqs: [...b.faqs, created] } : b));
      return created;
    } else {
      const localFaq: FAQItem = { ...faq, id: `faq_${Date.now()}` };
      setBusinessData(prev => ({ ...prev, faqs: [...prev.faqs, localFaq] }));
      return localFaq;
    }
  };

  const updateFaq = async (id: string, faqUpdate: Partial<FAQItem>): Promise<FAQItem> => {
    setBusinessData(prev => ({
      ...prev,
      faqs: prev.faqs.map(f => f.id === id ? { ...f, ...faqUpdate } : f)
    }));
    if (user && businessData.profile.id) {
      const updated = await updateFaqApi(businessData.profile.id, id, faqUpdate);
      setMyBusinesses(prev => prev.map(b => b.profile.id === businessData.profile.id ? { ...b, faqs: b.faqs.map(f => f.id === id ? updated : f) } : b));
      return updated;
    }
    return { ...faqUpdate, id } as FAQItem;
  };

  const deleteFaq = async (id: string) => {
    setBusinessData(prev => ({
      ...prev,
      faqs: prev.faqs.filter(f => f.id !== id)
    }));
    if (user && businessData.profile.id) {
      await deleteFaqApi(businessData.profile.id, id);
      setMyBusinesses(prev => prev.map(b => b.profile.id === businessData.profile.id ? { ...b, faqs: b.faqs.filter(f => f.id !== id) } : b));
    }
  };

  const updateBotConfig = async (configUpdate: Partial<BotConfig>) => {
    setBusinessData(prev => ({
      ...prev,
      botConfig: { ...prev.botConfig, ...configUpdate }
    }));
    if (user && businessData.profile.id) {
      const updated = await updateBotConfigApi(businessData.profile.id, configUpdate);
      setMyBusinesses(prev => prev.map(b => b.profile.id === businessData.profile.id ? { ...b, botConfig: updated } : b));
    }
  };

  const updateApiSettings = (settingsUpdate: Partial<ApiSettings>) => {
    setBusinessData(prev => ({
      ...prev,
      apiSettings: { ...prev.apiSettings, ...settingsUpdate }
    }));
  };

  return (
    <BusinessContext.Provider value={{
      businessData,
      setBusinessData,
      myBusinesses,
      isLoading,
      activeBusinessId,
      exchangeRates,
      visitorCurrency,
      setVisitorCurrency,
      loadBusinessBySlug,
      selectMyBusiness,
      createNewBusiness,
      updateProfile,
      updateHours,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem,
      addFaq,
      updateFaq,
      deleteFaq,
      updateBotConfig,
      updateApiSettings,
      refreshMyBusinesses,
    }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) throw new Error('useBusiness must be used within a BusinessProvider');
  return context;
};
