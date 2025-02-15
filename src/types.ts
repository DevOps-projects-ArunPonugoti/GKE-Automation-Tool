import { GCP_REGIONS, GCP_ZONES, ENVIRONMENTS, MACHINE_TYPES, NETWORK_TIERS } from './config/constants';

export type Region = typeof GCP_REGIONS[number];
export type Zone = typeof GCP_ZONES[number];
export type Environment = typeof ENVIRONMENTS[number];
export type MachineType = typeof MACHINE_TYPES[number];
export type NetworkTier = typeof NETWORK_TIERS[number];

export interface InfraFormData {
  projectName: string;
  projectId: string;
  region: Region;
  zone: Zone;
  environment: Environment;
  machineType: MachineType;
  networkTier: NetworkTier;
}