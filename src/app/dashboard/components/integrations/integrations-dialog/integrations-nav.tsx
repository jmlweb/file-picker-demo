import { Button } from '@/components/ui/button';
import { cva } from 'class-variance-authority';
import { Files, Globe, Type } from 'lucide-react';
import Image from 'next/image';
import { createElement } from 'react';
import { IntegrationName, INTEGRATIONS } from '../../../config';
import { useCurrentIntegrationStore } from '../../../store';

const buttonStyle = cva(
  'w-full justify-start gap-2 text-foreground/70 hover:text-foreground transition-colors',
  {
    variants: {
      selected: {
        true: 'bg-foreground/10',
      },
    },
  },
);

export const INTEGRATIONS_INFO: Record<
  IntegrationName,
  {
    name: string;
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

function NavButton({ integration }: { integration: IntegrationName }) {
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
        <Image
          src={integrationInfo.img}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
        />
      )}
      <span className="hidden md:block">{integrationInfo.name}</span>
    </Button>
  );
}

export default function IntegrationsNav() {
  return (
    <ul className="flex w-max p-2 md:w-full md:flex-col">
      {INTEGRATIONS.map((integration) => (
        <li key={integration}>
          <NavButton integration={integration} />
        </li>
      ))}
    </ul>
  );
}
