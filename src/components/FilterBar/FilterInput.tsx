import { FilledInput } from '@mui/material';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import AppIconButton from '../AppIconButton';
import FilterGroup from './FilterGroup';
import FilterRoom from './FilterRoom';

type Params = {
  filter: [string, string];
  setFilter: Dispatch<SetStateAction<[string, string]>>;
};

const FilterInput = ({ filter, setFilter }: Params) => {
  const changeSearch = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilter([filter[0], event.target.value]);
  };

  switch (filter[0]) {
    case 'room_id':
      return <FilterRoom room={Number(filter[1])} setRoom={changeSearch} />;
    case 'target_group':
      return <FilterGroup group={Number(filter[1])} setGroup={changeSearch} />;
    default:
      return (
        <FilledInput
          size="small"
          onChange={changeSearch}
          value={filter[1]}
          disabled={filter[0] === ''}
          endAdornment={<AppIconButton icon="close" onClick={() => setFilter(['', ''])} />}
        />
      );
  }
};

export default FilterInput;
