import { IPagination } from "./class.type";

// CreatedBy type
export interface CreatedBy {
  _id: string;
}

// Target Group type
export interface TargetGroup {
  _id: string;
  name: string;
}

// Resource type
export interface Resource {
  _id: string;
  createdBy: CreatedBy;
  title: string;
  type: string; // e.g. "PDF"
  contentUrl: string;
  targeteAudience: string; // e.g. "STUDENT"
  targertGroup: TargetGroup;
  markAsAssigned: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}



// Inner data wrapper
export interface ResourcesData {
  resources: Resource[];
  pagination: IPagination;
}

// Main API response
export interface IResourcesResponse {
  success: boolean;
  message: string;
  data: ResourcesData;
  targertGroup: string;
}