import { IPagination } from "./class.type";

// UserGroup type
 interface UserGroup {
  _id: string;
  name: string;
}

// UserGroupTrack type
interface IUserGroupTrack {
  _id: string;
  name: string;
}

// Student type
export interface IStudent {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  role: string; // e.g., "STUDENT"
  email: string;
  profile?: string;
  mobileNumber?: string;
  tradeLicences?: string;
  proofOwnerId?: string;
  sallonPhoto?: string;
  isUpdate: boolean;
  verified: boolean;
  discount?: number;
  about?: string;
  isSubscribed?: boolean;
  mentorId?: string;
  address?: string;
  classId?: string;
  readBooks?: string;
  careerDirections: any[]; // can be more specific if known
  woopGoals: any[];        // can be more specific if known
  assignedStudents: any[]; // can be more specific if known
  userGroup?: UserGroup[];
  userGroupTrack?: IUserGroupTrack;
  createdAt: string;
  updatedAt: string;
  __v: number;
}



// Main API response type
export interface IMyStudentsResponse {
  success: boolean;
  message: string;
  pagination: IPagination; 
  userGroup:string;
  data: IStudent[];
}