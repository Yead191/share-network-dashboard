import { IUserGroup, IUserGroupTrack } from "./userGroup.types";

export interface IStudent {
  _id: string;
  role: "STUDENT" | string;
  email: string;
  name: string;
}

export interface IAssignmentBasicInfo {
  _id: string;
  title: string;
  description: string;
}

export interface ISubmitAssignment {
  _id: string;
  assignmentId: IAssignmentBasicInfo;
  studentId: IStudent;
  fileAssignment: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IAssignment {
  _id: string;
  teacher: string;
  title: string;
  published: boolean;
  description: string;
  userGroup: IUserGroup[];
  userGroupTrack: IUserGroupTrack;
  dueDate: string;
  totalPoint: number;
  attachment: string;
  status: "COMPLETED" | "PENDING" | "DRAFT" | string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  submitAssignment: ISubmitAssignment[];
  studentAssigned?: any[];
}




// ===== Meta =====
export interface IMeta {
  total: number;
  totalPage: number;
  page: number;
  limit: number;
}

// ===== Assignment Info (Populated) =====
export interface IAssignmentInfo {
  _id: string;
  title: string;
  description: string;
  dueDate: string; // or Date
  totalPoint: number;
  attachment: string;
  status: "PENDING" | "COMPLETED" | "DRAFT" | string;
}

// ===== Student Info (Populated) =====
export interface IStudentInfo {
  _id: string;
  role: "STUDENT" | "TEACHER" | "ADMIN" | string;
  email: string;
  name: string;
  profile: string;
}

// ===== Submitted Assignment =====
export interface ISubmittedAssignment {
  _id: string;
  assignmentId: IAssignmentInfo;
  studentId: IStudentInfo;
  fileAssignment: string;
  createdAt: string; // or Date
  updatedAt: string; // or Date
  marks: number;
  feedback: string;
  __v: number;
}

// ===== Data Wrapper =====
export interface ISubmittedAssignmentData {
  meta: IMeta;
  data: ISubmittedAssignment[];
}

// ===== Final API Response =====
export interface ISubmittedAssignmentResponse {
  success: boolean;
  message: string;
  data: ISubmittedAssignmentData;
}