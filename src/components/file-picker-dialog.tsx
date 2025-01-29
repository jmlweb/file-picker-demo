'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IntegrationSidebar } from '../components/integration-sidebar';
import { FileTree } from '../components/file-tree';
import type { FileItem } from '../types/file-picker';
import { X } from 'lucide-react';

const sampleFiles: FileItem[] = [
  {
    id: '1',
    name: 'Google Drive',
    type: 'folder',
    email: 'langchain1@gmail.com',
    children: [
      {
        id: '2',
        name: 'test',
        type: 'folder',
        children: [],
      },
      {
        id: '3',
        name: 'Rutadelasedamenu_MARZO_2023.pdf',
        type: 'file',
      },
    ],
  },
];

export default function FilePickerDialog() {
  const [selectedIntegration, setSelectedIntegration] =
    useState('google-drive');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(true);

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size > 0) {
      setSelectedItems(new Set());
    } else {
      const allIds = new Set<string>();
      const addIds = (items: FileItem[]) => {
        items.forEach((item) => {
          allIds.add(item.id);
          if (item.children) {
            addIds(item.children);
          }
        });
      };
      addIds(sampleFiles);
      setSelectedItems(allIds);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-screen-xl p-0">
        <div className="flex h-[32rem]">
          <IntegrationSidebar
            selectedIntegration={selectedIntegration}
            onSelectIntegration={setSelectedIntegration}
            closeButtonContent={
              <DialogClose className="outline-none ring-0">
                <X className="h-5 w-5" />
              </DialogClose>
            }
          />
          <div className="flex-1">
            <DialogHeader className="border-b px-4 py-2">
              <DialogTitle>Integrations</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="h-8"
                    onClick={handleSelectAll}
                  >
                    Select all
                  </Button>
                  <Select defaultValue="name">
                    <SelectTrigger className="h-8 w-[100px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="h-8 w-[100px]">
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="folders">Folders</SelectItem>
                      <SelectItem value="files">Files</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input placeholder="Search..." className="h-8 w-[200px]" />
              </div>
              <FileTree
                items={sampleFiles}
                selectedItems={selectedItems}
                onSelect={handleSelect}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="border-t p-4">
          <div className="flex-1 text-sm text-muted-foreground">
            We recommend selecting as few items as needed.
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>
              Select {selectedItems.size}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
