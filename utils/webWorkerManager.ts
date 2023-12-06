 interface workerObj{
  [key:string]:Worker
 }
 export class WebWorkerManager {
    private static instance: WebWorkerManager;
    private workers:workerObj  = {};
  
    private constructor() {
      // Private constructor to prevent external instantiation.
    }
  
    public static getInstance(): WebWorkerManager {
      if (!WebWorkerManager.instance) {
        WebWorkerManager.instance = new WebWorkerManager();
      }
      return WebWorkerManager.instance;
    }
  
    public createWorker(name: string, worker:Worker)  {
      if (this.workers[name]) {
        throw new Error(`Worker '${name}' already exists.`);
      }
      this.workers[name] = worker;
      return worker;
    }
  
    public getWorker(){
      return this.workers;
    }
    public removeWorker(captureId:string)
    {
          delete this.workers[captureId]
          console.log('this',this.workers)
          return this.workers
    }
  }
  