import AppIcon from '@/components/AppIcon';
import { addIdeaBox, getIdeasByRoom, removeIdeaBox } from '@/services/ideas';
import { IdeaType } from '@/types/Scopes';
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
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

interface Props extends ButtonProps {
  ideas?: IdeaType[];
  onClose: () => void;
}

/**
 * Interface that will be exposed to the parent component.
 */
export interface AddIdeaRefProps {
  setNewIdeaIdeas: (id: string) => void;
}

const AddIdeasButton = forwardRef<AddIdeaRefProps, Props>(({ ideas = [], onClose, ...restOfProps }, ref) => {
  const { t } = useTranslation();
  const { room_id, box_id } = useParams();

  const [open, setOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roomIdeas, setIdeas] = useState<IdeaType[]>([]);
  const [selectedIdeas, setSelectedIdeas] = useState<IdeaType[]>(ideas);

  const fetchIdeas = useCallback(async () => {
    if (!room_id) return;
    const response = await getIdeasByRoom(room_id);
    setLoading(false);
    if (response.error) setError(response.error);
    if (!response.error) setIdeas(ideas.concat(response.data || []));
  }, []);

  const toggleIdea = (idea: IdeaType) => {
    const selectedIdea = selectedIdeas.find((selected) => selected.hash_id === idea.hash_id);
    if (!selectedIdea) {
      setSelectedIdeas([...selectedIdeas, idea]);
    } else {
      setSelectedIdeas(selectedIdeas.filter((selected) => selected.hash_id !== idea.hash_id));
    }
  };

  const addIdea = async (idea_id: string) => {
    if (!box_id) return;
    const result = await addIdeaBox(idea_id, box_id);
    return result;
  };

  const removeIdea = async (idea_id: string) => {
    if (!box_id) return;
    const result = await removeIdeaBox(idea_id, box_id);
    return result;
  };

  const onSubmit = () => {
    const addPromises = selectedIdeas
      .filter((selected) => !ideas.some((idea) => idea.hash_id === selected.hash_id))
      .map((idea) => addIdea(idea.hash_id));

    const removePromises = ideas
      .filter((idea) => !selectedIdeas.some((selected) => selected.hash_id === idea.hash_id))
      .map((idea) => removeIdea(idea.hash_id));

    Promise.all([...addPromises, ...removePromises])
      .then(() => {
        handleClose();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleClose = () => {
    setOpen(false);
    onClose();
  };

  const onReset = () => {
    setSelectedIdeas(ideas);
    fetchIdeas();
  };

  useEffect(() => {
    if (open) onReset();
  }, [open, ideas]);

  return (
    <>
      <Button
        variant="outlined"
        color="secondary"
        sx={{ height: 68, width: '100%', borderRadius: 6, borderStyle: 'dashed' }}
        onClick={() => setOpen(true)}
        aria-label={t('actions.add', { var: t('scopes.ideas.name') })}
        aria-expanded={open}
        aria-haspopup="dialog"
        {...restOfProps}
      >
        <AppIcon icon="add" mr={1} />
        {t('actions.add', { var: t('scopes.ideas.name') })}
      </Button>
      <Dialog 
        onClose={handleClose} 
        open={open}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-ideas-dialog-title"
      >
        <DialogTitle id="add-ideas-dialog-title">
          {t('actions.add', {
            var: t('scopes.ideas.name'),
          })}
        </DialogTitle>
        {isLoading && <Skeleton />}
        {error && <Typography>{t(error)}</Typography>}
        <List 
          sx={{ pt: 0 }} 
          role="listbox" 
          aria-label={t('scopes.ideas.name')}
          aria-multiselectable="true"
        >
          {roomIdeas.map((idea) => {
            const selectedIdea = selectedIdeas.find((selected) => selected.hash_id === idea.hash_id);
            return (
              <ListItem disablePadding key={idea.hash_id} role="option" aria-selected={!!selectedIdea}>
                <ListItemButton 
                  onClick={() => toggleIdea(idea)}
                  role="checkbox"
                  aria-checked={!!selectedIdea}
                >
                  <ListItemAvatar>
                    <Checkbox checked={!!selectedIdea} />
                  </ListItemAvatar>
                  <ListItemText primary={idea.title} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <DialogActions role="group" aria-label={t('actions.dialog.actions')}>
          <Button 
            onClick={handleClose} 
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

export default AddIdeasButton;
