import { getSelf } from '@/services/users';
import { UserType } from '@/types/Scopes';
import { useEffect, useState } from 'react';
import UserAvatar from '../UserAvatar';

/**
 * Renders User info with Avatar
 * @component UserInfo
 */
const UserInfo = () => {
  const [user, setUser] = useState<UserType | null>(null);

  const getUserInfo = async () => {
    const response = await getSelf();
    if (response.data) setUser(response.data);
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  return (
    <div className="m-2">
      {user && (
        <div className="flex flex-row items-center min-h-fit gap-2">
          <UserAvatar id={user.hash_id} size={52} />
          <div className="flex-1">
            <h3 className="mt-1 text-2xl font-bold truncate">{user.username}</h3>
            <p className="text-sm font-light truncate">{user.displayname}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
