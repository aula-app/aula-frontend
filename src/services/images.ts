import { baseRequest } from './requests';

export const uploadImage = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file, 'avatar.png');
  formData.append('fileType', 'avatar');

  return baseRequest('/api/controllers/upload.php', formData, false);
};
