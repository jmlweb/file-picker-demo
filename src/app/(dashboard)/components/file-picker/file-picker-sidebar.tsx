import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cva } from 'class-variance-authority';
import { Files, Globe, Type, X } from 'lucide-react';
import { IntegrationName, INTEGRATIONS } from '../../config';
import { useCurrentIntegrationStore } from '../../store';
import Image from 'next/image';
import { createElement } from 'react';

const buttonStyle = cva('w-full justify-start gap-2', {
  variants: {
    selected: {
      true: 'bg-foreground/10',
    },
  },
});

export const INTEGRATIONS_INFO: Record<
  IntegrationName,
  {
    name: string;
    count?: number;
  } & (
    | {
        icon: React.ElementType;
        img?: undefined;
      }
    | {
        icon?: undefined;
        img: string;
      }
  )
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
    img: '/logos/confluence.svg',
  },
  notion: {
    name: 'Notion',
    img: '/logos/notion.svg',
  },
  'google-drive': {
    name: 'Google Drive',
    img: '/logos/google-drive.svg',
  },
  onedrive: {
    name: 'OneDrive',
    img: '/logos/onedrive.svg',
  },
  slack: {
    name: 'Slack',
    img: '/logos/slack.svg',
  },
};

function FilePickerSidebarButton({
  integration,
}: {
  integration: IntegrationName;
}) {
  const integrationInfo = INTEGRATIONS_INFO[integration];
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
      {integrationInfo.icon ? (
        createElement(integrationInfo.icon, { size: 20 })
      ) : (
        <Image src={integrationInfo.img} alt="" width={20} height={20} className="w-5 h-5" />
      )}
      <span className="hidden md:block">{integrationInfo.name}</span>
    </Button>
  );
}

export default function FilePickerSidebar() {
  return (
    <aside className="border-r border-foreground/10 bg-foreground/[0.02] md:w-60">
      <div className="flex items-center justify-start gap-2 border-b border-foreground/10 px-4 py-3 font-bold">
        <DialogClose className="outline-none ring-0">
          <X className="-mr-1 h-5 w-5" />
        </DialogClose>
        Integrations
      </div>
      <ScrollArea className="h-14 md:h-[calc(100vh-10rem)]">
        <ul className="flex min-w-[420px] p-2 md:flex-col">
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
