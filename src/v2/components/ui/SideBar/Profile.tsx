import { getAvatar } from '@/services/media';
import { getSelf } from '@/services/users';
import { UserType } from '@/types/Scopes';
import { localStorageGet } from '@/utils';
import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import Button from '../../button/Button';

const PROFILE_PATH = '/settings/profile';

const SidebarProfile: FC = () => {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const [user, setUser] = useState<UserType | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string>('');

  const isActive = pathname === PROFILE_PATH || pathname.startsWith(`${PROFILE_PATH}/`);

  useEffect(() => {
    getSelf().then((res) => {
      if (res.data) setUser(res.data);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    const api_url = localStorageGet('api_url');
    const code = localStorageGet('code');
    getAvatar(user.hash_id).then((res) => {
      if (res.data?.[0]?.filename) {
        setAvatarSrc(`${api_url}/api/files/${code}/${res.data[0].filename}`);
      }
    });
  }, [user?.hash_id]);

  return (
    <Button
      text
      color="secondary"
      to={PROFILE_PATH}
      aria-current={isActive ? 'page' : undefined}
      aria-label={t('ui.navigation.profile')}
      className={twMerge('w-full shrink-0 justify-start gap-3 px-3', isActive && 'bg-shadow font-semibold')}
    >
      <span
        className="shrink-0 size-10 rounded-full bg-secondary/30 overflow-hidden flex items-center justify-center"
        aria-hidden="true"
      >
        {avatarSrc ? (
          <img src={avatarSrc} alt="" className="size-full object-cover" />
        ) : (
          <span className="text-lg font-bold text-text-secondary select-none">
            {user?.username?.[0]?.toUpperCase() ?? '?'}
          </span>
        )}
      </span>
      {user ? (
        <span className="flex flex-col items-start min-w-0 overflow-hidden">
          <span className="text-xl font-semibold truncate w-full">{user.username}</span>
          <span className="text-sm font-light text-text-secondary truncate w-full">{user.displayname}</span>
        </span>
      ) : (
        <span className="flex flex-col gap-1 flex-1">
          <span className="h-3 w-24 rounded bg-secondary/30 animate-pulse" aria-hidden="true" />
          <span className="h-2 w-16 rounded bg-secondary/20 animate-pulse" aria-hidden="true" />
        </span>
      )}
    </Button>
  );
};

SidebarProfile.displayName = 'SidebarProfile';

export default SidebarProfile;
