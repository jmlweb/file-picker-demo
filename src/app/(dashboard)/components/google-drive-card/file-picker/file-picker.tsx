import useCreateKbMutation from '@/app/(dashboard)/pods/kb/use-create-kb-mutation';
import { usePrefetchKbResourcesQuery } from '@/app/(dashboard)/pods/kb/use-kb-resources-query';
import useSyncKbMutation from '@/app/(dashboard)/pods/kb/use-sync-kb-mutation';
import useResourcesQuery from '@/app/(dashboard)/pods/resources/use-resources-query';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';
import { useFilePickerStore } from './store';
import { useRefreshKbsQuery } from '@/app/(dashboard)/pods/kb/use-kbs-query';

const FilePickerDialog = dynamic(() => import('./file-picker-dialog'), {
  ssr: false,
});

export default function FilePicker({
  setSelectedKb,
}: {
  setSelectedKb: (kbId: string) => void;
}) {
  // Preload root resources ASAP
  useResourcesQuery('gdrive');
  const [isOpen, setIsOpen] = useState(false);
  const createKbMutation = useCreateKbMutation('gdrive');
  const syncKbMutation = useSyncKbMutation('gdrive');
  const refreshKbsQuery = useRefreshKbsQuery();
  const prefetchKbResourcesQuery = usePrefetchKbResourcesQuery();
  const { toast } = useToast();

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const ids = useFilePickerStore.getState().ids;
    if (ids.length === 0) {
      return;
    }
    createKbMutation.mutate(
      {
        name: `Test Knowledge Base ${new Date().toLocaleString()}`,
        description: 'This is a test knowledge base',
        connection_source_ids: ids,
      },
      {
        onError: (error) => {
          toast({
            title: 'Error creating knowledge base',
            description: error.message,
            variant: 'destructive',
          });
        },
        onSuccess: (kbData) => {
          refreshKbsQuery(kbData);
          const kbId = kbData.knowledge_base_id;
          prefetchKbResourcesQuery(kbId);
          setSelectedKb(kbId);
          setIsOpen(false);
          syncKbMutation.mutate(kbId, {
            onError: (error) => {
              toast({
                title: 'Error syncing knowledge base',
                description: error.message,
                variant: 'destructive',
              });
            },
          });
        },
      },
    );
  }, [
    createKbMutation,
    toast,
    refreshKbsQuery,
    prefetchKbResourcesQuery,
    setSelectedKb,
    syncKbMutation,
  ]);

  return (
    <>
      <Button
        className="w-full"
        variant="outline"
        onClick={() => setIsOpen(true)}
      >
        <span className="text-muted-foreground">Pick files from</span> Google
        Drive
      </Button>
      <FilePickerDialog
        open={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isPending={createKbMutation.isPending}
      />
    </>
  );
}
