import { setLocale } from '../i18n';
import { mountPage } from '../main';
import { PrivacyPage } from '../pages/privacy';

setLocale('ru');
mountPage(<PrivacyPage />);
