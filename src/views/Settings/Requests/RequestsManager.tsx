import ReportCard from '@/components/ReportCard';
import { useAppStore } from '@/store';
import { MessageType, ReportBodyType, RequestBodyType } from '@/types/Scopes';
import { databaseRequest } from '@/utils';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

interface Props {
  report: MessageType;
  onReload: () => Promise<void>;
}

/** * Renders "RequestsManager" component
 * url: /settings/requests
 */

const RequestsManager = ({ report, onReload }: Props) => {
  const { t } = useTranslation();
  const [, dispatch] = useAppStore();

  const bodyData: RequestBodyType = JSON.parse(report.body);

  const confirmRequestData = async () => {
    if (!bodyData.data) return;
    await databaseRequest(
      {
        model: 'Message',
        method: 'addMessage',
        arguments: {
          headline: 'Account data export granted',
          body: JSON.stringify({
            type: 'exportData',
            content: `Your data request is availible`,
          }),
          target_id: bodyData.data.id,
          msg_type: 5,
        },
      },
      ['creator_id', 'updater_id']
    ).then((response) => {
      if (!response.success) return;
      dispatch({ type: 'ADD_POPUP', message: { message: 'success', type: 'success' } });
    });
  };

  const confirmExportData = async () => {
    await databaseRequest(
      {
        model: 'User',
        method: 'getUserGDPRData',
        arguments: {},
      },
      ['user_id']
    ).then((response) => {
      if (response.success) exportData(response.data);
    });
  };

  const exportData = (data: Object) => {
    const file = document.createElement('a');
    file.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
    file.setAttribute('download', `data_export_${dayjs().format('YYYY-MM-DD_HH:mm')}.txt`);

    file.style.display = 'none';
    document.body.appendChild(file);

    file.click();

    document.body.removeChild(file);
  };

  const confirmNameChange = async () => {
    if (!bodyData.data) return;
    await databaseRequest(
      {
        model: 'User',
        method: 'setUserProperty',
        arguments: {
          user_id: bodyData.data.id,
          property: bodyData.data.property,
          prop_value: bodyData.data.to,
        },
      },
      ['updater_id']
    ).then((response) => {
      if (response.success) dispatch({ type: 'ADD_POPUP', message: { message: 'success', type: 'success' } });
    });
  };

  const onConfirm = () => {
    switch (bodyData.type) {
      case 'changeName':
        confirmNameChange();
        break;
      case 'exportData':
        confirmExportData();
        break;
      case 'requestData':
        confirmRequestData();
        break;
      default:
        () => {};
    }
  };

  return <ReportCard report={report} onConfirm={onConfirm} onReload={onReload} />;
};

export default RequestsManager;
