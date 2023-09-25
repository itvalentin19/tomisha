export const UserType = {
  EMPLOYEE: 1,
  EMPLOYER: 2, // staff of company
  AGENT: 3, // staff of agency
  COMPANY: 4,
  AGENCY: 5,
}

export const TokenType = {
  AUTH_REGISTER: 1,
  AUTH_LOGIN: 2,
  AUTH_RESET_PW: 3,
  COMPANY_VERIFY_EMAIL: 4,
  CHANGE_EMAIL: 5,
}

export const ApplicationStatus = {
  NEW: 1,
  VIEWED: 2,
  ACCEPTED: 3,
  REJECTED: 4,
  WITHDRAWED: 5,
}

export const BranchStatus = {
  ACTIVE: 1,
}

export const CompanyStatus = {
  ACTIVE: 1,
  LOCKED: 2,
  DEACTIVATED: 3,
}

export const ContactStatus = {
  UNREAD: 1,
  READ: 2,
  ACTIVE: 3,
  REJECTED: 4,
  BLOCKED: 5,
}

export const DegreeType = {
  LANGUAGE: 1,
  SCHOOL: 2,
  TRAINING: 3,
}

export const InterviewStatus = {
  NEW: 1,
  VIEWED: 2,
  ACCEPTED: 3,
  REJECTED: 4,
}

export const JobStatus = {
  OPEN: 1,
  CANCELLED: 2,
  DELETED: 3,
}

export const JobLogAction = {
  SEEN: 1,
  YES: 2,
  NO: 3,
  DELETE: 4,
}

export const JobLogColor = {
  [JobLogAction.SEEN]: 'teal-400',
  [JobLogAction.YES]: 'teal-400',
  [JobLogAction.NO]: 'red-400',
  [JobLogAction.DELETE]: 'gray-400',
}

export const ApplicationLogText = {
  default: 'Bewerbung gesendet',
  [JobLogAction.SEEN]: 'Offen',
  [JobLogAction.YES]: 'Bestätigung',
  [JobLogAction.NO]: 'Absage',
  [JobLogAction.DELETE]: 'Bewerbung gelöscht',
}

export const InterviewLogText = {
  default: 'Angebot gesendet',
  [JobLogAction.SEEN]: 'Offen',
  [JobLogAction.YES]: 'Bestätigung',
  [JobLogAction.NO]: 'Absage',
  [JobLogAction.DELETE]: 'Angebot gelöscht',
}

export const OfferLogText = {
  default: 'Angebot gesendet',
  [UserType.EMPLOYEE]: {
    [JobLogAction.SEEN]: 'Offen Arbeitnehmer',
    [JobLogAction.YES]: 'Bestätigung Arbeitnehmer',
    [JobLogAction.NO]: 'Absage Arbeitnehmer',
  },
  [UserType.AGENCY]: {
    [JobLogAction.SEEN]: 'Offen Temporärbüro',
    [JobLogAction.YES]: 'Bestätigung Temporärbüro',
    [JobLogAction.NO]: 'Absage Temporärbüro',
  },
  [UserType.COMPANY]: {
    [JobLogAction.DELETE]: 'Angebot gelöscht',
  },
}

export const NotificationStatus = {
  ACTIVE: 1,
  YES: 2,
  NO: 3,
}

export const NotificationType = {
  COMPLETE_PROFILE: 0,
  WELCOME: 1,
  ADD_FIRST_FRIEND: 2,
  CONTACT_REQUEST: 10,
  REFERENCE_INVITE: 20,
  REFERENCE_VIEW_REQUEST: 21,
  STAFF_INVITE: 30,
  STAFF_INVITE_ACCEPTED: 31,
  COMPANY_JOIN_REQUEST: 40,
  COMPANY_JOIN_REQUEST_ACCEPTED: 41,
  APPLICATION_NEW: 50,
  INTERVIEW_NEW: 60,
  OFFER_NEW: 70,
  SUB_NONE: 80,
  SUB_EXPIRED: 81,
  SUB_EXPIRED_SOON: 82,
}

