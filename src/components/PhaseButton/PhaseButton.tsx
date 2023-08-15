import { Box, Button, Stack } from '@mui/material';
import { FunctionComponent } from 'react';
import phases from '../../utils/phases';

interface Props {
  variant: keyof typeof phases; // Phase's name
  displayNumber?: number; // Phase's dusplay number
  noText?: boolean
}

const PhaseButton: FunctionComponent<Props> = ({variant, displayNumber, noText = false}) => {
  const CurrentIcon = phases[variant].icon;
  return (
    <Button
      disableElevation
      variant="contained"
      size="small"
      sx={{ borderRadius: 9999, width: '100%', textTransform: 'none', backgroundColor: phases[variant].color, color: '#000'}}
    >
      <Stack direction="row" alignItems="center" width="100%">
        <CurrentIcon fontSize='small' />
        { !noText &&
          <Box flexGrow={1} overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" textAlign="left" pl={1}>{phases[variant].name}</Box>
        }
        { displayNumber &&  displayNumber > 0 &&
          <Box sx={{mr: -.5, ml: .5, px: 1, borderRadius: 999, background: 'rgba(255,255,255,0.5)', height: 'auto'}}>{displayNumber}</Box>
        }
      </Stack>
    </Button>
  );
};

export default PhaseButton;
