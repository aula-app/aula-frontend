import DynamicImages from './DynamicImages';
import { useTranslation } from 'react-i18next';

const IMAGE_SUBJECT_KEYS = ['airplane', 'beaker', 'cat', 'chair', 'clothing', 'computer', 'door', 'globe'] as const;

interface Props extends React.SVGProps<SVGSVGElement> {
  image: number;
  shift: number;
}

const DefaultImage = ({ image, shift, style, ...restOfProps }: Props) => {
  const { t } = useTranslation();
  const ComponentToRender = DynamicImages[image];

  return (
    <ComponentToRender
      style={{ filter: `hue-rotate(${shift}deg)`, ...style }}
      aria-label={t('ui.accessibility.defaultImage.label', {
        subject: t(`ui.accessibility.defaultImage.${IMAGE_SUBJECT_KEYS[image]}`),
      })}
      {...restOfProps}
    />
  );
};

export default DefaultImage;
