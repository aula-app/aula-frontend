import { useAppStore } from '@/store';
import DynamicImages from './DynamicImages';

interface Props {
  image: number;
  shift: number;
}

const hues = (shift: number) => ({
  bg: 132 - shift,
  yellow: shift + 45,
  red: shift,
  blue: shift + 207,
  green: shift + 122,
  light: shift + 39,
  white: shift,
  black: shift,
});

const TONES = {
  light: {
    bg: [55, 78],
    white: [0, 100],
    black: [0, 0],
    light_bright: [14, 97],
    light_base: [12, 90],
    light_shade: [10, 82],
    yellow_bright: [100, 82],
    yellow_base: [100, 62],
    yellow_shade: [95, 50],
    red_bright: [85, 79],
    red_base: [80, 68],
    red_shade: [75, 50],
    blue_bright: [62, 71],
    blue_base: [58, 56],
    blue_shade: [55, 20],
    green_bright: [48, 84],
    green_base: [45, 58],
    green_shade: [42, 46],
  },
  dark: {
    bg: [28, 16],
    white: [8, 46],
    black: [8, 78],
    light_bright: [10, 50],
    light_base: [9, 43],
    light_shade: [8, 36],
    yellow_bright: [72, 62],
    yellow_base: [72, 50],
    yellow_shade: [70, 38],
    red_bright: [58, 62],
    red_base: [58, 50],
    red_shade: [55, 38],
    blue_bright: [48, 62],
    blue_base: [48, 50],
    blue_shade: [45, 38],
    green_bright: [38, 62],
    green_base: [38, 50],
    green_shade: [36, 38],
  },
} as const;

const DefaultImage = ({ image, shift, ...restOfProps }: Props) => {
  const [{ darkMode }] = useAppStore();

  const hue = hues(shift);
  const tones = darkMode ? TONES.dark : TONES.light;

  const COLORS: Record<string, string> = { noFill: 'none' };
  for (const [token, [saturation, lightness]] of Object.entries(tones)) {
    const family = token.split('_')[0] as keyof typeof hue;
    COLORS[token] = `hsl(${hue[family]}, ${saturation}%, ${lightness}%)`;
  }

  const ComponentToRender = DynamicImages[image];

  return <ComponentToRender colors={COLORS} {...restOfProps} />;
};

export default DefaultImage;
