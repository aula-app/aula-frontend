import i18n from 'i18next';
import AboutViewDE from './AboutViewDE';
import AboutViewEN from './AboutViewEN';

const views: Record<string, React.ComponentType> = {
  de: AboutViewDE,
  en: AboutViewEN,
};

const AboutView = () => {
  const lang = i18n.language?.split('-')[0] ?? 'de';
  const View = views[lang] ?? AboutViewDE;
  return <View />;
};

export default AboutView;
