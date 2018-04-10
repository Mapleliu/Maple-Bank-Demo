// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  version: '(dev)',
  serverUrl: 'http://{API_SERVER_IP}:{API_SERVER_PORT}/blockchain',
  defaultLanguage: 'en-US',
  BANK_LIST: 'http://10.19.93.150:4100/app/mock-data/banklist.json',
  supportedLanguages: [
    'en-US',
    'zh-CN'
  ]
};
