export interface IDesign {
    type: string;
    name: string;
    project: string;
    structure: string;
    storage: [IStorage];
    version?: string;
    tm?: tm;
  }

  export interface IStorage {
    provider: string; //constructn-oss
    path?: string;
    pathId?: string;
    format: string;
    providerType: string; //internal or external
  };

  export interface tm {
    tm: [number];
    offset: [number];
  };

