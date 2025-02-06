import ReportCard from '@/components/ReportCard';
import ReportCardSkeleton from '@/components/ReportCard/ReportCardSkeleton';
import { getMessage } from '@/services/messages';
import { MessageType } from '@/types/Scopes';
import { Stack } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/**
 * Renders "Report" view
 * url: /report
 */

const ReportView = () => {
  const navigate = useNavigate();
  const { report_id } = useParams();

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<MessageType>();

  const fetchReport = useCallback(async () => {
    if (!report_id) return;
    setLoading(true);
    const response = await getMessage(report_id);
    if (response.error) setError(response.error);
    if (!response.error && response.data) setReport(response.data);
    setLoading(false);
  }, [report_id]);

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <Stack p={2} flex={1} sx={{ overflowY: 'auto' }}>
      {!isLoading && report ? (
        <ReportCard report={report} onReload={() => navigate('/messages')} />
      ) : (
        <ReportCardSkeleton />
      )}
    </Stack>
  );
};

export default ReportView;
