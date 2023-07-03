import { AppTablePartialHeader } from '@/types/tableheaders'
import { VuetifyThemeItem } from 'vuetify/types/services/theme'
import { FileFilterType, FileRoot } from '../files/types'
import { numberInputToObject } from '@ctrl/tinycolor';

export interface ConfigState {
  [key: string]: any;
  apiUrl: string;
  socketUrl: string;
  layoutMode: boolean;
  containerColumnCount: number;
  instances: InstanceConfig[];
  uiSettings: UiSettings;
  hostConfig: HostConfig;
}

export interface UiSettings {
  general: GeneralConfig;
  theme: ThemeConfig;
  editor: EditorConfig;
  dashboard: DashboardConfig;
  tableHeaders: AppTableConfiguredHeaders;
  gcodePreview: GcodePreviewConfig;
  fileSystem: FileSystemConfig;
  toolhead: ToolheadConfig;
  setup: SetupConfig;
  results: Experiment;
  history: HistoryEntry[];

}

export interface HistoryEntry{
  experiment: Experiment;
  setup: SetupPresets;
  date: string;
  id: string;
}

export interface SetupConfig {
  technologistValues: string[];
  recipientValues: string[];
  sourceCodeValues: string[];
  matrixTypeValues: string[];
  setupPresets: SetupPresets[];
  currentSetup: SetupPresets;
  mode: Number;
}

export interface Experiment{
  [x: string]: ExperimentEntry[];
}

export interface ExperimentEntry{
  [x: string]: any;
}

export interface RadiometerEntry {
  // V: number;
  // A: number;
  // a: number;
  // date: string;
  // tablet: number;

  [x: string]: any,
}


export interface SetupPresets {
  id: any;
  name: string;
  sourceCode: string;
  numberTP: string;
  radionuclide: string;
  radionuclideActivity: string;
  sourceStart: number;
  sourceNumber: number;
  recipient: string;
  technologist: string;
  notes: string;
  matrix: string;
  targetActivity: number;
  refFirstActivity: number;
  refFirstDate: string;
  refSecondActivity: number;
  refSecondDate: string;
  radioactiveNumber: string;
  initialActivity: number;
  initialVolume: number;
  accessories: Accessory [];
}

export interface Accessory {
  id: string;
  number: number;
  date: string;

}

export interface ToolheadConfig {
  forceMove: boolean;
  extrudeSpeed: number;
  extrudeLength: number;
}

export interface HostConfig {
  endpoints: string[];
  blacklist: string[];
  hosted: boolean;
  themePresets: SupportedTheme[];
}

export interface SupportedLocale {
  name: string;
  code: string;
}

export interface GeneralConfig {
  instanceName: string;
  locale: string;
  chartVisible: boolean;
  hideTempWaits: boolean;
  axis: Axis;
  defaultExtrudeLength: number;
  defaultExtrudeSpeed: number;
  defaultToolheadMoveLength: number;
  defaultToolheadXYSpeed: number;
  defaultToolheadZSpeed: number;
  toolheadMoveDistances: number[];
  useGcodeCoords: boolean;
  zAdjustDistances: number[];
  enableVersionNotifications: boolean;
  confirmOnEstop: boolean;
  confirmOnPowerDeviceChange: boolean;
  confirmOnSaveConfigAndRestart: boolean;
  dateFormat: string;
  timeFormat: string;
  textSortOrder: TextSortOrder;
  showRateOfChange: boolean;
  showRelativeHumidity: boolean;
  showBarometricPressure: boolean;
  showGasResistance: boolean;
  showSaveConfigAndRestart: boolean;
  showUploadAndPrint: boolean;
  flipConsoleLayout: boolean;
  cameraFullscreenAction: CameraFullscreenAction;
  topNavPowerToggle: null | string;
  showManualProbeDialogAutomatically: boolean;
  showBedScrewsAdjustDialogAutomatically: boolean;
  forceMoveToggleWarning: boolean;
  enableDiagnostics: boolean;
  thumbnailSize: number;
}

export type TextSortOrder = 'default' | 'numeric-prefix' | 'version'

export type CameraFullscreenAction = 'embed' | 'rawstream';

// Config stored in moonraker db
export interface ThemeConfig {
  currentTheme: {[index: string]: string | Partial<VuetifyThemeItem> | undefined }; // the color list.
  isDark: boolean; // inidicates if the theme as a whole is dark or not.
  logo: SupportedThemeLogo; // Current logo to use.
}

// Config defined in host
export interface SupportedTheme {
  name: string;
  logo: SupportedThemeLogo;
  color: string;
  isDark: boolean;
}

export interface SupportedThemeLogo {
  src: string;
  dynamic: boolean;
  dark?: string;
  light?: string;
}

export interface EditorConfig {
  confirmDirtyEditorClose: boolean;
  autoEditExtensions: string[];
  codeLens: boolean;
}

export interface Axis {
  [key: string]: AxisConfig;
}

export interface AxisConfig {
  inverted: boolean;
}

export interface DashboardConfig {
  tempPresets: TemperaturePreset[];
}

export interface SaveByPath {
  path: string;
  value: string | boolean | number;
  server?: boolean;
}

export interface InitConfig {
  apiConfig: ApiConfig | InstanceConfig;
  hostConfig?: HostConfig;
  apiConnected?: boolean;
  apiAuthenticated?: boolean;
}

export interface ApiConfig {
  apiUrl: string;
  socketUrl: string;
}

// Saved to localstorage.
export interface InstanceConfig extends ApiConfig {
  name: string;
  active: boolean;
}

export interface TemperaturePreset {
  id: number;
  name: string;
  values: TemperaturePresetValues;
  gcode?: string;
}

export interface TemperaturePresetValues {
  [key: string]: TemperaturePresetValue;
}

export interface TemperaturePresetValue {
  value: number;
  type: 'fan' | 'heater';
  active: boolean;
}

export interface AppTableConfiguredHeaders {
  [root: string]: AppTablePartialHeader[];
}

export interface GcodePreviewConfig {
  extrusionLineWidth: number;
  moveLineWidth: number;
  retractionIconSize: number;
  drawBackground: boolean;
  showAnimations: boolean;
  minLayerHeight: number;
  autoLoadOnPrintStart: boolean;
  autoLoadMobileOnPrintStart: boolean;
  autoFollowOnFileLoad: boolean;
  autoZoom: boolean;
  flip: {
    horizontal: boolean;
    vertical: boolean;
  };
}

export interface FileSystemConfig {
  activeFilters: Partial<Record<FileRoot, FileFilterType[]>>
}
