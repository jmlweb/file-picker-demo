import { DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  BookOpen,
  Cloud,
  Database,
  Files,
  Globe,
  HardDriveIcon,
  Share2,
  Slack,
  Type,
  X,
} from 'lucide-react';
import { IntegrationName, INTEGRATIONS } from '../../config';
import { Button } from '@/components/ui/button';
import { cva } from 'class-variance-authority';
import { useCurrentIntegrationStore } from '../../store';

export const INTEGRATIONS_INFO: Record<
  IntegrationName,
  {
    name: string;
    icon: React.ElementType;
    count?: number;
  }
> = {
  files: {
    name: 'Files',
    icon: Files,
    count: 4,
  },
  websites: {
    name: 'Websites',
    icon: Globe,
  },
  text: {
    name: 'Text',
    icon: Type,
  },
  confluence: {
    name: 'Confluence',
    icon: Database,
  },
  notion: {
    name: 'Notion',
    icon: BookOpen,
  },
  'google-drive': {
    name: 'Google Drive',
    icon: Cloud,
  },
  onedrive: {
    name: 'OneDrive',
    icon: HardDriveIcon,
  },
  sharepoint: {
    name: 'SharePoint',
    icon: Share2,
  },
  slack: {
    name: 'Slack',
    icon: Slack,
  },
};

const buttonStyle = cva('w-full justify-start gap-2', {
  variants: {
    selected: {
      true: 'bg-foreground/10',
    },
  },
});

function FilePickerSidebarButton({
  integration,
}: {
  integration: IntegrationName;
}) {
  const integrationInfo = INTEGRATIONS_INFO[integration];
  const Icon = integrationInfo.icon;
  const isCurrentIntegration = useCurrentIntegrationStore(
    (state) => state.currentIntegration === integration,
  );
  const setCurrentIntegration = useCurrentIntegrationStore(
    (state) => state.setCurrentIntegration,
  );
  return (
    <Button
      variant="ghost"
      className={buttonStyle({ selected: isCurrentIntegration })}
      onClick={() => setCurrentIntegration(integration)}
    >
      <Icon className="h-5 w-5" />
      {integrationInfo.name}
    </Button>
  );
}

export default function FilePickerSidebar() {
  return (
    <aside className="w-60 border-r border-foreground/10 bg-foreground/[0.02]">
      <div className="flex items-center justify-start gap-2 border-b border-foreground/10 px-4 py-3 font-bold">
        <DialogClose className="outline-none ring-0">
          <X className="-mr-1 h-5 w-5" />
        </DialogClose>
        Integrations
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <ul className="p-2 flex flex-col">
          {INTEGRATIONS.map((integration) => (
            <FilePickerSidebarButton
              key={integration}
              integration={integration}
            />
          ))}
        </ul>
      </ScrollArea>
    </aside>
  );
}
