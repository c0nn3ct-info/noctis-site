import { setLocale } from '../i18n';
import { mountPage } from '../main';
import { HomePage } from '../pages/home';

setLocale('ru');
mountPage(<HomePage />);
