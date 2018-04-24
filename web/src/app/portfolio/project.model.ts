import { ServiceOffered } from '@shared/service/service-offered.model';
import { Skill } from '@shared/skill/skill.model';

export class Project {
  public id: number;
  constructor (
    public client: string,
    public title: string,
    public introduction: string,
    public site_url: string,
    public services: ServiceOffered[],
    public skills: Skill[],
  ){}
}
