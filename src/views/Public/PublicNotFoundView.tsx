import { AppLink } from "@/components";
import { useTranslation } from "react-i18next";

/**
 * "Not Found" aka "Error 404" view
 */
const NotFoundViewView = () => {
  const { t } = useTranslation();
  return(
  <div>
    <p>{t('texts.unaltenticated')}</p>
    <p>
        <AppLink color="success" component={AppLink} to="/">
        {t('login.signIn')}
        </AppLink>
      </p>
  </div>
)}

export default NotFoundViewView;
