export interface IUserNotification {
  map(arg0: (obj: any) => JSX.Element): import("react").ReactNode;
        _id:  string,
        title: string,
        message: string,
        type: string,
        actionType: string,
        configuration: NotificationConfiguration,
        category: string  // "User", "Project" , "Struct", "Task" , "Snapshot" , "Job" , "Issue", "Comment, "Tag"
        users: [NotifiersSchema],
        createdAt:string,
        updatedAt:string,
}
export interface NotificationConfiguration
  {
      project: string,
      structure: string,
      snapshot: string,
      task: string,
      issue: string,
      comment: string,
      tag: string
  }
export interface NotifiersSchema  {
  user: {
      type: string,
      required: true
  },
  read: string
}