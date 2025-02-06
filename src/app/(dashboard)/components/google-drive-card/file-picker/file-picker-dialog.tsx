
import { ComponentPropsWithoutRef } from 'react';
import DialogLayout from './dialog-layout';
export default function FilePickerDialog({
  open,
  onClose,
  onSubmit,
}: Omit<ComponentPropsWithoutRef<typeof DialogLayout>, 'children'> & {
  onSubmit: (kbId: string) => void;
}) {
  return (
    <DialogLayout open={open} onClose={onClose}>
      <p>Children</p>
    </DialogLayout>
  );
}
