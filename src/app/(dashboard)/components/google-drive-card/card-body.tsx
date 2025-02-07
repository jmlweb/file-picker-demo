'use client';

import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import useKbs from '@/app/(dashboard)/pods/kb/use-kbs';
import FilePicker from './file-picker/file-picker';
import KbResources from '../kb-resources/kb-resources';

export default function CardBody() {
  const { data } = useKbs();

  const [selectedKb, setSelectedKb] = useState<string | null>(null);

  const hasData = data && Object.entries(data).length > 0;

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={selectedKb ?? undefined}
        onValueChange={setSelectedKb}
        disabled={!hasData ? true : undefined}
      >
        <SelectTrigger>
          <SelectValue placeholder={hasData ? 'Select a knowledge base' : 'No knowledge bases found'} />
        </SelectTrigger>
        {hasData && (
          <SelectContent>
            {Object.entries(data).map(([id, { name }]) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        )}
      </Select>
      {selectedKb ? (
        <KbResources kbId={selectedKb} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-sm uppercase text-muted-foreground">or</p>
          <FilePicker setSelectedKb={setSelectedKb} />
        </div>
      )}
    </div>
  );
}
