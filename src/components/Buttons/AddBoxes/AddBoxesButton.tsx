import AppIcon from '@/components/AppIcon';
import { getBoxes } from '@/services/boxes';
import { addIdeaBox, getIdeaBoxes, removeIdeaBox } from '@/services/ideas';
import { BoxType } from '@/types/Scopes';
import { UpdtesObject } from '@/types/SettingsTypes';
import {
  Button,
  ButtonProps,
  Checkbox,
  Dialog,
  DialogActions,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Typography,
} from '@mui/material';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props extends ButtonProps {
  ideas?: string[];
}

/**
 * Interface that will be exposed to the parent component.
 */
export interface AddBoxRefProps {
  setNewIdeaBoxes: (id: string) => void;
}

const AddBoxButton = forwardRef<AddBoxRefProps, Props>(({ ideas = [], disabled = false, ...restOfProps }, ref) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<BoxType[]>([]);
  const [selectedBox, setSelectedBox] = useState<string>('');
  const [indeterminateBoxes, setIndeterminateBoxes] = useState<string[]>([]);
  const [updates, setUpdates] = useState<UpdtesObject>({ add: [], remove: [] });

  const fetchBoxes = useCallback(async () => {
    const response = await getBoxes({
      limit: 0,
      offset: 0,
    });
    setLoading(false);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setBoxes(response.data);
  }, []);

  const fetchIdeasBoxes = async () => {
    if (ideas.length === 0) return;

    if (ideas.length === 1) {
      const boxes = await getIdeaBoxes(ideas[0]);
      if (boxes.data) setSelectedBox(boxes.data[0].hash_id);
      return;
    }

    const boxCounts: { [key: string]: number } = {};
    const commonBoxes = [] as string[];
    const partialBoxes = [] as string[];

    const Promises = ideas.map(async (idea) => {
      const boxes = await getIdeaBoxes(idea);
      boxes.data?.forEach((box) => {
        boxCounts[box.hash_id] = (boxCounts[box.hash_id] || 0) + 1;
      });
    });

    await Promise.all(Promises).then(() => {
      Object.keys(boxCounts).forEach((box_id) => {
        if (boxCounts[box_id] === ideas.length) {
          commonBoxes.push(box_id);
        } else {
          partialBoxes.push(box_id);
        }
      });

      setSelectedBox(commonBoxes[0]);
      setIndeterminateBoxes(partialBoxes);
    });
  };

  const toggleBox = (id: string) => {
    if (selectedBox !== id) {
      // add
      setSelectedBox(id);
      addUpdate(true, id);
    } else {
      // remove
      setSelectedBox('');
      addUpdate(false, id);
    }
  };

  const addUpdate = (add: boolean, id: string) => {
    if (add) {
      if (updates.add.includes(id)) return;
      if (updates.remove.includes(id))
        setUpdates({ add: updates.add.filter((box) => box !== id), remove: updates.remove });
      else setUpdates({ add: [...updates.add, id], remove: updates.remove });
    } else {
      if (updates.remove.includes(id)) return;
      if (updates.add.includes(id))
        setUpdates({ add: updates.add, remove: updates.remove.filter((box) => box !== id) });
      else setUpdates({ add: updates.add, remove: [...updates.remove, id] });
    }
    if (indeterminateBoxes.length > 0) {
      indeterminateBoxes
        .filter((box) => box !== id)
        .map((box) => setUpdates({ add: updates.add, remove: [...updates.remove, box] }));
      setIndeterminateBoxes([]);
    }
  };

  const setIdeasBoxes = async () => {
    const add = ideas.map((idea_id) => updates.add.map((box_id) => addIdeaBox(idea_id, box_id)));
    const remove = ideas.map((idea_id) => updates.remove.map((box_id) => removeIdeaBox(idea_id, box_id)));
    await Promise.all([...add, ...remove]);
    setUpdates({ add: [], remove: [] });
  };

  const setNewIdeaBoxes = (user_id: string) => {
    updates.add.map((box_id) => addIdeaBox(user_id, box_id));
    setUpdates({ add: [], remove: [] });
  };

  useImperativeHandle(ref, () => ({
    setNewIdeaBoxes,
  }));

  const onSubmit = () => {
    if (ideas.length > 0) setIdeasBoxes();
    setOpen(false);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onReset = () => {
    setSelectedBox('');
    setUpdates({ add: [], remove: [] });
    fetchBoxes();
    fetchIdeasBoxes();
  };

  useEffect(() => {
    if (open) onReset();
  }, [open, ideas]);

  return (
    <>
      <Button 
        variant="outlined" 
        color="secondary" 
        onClick={() => setOpen(true)} 
        disabled={disabled} 
        aria-label={t('actions.addToParent', { var: t('scopes.boxes.name') })}
        {...restOfProps}
      >
        <AppIcon icon="box" pr={2} />
        {t('actions.addToParent', {
          var: t('scopes.boxes.name'),
        })}
      </Button>
      <Dialog onClose={onClose} open={open}>
        <DialogTitle>
          {t('actions.addToParent', {
            var: t('scopes.boxes.name'),
          })}
        </DialogTitle>
        {isLoading && <Skeleton />}
        {error && <Typography>{t(error)}</Typography>}
        <List sx={{ pt: 0 }}>
          {boxes.map((box) => (
            <ListItem disablePadding key={box.hash_id}>
              <ListItemButton onClick={() => toggleBox(box.hash_id)}>
                <ListItemAvatar>
                  <Checkbox
                    checked={selectedBox === box.hash_id}
                    indeterminate={selectedBox !== box.hash_id && indeterminateBoxes.includes(box.hash_id)}
                  />
                </ListItemAvatar>
                <ListItemText primary={box.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <DialogActions>
          <Button 
            onClick={onClose} 
            color="secondary" 
            autoFocus
            aria-label={t('actions.cancel')}
          >
            {t('actions.cancel')}
          </Button>
          <Button 
            onClick={onSubmit} 
            variant="contained"
            aria-label={t('actions.confirm')}
          >
            {t('actions.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default AddBoxButton;
