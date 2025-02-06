import useResourcesQuery from '@/app/(dashboard)/pods/resources/use-resources-query';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useCallback, useState } from 'react';

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

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOnSubmit = useCallback((kbId: string) => {
    setSelectedKb(kbId);
    handleClose();
  }, [handleClose, setSelectedKb]);

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
      <FilePickerDialog open={isOpen} onClose={handleClose} onSubmit={handleOnSubmit} />
    </>
  );
}
