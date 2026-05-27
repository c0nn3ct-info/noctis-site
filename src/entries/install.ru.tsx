import { setLocale } from '../i18n';
import { mountPage } from '../main';
import { InstallPage } from '../pages/install';

setLocale('ru');
mountPage(<InstallPage />);
