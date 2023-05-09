import { IContext } from "./ITools";

export interface ITasks {
  title: 'string';
  type: 'string';
  description: string;
  status: 'string';
  priority: 'string';
  screenshot: 'string';
  assignees: [
    { _id: string; firstName: string; lastName: string; email: string }
  ];
  owner: 'string';
  project: 'string';
  structure: 'string';
  progress: 0;
  tags: ['string'];
  attachments: [
    {
      name: 'string';
      url: 'string';
      entity: 'string';
    }
  ];
  sequenceNumber?: number;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  dueDate: string;
  context?: IContext;
  _id: string;
  __v: 0;
}