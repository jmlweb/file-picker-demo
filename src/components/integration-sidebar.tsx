import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Files, Globe, Type, Database, BookOpen, Cloud, HardDriveIcon as OneDrive, Share2, Slack } from "lucide-react"
import type { Integration } from "../types/file-picker"

const integrations: Integration[] = [
  { id: "files", name: "Files", icon: "Files", count: 4 },
  { id: "websites", name: "Websites", icon: "Globe" },
  { id: "text", name: "Text", icon: "Type" },
  { id: "confluence", name: "Confluence", icon: "Database" },
  { id: "notion", name: "Notion", icon: "BookOpen" },
  { id: "google-drive", name: "Google Drive", icon: "Cloud", beta: true },
  { id: "onedrive", name: "OneDrive", icon: "OneDrive" },
  { id: "sharepoint", name: "SharePoint", icon: "Share2" },
  { id: "slack", name: "Slack", icon: "Slack" },
]

const iconMap = {
  Files,
  Globe,
  Type,
  Database,
  BookOpen,
  Cloud,
  OneDrive,
  Share2,
  Slack,
}

interface IntegrationSidebarProps {
  selectedIntegration: string
  onSelectIntegration: (id: string) => void
  closeButtonContent: React.ReactNode
}

export function IntegrationSidebar({ selectedIntegration, onSelectIntegration, closeButtonContent }: IntegrationSidebarProps) {
  return (
    <div className="w-60 border-r">
      <div className="p-4 border-b flex items-center gap-2">
        {closeButtonContent} <h2 className="font-bold text-foreground">Integrations</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="p-2">
          {integrations.map((integration) => {
            const Icon = iconMap[integration.icon as keyof typeof iconMap]
            return (
              <Button
                key={integration.id}
                variant={selectedIntegration === integration.id ? "secondary" : "ghost"}
                className="w-full justify-start gap-2 mb-1"
                onClick={() => onSelectIntegration(integration.id)}
              >
                <Icon className="h-4 w-4" />
                <span>{integration.name}</span>
                {integration.count && (
                  <span className="ml-auto text-xs text-muted-foreground">{integration.count}</span>
                )}
                {integration.beta && <span className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded-md">Beta</span>}
              </Button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

