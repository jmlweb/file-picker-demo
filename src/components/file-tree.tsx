import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronRight, File, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FileItem } from '../types/file-picker';

interface FileTreeProps {
  items: FileItem[];
  selectedItems: Set<string>;
  onSelect: (id: string) => void;
}

export function FileTree({ items, selectedItems, onSelect }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
  };

  const renderItem = (item: FileItem) => {
    const isFolder = item.type === 'folder';
    const isExpanded = expandedFolders.has(item.id);
    const isSelected = selectedItems.has(item.id);

    return (
      <div key={item.id}>
        <div className="group flex items-center rounded-md px-2 py-1 hover:bg-muted/50">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(item.id)}
            className="mr-2"
          />
          {isFolder && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-1 h-4 w-4 p-0"
              onClick={() => toggleFolder(item.id)}
            >
              <ChevronRight
                className={cn('h-3 w-3 transition-transform', {
                  'rotate-90 transform': isExpanded,
                })}
              />
            </Button>
          )}
          {isFolder ? (
            <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
          ) : (
            <File className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span className="flex-1">{item.name}</span>
          {!isFolder && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100"
            >
              Import
            </Button>
          )}
        </div>
        {isFolder && isExpanded && item.children && (
          <div className="ml-6">
            {item.children.map((child) => renderItem(child))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">{items.map((item) => renderItem(item))}</div>
  );
}