export const OfferStatus = {
  NEW: 1,
  VIEWED: 2,
  ACCEPTED: 3,
  REJECTED: 4,
  DELETED: 5,
}

export const ReportEntityType = {
  USER: 1,
  OCCUPATION: 2,
  COMPANY: 3,
  BRANCH: 4,
  JOB: 5,
  APPLICATION: 6,
}

export const EmploymentRole = {
  EMPLOYEE: 1,
  HR: 3,
  MAINTAINER: 6,
  ADMIN: 9,
}

export const EmploymentRoleTitle = {
  [EmploymentRole.EMPLOYEE]: 'Employee',
  [EmploymentRole.HR]: 'HR',
  [EmploymentRole.MAINTAINER]: 'Maintainer',
  [EmploymentRole.ADMIN]: 'Admin',
}

export const EmploymentPermission = {
  VIEW_APPLICATION: EmploymentRole.HR,
  MUTATE_JOB: EmploymentRole.HR,
  DELETE_JOB: EmploymentRole.HR,
  BUY_JOBS: EmploymentRole.HR,
  CREATE_INTERVIEW: EmploymentRole.HR,
  HIRE_EMPLOYEE: EmploymentRole.HR,
  CREATE_EMPLOYEE: EmploymentRole.HR,
  DELETE_EMPLOYEE: EmploymentRole.HR,
  CREATE_HR: EmploymentRole.MAINTAINER,
  DELETE_HR: EmploymentRole.MAINTAINER,
  CREATE_BRANCH: EmploymentRole.MAINTAINER,
  DELETE_BRANCH: EmploymentRole.MAINTAINER,
  ASSIGN_BRANCH_OWNER: EmploymentRole.MAINTAINER,
  CREATE_MAINTAINER: EmploymentRole.ADMIN,
  DELETE_MAINTAINER: EmploymentRole.ADMIN,
  CREATE_OWNER: EmploymentRole.ADMIN,
  DEACTIVATE_COMPANY: EmploymentRole.ADMIN,
}

export const TagType = {
  HOBBY: 1,
  HARD_SKILL: 2,
  PROFESSION: 3,
}

export const DocumentGroup = {
  RESIDENCE_PERMIT: 1,
  VEHICLE_REGISTRATION: 2,
}

export const UserGender = {
  MALE: 1,
  FEMALE: 2,
  DIVERS: 3,
  INTERSEXUELL: 4,
  TRANSSEXUELL: 5,
  ANDERS: 6,
  EGAL: 7,
  GESCHLECHTSNEUTRAL: 8,
  ASTERISK: 9,
}

export const UserMaritalStatus = {
  SINGLE: 1,
  MARRIED: 2,
  WIDOWED: 3,
  DIVORCED: 4,
  IN_A_RELATIONSHIP: 5,
  COMPLICATED: 6,
}

export const UserStatus = {
  AVAILABLE_ACTIVELY: 1,
  AVAILABLE_EMPLOYED: 2,
  AVAILABLE_PRIVATELY: 3,
  UNAVAILABLE: 4,
  DEACTIVATED: 5,
  LOCKED: 6,
}

export const UserStatusColor = {
  [UserStatus.AVAILABLE_ACTIVELY]: 'teal-400',
  [UserStatus.AVAILABLE_EMPLOYED]: 'yellow-400',
  [UserStatus.AVAILABLE_PRIVATELY]: 'orange-400',
  [UserStatus.UNAVAILABLE]: 'red-400',
  [UserStatus.DEACTIVATED]: 'gray-400',
  [UserStatus.LOCKED]: 'gray-900',
}

export const JobRelationship = {
  APPRENTICESHIP: 1,
  INTERNSHIP: 2,
  PREMANENT: 3,
  TEMPORARY: 4,
  TRIAL: 5,
}

export const EmailAdType = {
  NEW_JOB: 1,
  CONTACT_INVITATION: 2,
}

export const SupportStatus = {
  NEW: 1,
  SEEN: 2,
  APPROVED: 3,
  REJECTED: 4,
}

export const ReportStatus = {
  NEW: 1,
  SEEN: 2,
  APPROVED: 3,
  REJECTED: 4,
}
