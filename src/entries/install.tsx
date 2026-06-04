import { isLocale, setLocale } from '../i18n';
import { mountPage } from '../main';
import { InstallPage } from '../pages/install';

const lang = document.documentElement.lang;
setLocale(isLocale(lang) ? lang : 'en');
mountPage(<InstallPage />);
