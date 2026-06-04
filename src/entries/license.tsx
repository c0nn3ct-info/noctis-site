import { isLocale, setLocale } from '../i18n';
import { mountPage } from '../main';
import { LicensePage } from '../pages/license';

const lang = document.documentElement.lang;
setLocale(isLocale(lang) ? lang : 'en');
mountPage(<LicensePage />);
