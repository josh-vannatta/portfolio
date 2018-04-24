export class ProjectNode {
  public id: number;
  constructor (
    public project_id: number,
    public type: string,
    public title: string,
    public content: string,
    public image: boolean,
    public code: any
  ){}
}
