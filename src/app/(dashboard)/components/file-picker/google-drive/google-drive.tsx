import FilePickerSectionLayout from "../file-picker-section-layout";

import { INTEGRATIONS_INFO } from "../file-picker-sidebar";

const { name, icon } = INTEGRATIONS_INFO['google-drive'];

export default function FilePickerGoogleDrive() {
  return (
    <FilePickerSectionLayout title={name} icon={icon} footer={<div>Google Drive</div>}>
      <div>Google Drive</div>
    </FilePickerSectionLayout>
  )
}