import { isLocale, setLocale } from '../i18n';
import { mountPage } from '../main';
import { HomePage } from '../pages/home';

const lang = document.documentElement.lang;
setLocale(isLocale(lang) ? lang : 'en');
mountPage(<HomePage />);
