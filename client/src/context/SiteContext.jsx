import { createContext, useContext, useEffect, useState } from 'react'

const SiteContext = createContext(null)

const translations = {
  en: {
    home: 'Home',
    collections: 'Collections',
    about: 'About',
    requestQuotation: 'Request Quotation',
    exploreCollections: 'Explore Collections',
    viewOurStory: 'View Our Story',
    luxuryFurniture: 'Luxury Furniture, Crafted for the Senses',
    heroDescription: 'Discover exceptional furniture and materials that blend Damascus heritage with contemporary elegance, where every detail tells a story of craftsmanship and refinement.',
    atelier: 'The Atelier',
    excellence: 'Three decades of curatorial excellence',
    learnMore: 'Learn More',
    materialLab: 'Material Lab',
    materialTitle: 'Touch, compare, and decide with confidence',
    materialDescription: 'Interactive previews and carefully curated material stories let your next design decision feel elevated before you even visit the showroom.',
    exploreFabric: 'Explore fabric',
    getInTouch: 'Get in touch',
    speakTeam: 'Speak directly with Our Team',
    chatWhatsApp: 'Chat on WhatsApp',
    ourStory: 'Our Story',
    curation: 'Curation',
    expertise: 'Expertise',
    service: 'Service',
    visitUs: 'Visit Us',
    showroom: 'Showroom',
    address: 'Address',
    hours: 'Hours',
    whatsapp: 'WhatsApp',
    viewMaps: 'View on Google Maps',
    browseCollections: 'Browse Collections',
    theCollections: 'The Collections',
    viewDetails: 'View Details',
    sort: 'Sort',
    view: 'View',
    grid: 'Grid',
    list: 'List',
    result: 'result',
    results: 'results',
    all: 'All',
    collection: 'Collection',
    contactUs: 'Contact Us',
    customOrders: 'custom orders',
    notFound: 'Fabric not found',
    backToCollections: 'Back to Collections',
    premiumTextile: 'Premium Luxury Textile - SA Studio Damascus',
    moreIn: 'More in',
    close: 'Close',
    requestSent: 'Request Sent',
    fullName: 'Full Name',
    phone: 'Phone / WhatsApp',
    projectDetails: 'Project Details',
    sendRequest: 'Send Request',
    yourName: 'Your name',
    footerRights: 'All rights reserved.',
    language: 'العربية',
    themeLight: 'Light',
    themeDark: 'Dark',
  },
  ar: {
    home: 'الرئيسية',
    collections: 'المجموعات',
    about: 'من نحن',
    requestQuotation: 'طلب عرض سعر',
    exploreCollections: 'استكشف المجموعات',
    viewOurStory: 'اكتشف قصتنا',
    luxuryFurniture: 'أثاث فاخر، صُنع للحواس',
    heroDescription: 'اكتشف أثاثاً ومواد استثنائية تجمع بين تراث دمشق والأناقة المعاصرة، حيث تحكي كل تفصيلة قصة من الحرفية والرقي.',
    atelier: 'المشغل',
    excellence: 'ثلاثة عقود من التميز في الاختيار',
    learnMore: 'اعرف المزيد',
    materialLab: 'مختبر المواد',
    materialTitle: 'المس، قارن، واتخذ قرارك بثقة',
    materialDescription: 'تمنحك المعاينات التفاعلية وقصص المواد المختارة بعناية رؤية راقية لقرار التصميم قبل زيارة صالة العرض.',
    exploreFabric: 'استكشف القماش',
    getInTouch: 'تواصل معنا',
    speakTeam: 'تحدث مباشرة مع فريقنا',
    chatWhatsApp: 'تحدث عبر واتساب',
    ourStory: 'قصتنا',
    curation: 'اختيار دقيق',
    expertise: 'خبرة',
    service: 'خدمة',
    visitUs: 'زورونا',
    showroom: 'صالة العرض',
    address: 'العنوان',
    hours: 'ساعات العمل',
    whatsapp: 'واتساب',
    viewMaps: 'عرض الموقع على خرائط غوغل',
    browseCollections: 'تصفح المجموعات',
    theCollections: 'المجموعات',
    viewDetails: 'عرض التفاصيل',
    sort: 'ترتيب',
    view: 'عرض',
    grid: 'شبكة',
    list: 'قائمة',
    result: 'نتيجة',
    results: 'نتائج',
    all: 'الكل',
    collection: 'مجموعة',
    contactUs: 'تواصل معنا',
    customOrders: 'طلبات خاصة',
    notFound: 'القماش غير موجود',
    backToCollections: 'العودة إلى المجموعات',
    premiumTextile: 'منسوجات فاخرة - استوديو SA دمشق',
    moreIn: 'المزيد من',
    close: 'إغلاق',
    requestSent: 'تم إرسال الطلب',
    fullName: 'الاسم الكامل',
    phone: 'الهاتف / واتساب',
    projectDetails: 'تفاصيل المشروع',
    sendRequest: 'إرسال الطلب',
    yourName: 'اسمك',
    footerRights: 'جميع الحقوق محفوظة.',
    language: 'English',
    themeLight: 'فاتح',
    themeDark: 'داكن',
  },
}

export function SiteProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('sa-theme') || 'dark')
  const [language, setLanguage] = useState(() => localStorage.getItem('sa-language') || 'en')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('sa-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem('sa-language', language)
  }, [language])

  const value = {
    theme,
    language,
    toggleTheme: () => setTheme((current) => current === 'light' ? 'dark' : 'light'),
    toggleLanguage: () => setLanguage((current) => current === 'en' ? 'ar' : 'en'),
    t: (key) => translations[language][key] || translations.en[key] || key,
  }

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSite() {
  return useContext(SiteContext)
}
