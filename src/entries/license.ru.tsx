import { setLocale } from '../i18n';
import { mountPage } from '../main';
import { LicensePage } from '../pages/license';

setLocale('ru');
mountPage(<LicensePage />);
