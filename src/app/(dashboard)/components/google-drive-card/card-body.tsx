'use client';

import { useState, useEffect } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import useKbsQuery from '@/app/(dashboard)/pods/kb/use-kbs-query';
import FilePicker from './file-picker/file-picker';
import KbResources from '../kb-resources/kb-resources';

export default function CardBody() {
  const { data } = useKbsQuery();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedKb, setSelectedKb] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const hasData = isMounted && data !== undefined && data.length > 0;
  return (
    <div className="flex flex-col gap-2">
      <Select
        value={selectedKb ?? undefined}
        onValueChange={setSelectedKb}
        disabled={!hasData ? true : undefined}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              hasData ? 'Select a knowledge base' : 'No knowledge bases found'
            }
          />
        </SelectTrigger>
        {hasData && (
          <SelectContent>
            {data.map((item) => (
              <SelectItem
                key={item.knowledge_base_id}
                value={item.knowledge_base_id}
              >
                {item.name}
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
