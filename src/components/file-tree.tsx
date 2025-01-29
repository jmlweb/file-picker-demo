import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronRight, File, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import type { FileItem } from "../types/file-picker"

interface FileTreeProps {
  items: FileItem[]
  selectedItems: Set<string>
  onSelect: (id: string) => void
}

export function FileTree({ items, selectedItems, onSelect }: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedFolders(newExpanded)
  }

  const renderItem = (item: FileItem) => {
    const isFolder = item.type === "folder"
    const isExpanded = expandedFolders.has(item.id)
    const isSelected = selectedItems.has(item.id)

    return (
      <div key={item.id}>
        <div className="flex items-center py-1 px-2 hover:bg-muted/50 rounded-md group">
          <Checkbox checked={isSelected} onCheckedChange={() => onSelect(item.id)} className="mr-2" />
          {isFolder && (
            <Button variant="ghost" size="icon" className="h-4 w-4 p-0 mr-1" onClick={() => toggleFolder(item.id)}>
              <ChevronRight
                className={cn("h-3 w-3 transition-transform", {
                  "transform rotate-90": isExpanded,
                })}
              />
            </Button>
          )}
          {isFolder ? (
            <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
          ) : (
            <File className="h-4 w-4 mr-2 text-muted-foreground" />
          )}
          <span className="flex-1">{item.name}</span>
          {!isFolder && (
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100">
              Import
            </Button>
          )}
        </div>
        {isFolder && isExpanded && item.children && (
          <div className="ml-6">{item.children.map((child) => renderItem(child))}</div>
        )}
      </div>
    )
  }

  return <div className="space-y-1">{items.map((item) => renderItem(item))}</div>
}

