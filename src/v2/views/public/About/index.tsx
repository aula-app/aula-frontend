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
  return (
    <div className="flex-1 min-h-0 overflow-y-auto w-full p-4" data-testid="about-view">
      <View />
    </div>
  );
};

export default AboutView;
