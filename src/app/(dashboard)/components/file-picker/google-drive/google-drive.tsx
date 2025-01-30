import { Folder, File } from 'lucide-react';
import FilePickerSectionLayout from '../file-picker-section-layout';

import { INTEGRATIONS_INFO } from '../file-picker-sidebar';
import useRootResources from './use-root-resources';

const { name, icon } = INTEGRATIONS_INFO['google-drive'];

export default function FilePickerGoogleDrive() {
  const { data, error } = useRootResources();
  console.log(data);
  return (
    <FilePickerSectionLayout
      title={name}
      icon={icon}
      footer={<div>Google Drive</div>}
    >
      {error && <div>Error: {error.message}</div>}
      {!data && <div>Loading...</div>}
      {data && (
        <div className="flex flex-col gap-2">
          {data.map((resource) => (
            <div key={resource.resource_id}>
              {resource.inode_type === 'directory' ? <Folder /> : <File />}
              {resource.dataloader_metadata.path ?? resource.inode_path.path}
            </div>
          ))}
        </div>
      )}
    </FilePickerSectionLayout>
  );
}
