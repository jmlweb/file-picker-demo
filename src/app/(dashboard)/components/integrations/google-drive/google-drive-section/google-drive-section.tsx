import { useCurrentIntegrationStore } from '@/app/(dashboard)/store';
import useProfile from '@/app/(dashboard)/use-profile';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogFooter } from '@/components/ui/dialog';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { createKb } from '../../knowledge-base/knowledge-base-service';
import { useKbPendingOpsStore } from '../../knowledge-base/store';
import IntegrationsContentLayout from '../../integrations-content-layout/integrations-content-layout';
import useConnectionId from '../use-connection-id';
import { GoogleDriveResources } from './google-drive-resources';
import ScrollLayout from './scroll-layout';
import { useAllSelectedStore, useUncheckStore } from './store';
import { useRouter } from 'next/navigation';

function AllItemsSelectedToggler() {
  const { allItemsSelected, setAllItemsSelected } = useAllSelectedStore();
  const incrementUncheck = useUncheckStore((state) => state.incrementUncheck);
  return (
    <div className="flex items-center space-x-2 py-4">
      <Checkbox
        id="select-all"
        checked={allItemsSelected}
        onCheckedChange={(event) => {
          const isChecked = typeof event === 'boolean' ? event : false;
          setAllItemsSelected(isChecked);
          if (!isChecked) {
            incrementUncheck();
          }
        }}
      />
      <label
        htmlFor="select-all"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Select all
      </label>
    </div>
  );
}

function GoogleDriveSectionContent() {
  const addPendingOps = useKbPendingOpsStore((state) => state.addPendingOps);
  const removePendingOps = useKbPendingOpsStore(
    (state) => state.removePendingOps,
  );
  const { data: connectionId } = useConnectionId();
  const { data: profileData } = useProfile();
  const { toast } = useToast();
  const router = useRouter();
  const createKbMutation = useMutation({
    mutationFn: async (selectedItems: string[]) => {
      if (!connectionId) {
        throw new Error('No connection ID found');
      }
      const kbId = await createKb(connectionId, selectedItems);
      if (!profileData) {
        throw new Error('No profile data found');
      }
      const syncResponse = await fetch(
        `/integrations-api/knowledge-database/sync?knowledgeBaseId=${kbId}&orgId=${profileData.org_id}`,
      );
      if (!syncResponse.ok) {
        throw new Error('Failed to sync knowledge base');
      }
      return kbId;
    },
  });

  const resetCurrentIntegration = useCurrentIntegrationStore(
    (state) => state.resetCurrentIntegration,
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // retrieve the values from the form
    const formData = new FormData(e.target as HTMLFormElement);
    const selectedItems = Array.from(formData.getAll('selectedItems')).map(
      String,
    );
    addPendingOps(
      Object.fromEntries(selectedItems.map((item) => [item, 'add'])),
    );
    await createKbMutation.mutateAsync(selectedItems as string[], {
      onError: (error) => {
        toast({
          title: 'Error creating knowledge base',
          description: error.message,
          variant: 'destructive',
        });
        removePendingOps(selectedItems);
      },
      onSuccess: (kbId) => {
        toast({
          title: 'Knowledge base created',
          description:
            'Your knowledge base has been created and is being indexed',
        });
        resetCurrentIntegration();
        router.push(`/?kbId=${kbId}`);
      },
    });
  };

  return (
    <form className="flex flex-1 flex-col" onSubmit={handleSubmit}>
      <div className="mx-4 flex flex-1 flex-col md:mx-6">
        <AllItemsSelectedToggler />
        <TooltipProvider>
          <ScrollLayout>
            <GoogleDriveResources />
          </ScrollLayout>
        </TooltipProvider>
      </div>
      <DialogFooter className="mx-4 mt-auto items-center py-2 md:mx-6 md:py-4">
        <div className="flex-1 py-2 text-center text-sm text-muted-foreground md:py-0 md:text-left">
          We recommend selecting as few items as needed.
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => resetCurrentIntegration()}
            disabled={!connectionId || createKbMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            size="lg"
            type="submit"
            disabled={
              !connectionId || !profileData || createKbMutation.isPending
            }
          >
            {profileData ? (
              'Select'
            ) : (
              <>
                <Loader2 className="animate-spin" />
                Select
              </>
            )}
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}

export default function GoogleDriveSection() {
  return (
    <IntegrationsContentLayout
      title={
        <>
          <Image
            src="/logos/google-drive.svg"
            alt=""
            width={24}
            height={24}
            className="size-6"
          />{' '}
          Google Drive
        </>
      }
    >
      <GoogleDriveSectionContent />
    </IntegrationsContentLayout>
  );
}
