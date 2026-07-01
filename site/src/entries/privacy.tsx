import { isLocale, setLocale } from '../i18n';
import { mountPage } from '../main';
import { PrivacyPage } from '../pages/privacy';

const lang = document.documentElement.lang;
setLocale(isLocale(lang) ? lang : 'en');
mountPage(<PrivacyPage />);
