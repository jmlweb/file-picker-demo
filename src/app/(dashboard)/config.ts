
export const INTEGRATION_NAMES = {
  files: 'files',
  websites: 'websites',
  text: 'text',
  confluence: 'confluence',
  notion: 'notion',
  'google-drive': 'google-drive',
  onedrive: 'onedrive',
  slack: 'slack',
} as const;

export const INTEGRATIONS = Object.values(INTEGRATION_NAMES);

export type IntegrationName = (typeof INTEGRATION_NAMES)[keyof typeof INTEGRATION_NAMES];