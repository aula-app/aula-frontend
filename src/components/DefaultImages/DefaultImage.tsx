import { useTheme } from '@mui/material';
import DinamicImages from './DinamicImages';

interface Props {
  image: number;
  shift: number;
}

const DefaultImage: React.FC<Props> = ({ image, shift, ...restOfProps }) => {
  const theme = useTheme();

  const shiftHslHue = (hslColor: string): string => {
    if (hslColor === 'none') return hslColor;

    const match = hslColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return hslColor;

    const [, h, s, l] = match;
    const newHue = (parseInt(h) + shift) % 360;
    return `hsl(${newHue}, ${s}%, ${l}%)`;
  };

  const COLORS = {
    bg: shiftHslHue(theme.palette.themeGreen.main),
    yellow_bright: shiftHslHue(theme.palette.themeYellow.light),
    yellow_base: shiftHslHue(theme.palette.themeYellow.main),
    yellow_shade: shiftHslHue(theme.palette.themeYellow.dark),
    red_bright: shiftHslHue(theme.palette.themeRed.light),
    red_base: shiftHslHue(theme.palette.themeRed.main),
    red_shade: shiftHslHue(theme.palette.themeRed.dark),
    blue_bright: shiftHslHue(theme.palette.themeBlue.light),
    blue_base: shiftHslHue(theme.palette.themeBlue.main),
    blue_shade: shiftHslHue(theme.palette.themeBlue.dark),
    green_bright: shiftHslHue(theme.palette.themeGreen.light),
    green_base: shiftHslHue(theme.palette.themeGreen.main),
    green_shade: shiftHslHue(theme.palette.themeGreen.dark),
    white: shiftHslHue(theme.palette.themeGrey.light),
    light_bright: shiftHslHue(theme.palette.themeGrey.light),
    light_base: shiftHslHue(theme.palette.themeGrey.main),
    light_shade: shiftHslHue(theme.palette.themeGrey.dark),
    noFill: 'none',
  };

  const ComponentToRender = DinamicImages[image];

  return <ComponentToRender colors={COLORS} aria-hidden="true" {...restOfProps} />;
};

export default DefaultImage;
