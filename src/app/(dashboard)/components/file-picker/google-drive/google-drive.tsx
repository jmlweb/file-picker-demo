import FilePickerSectionLayout from '../file-picker-section-layout';

import Image from 'next/image';
import { INTEGRATIONS_INFO } from '../file-picker-sidebar';
import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import useRootResources from './use-root-resources';
import { ComponentPropsWithoutRef } from 'react';
import { ExternalLink } from 'lucide-react';

const { name, icon } = INTEGRATIONS_INFO['google-drive'];

const getResourceIcon = (type: string, fileName?: string) => {
  if (type === 'directory') {
    return 'directory';
  }
  const extension = fileName?.split('.').pop();
  if (extension) {
    return ['mp4'].includes(extension) ? 'video' : extension;
  }
  return 'file';
};

const ResourceLink = ({
  href,
  children,
  ...rest
}: ComponentPropsWithoutRef<'a'>) => {
  if (!href) {
    return <span {...rest}>{children}</span>;
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}{' '}
      <ExternalLink className="h-4 w-4 text-foreground/50 group-hover:text-current" />
    </a>
  );
};

export default function FilePickerGoogleDrive() {
  const { data, error } = useRootResources();
  return (
    <FilePickerSectionLayout
      title={name}
      icon={icon}
      footer={<div>Google Drive</div>}
    >
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}
      {!data && !error && <div>Loading...</div>}
      {data && !error && (
        <div className="flex flex-col gap-2">
          {data.map((resource) => (
            <div key={resource.resource_id} className="flex items-center gap-3">
              <ResourceLink
                href={resource.dataloader_metadata.path}
                className="group flex max-w-full items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-foreground/85"
              >
                <Image
                  src={`/file-types/${getResourceIcon(resource.inode_type, resource.inode_path.path)}.svg`}
                  alt={
                    resource.dataloader_metadata.path ??
                    resource.inode_path.path
                  }
                  width={20}
                  height={20}
                />
                {resource.dataloader_metadata.path ?? resource.inode_path.path}
              </ResourceLink>
              {resource.dataloader_metadata.created_by && (
                <p className="hidden truncate text-sm text-muted-foreground md:block">
                  {resource.dataloader_metadata.created_by}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </FilePickerSectionLayout>
  );
}
