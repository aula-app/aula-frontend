import { useAppStore } from '@/store';
import DinamicImages from './DinamicImages';

interface Props {
  image: number;
  shift: number;
}

const DefaultImage = ({ image, shift, ...restOfProps }: Props) => {
  const [state] = useAppStore();

  const LIGHT_COLORS = {
    bg: `hsl(${132 - shift}, 50%, 75%)`,
    yellow_base: `hsl(${shift + 45}, 100%, 60%)`,
    yellow_bright: `hsl(${shift + 45}, 100%, 85%)`,
    yellow_shade: `hsl(${shift + 45}, 100%, 50%)`,
    red_bright: `hsl(${shift}, 75%, 80%)`,
    red_base: `hsl(${shift}, 75%, 70%)`,
    red_shade: `hsl(${shift}, 75%, 50%)`,
    blue_base: `hsl(${shift + 207}, 50%, 55%)`,
    blue_bright: `hsl(${shift + 207}, 50%, 70%)`,
    blue_shade: `hsl(${shift + 207}, 50%, 15%)`,
    green_base: `hsl(${shift + 122}, 37.5%, 60%)`,
    green_bright: `hsl(${shift + 122}, 37.5%, 85%)`,
    green_shade: `hsl(${shift + 122}, 37.5%, 50%)`,
    light_base: `hsl(${shift + 39}, 50%, 90%)`,
    light_shade: `hsl(${shift + 39}, 50%, 80%)`,
    white: `hsl(${shift + 0}, 0%, 100%)`,
    noFill: 'none',
  };

  const DARK_COLORS = {
    bg: `hsl(${132 - shift}, 20%, 25%)`,
    yellow_base: `hsl(${shift + 45}, 30%, 50%)`,
    yellow_bright: `hsl(${shift + 45}, 30%, 85%)`,
    yellow_shade: `hsl(${shift + 45}, 50%, 50%)`,
    red_bright: `hsl(${shift}, 25%, 80%)`,
    red_base: `hsl(${shift}, 65%, 70%)`,
    red_shade: `hsl(${shift}, 25%, 50%)`,
    blue_base: `hsl(${shift + 207}, 40%, 55%)`,
    blue_bright: `hsl(${shift + 207}, 30%, 70%)`,
    blue_shade: `hsl(${shift + 207}, 20%, 15%)`,
    green_base: `hsl(${shift + 122}, 40%, 50%)`,
    green_bright: `hsl(${shift + 122}, 60%, 50%)`,
    green_shade: `hsl(${shift + 122}, 20%, 70%)`,
    light_base: `hsl(${shift + 39}, 60%, 90%)`,
    light_shade: `hsl(${shift + 39}, 40%, 80%)`,
    white: `hsl(${shift + 0}, 0%, 100%)`,
    noFill: 'none',
  };

  const ComponentToRender = DinamicImages[image];

  return <ComponentToRender colors={state.darkMode ? DARK_COLORS : LIGHT_COLORS} {...restOfProps} />;
};

export default DefaultImage;
