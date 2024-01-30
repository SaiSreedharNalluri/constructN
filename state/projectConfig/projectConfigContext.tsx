// contexts/ApiDataContext.tsx
import React, { createContext, useContext, ReactNode, useState } from 'react';

interface ProjectConfigContextProps {
  initialTypes: any;
  initialPriority: any;
  initialStatus: any;
  issueTagsList : any;
  initialProjectUsersList: any;
  taskinitialTypes: any;
  taskinitialPriority: any;
  taskinitialStatus: any;
  taskTagsList:any;

}

const projectConfigContext = createContext<ProjectConfigContextProps | undefined>(undefined);

interface ProjectConfigContextProviderProps {
  children: ReactNode;
  initialTypes: any;
  initialPriority: any;
  initialStatus: any;
  initialProjectUsersList: any;
  taskinitialTypes: any;
  taskinitialPriority: any;
  taskinitialStatus: any;
  issueTagsList : any;
  taskTagsList : any;
}

export const ApiDataContextProvider: React.FC<ProjectConfigContextProviderProps> = ({
  children,
  initialTypes,
  initialPriority,
  initialStatus,
  initialProjectUsersList,
  taskinitialTypes,
  taskinitialPriority,
  taskinitialStatus,
  issueTagsList,
  taskTagsList
}) => {

  return (
    <projectConfigContext.Provider value={{ initialTypes, 
      initialPriority, 
      initialStatus, 
      initialProjectUsersList,
      taskinitialTypes,
      taskinitialPriority,
      taskinitialStatus, 
      issueTagsList,
      taskTagsList
      }}>
      {children}
    </projectConfigContext.Provider>
  );
};

export const useApiDataContext = () => {
  const context = useContext(projectConfigContext);
  
  
  if (!context) {
    throw new Error('useApiDataContext must be used within an ApiDataContextProvider');
  }
  return context;
};
