'use client';

import { ResourceManager, type ResourceColumn, type ResourceField } from '@/components/dashboard/ResourceManager';

interface ResourceConfiguration {
  title: string;
  endpoint: string;
  fields: ResourceField[];
  columns: ResourceColumn[];
  readOnly?: boolean;
}

const statusOptions = (values: string[]) =>
  values.map((value) => ({ value, label: value.replaceAll('_', ' ') }));

const configurations: Record<string, ResourceConfiguration> = {
  courses: {
    title: 'Courses',
    endpoint: '/courses',
    fields: [
      { key: 'code', label: 'Course code', required: true },
      { key: 'title', label: 'Title', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'departmentId', label: 'Department ID', type: 'number' },
      { key: 'creditHours', label: 'Credit hours', type: 'number', required: true },
      { key: 'level', label: 'Level', type: 'number', required: true },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions(['active', 'inactive']) },
    ],
    columns: [
      { key: 'code', label: 'Code' },
      { key: 'title', label: 'Course' },
      { key: 'departmentId', label: 'Department' },
      { key: 'creditHours', label: 'Credits' },
      { key: 'status', label: 'Status' },
    ],
  },
  sections: {
    title: 'Course sections',
    endpoint: '/course-sections',
    fields: [
      { key: 'courseId', label: 'Course ID', type: 'number', required: true },
      { key: 'semesterId', label: 'Semester ID', type: 'number', required: true },
      { key: 'teacherId', label: 'Teacher ID', type: 'number' },
      { key: 'sectionName', label: 'Section name', required: true },
      { key: 'room', label: 'Room' },
      { key: 'dayOfWeek', label: 'Day', type: 'select', options: statusOptions(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) },
      { key: 'startTime', label: 'Start time', type: 'text' },
      { key: 'endTime', label: 'End time', type: 'text' },
      { key: 'capacity', label: 'Capacity', type: 'number', required: true },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions(['open', 'closed', 'cancelled']) },
    ],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'courseId', label: 'Course' },
      { key: 'sectionName', label: 'Section' },
      { key: 'teacherId', label: 'Teacher' },
      { key: 'dayOfWeek', label: 'Day' },
      { key: 'room', label: 'Room' },
      { key: 'status', label: 'Status' },
    ],
  },
  students: {
    title: 'Students',
    endpoint: '/students',
    fields: [
      { key: 'userId', label: 'User ID', type: 'number', required: true },
      { key: 'studentCode', label: 'Student code', required: true },
      { key: 'departmentId', label: 'Department ID', type: 'number' },
      { key: 'dateOfBirth', label: 'Date of birth', type: 'date' },
      { key: 'gender', label: 'Gender', type: 'select', options: statusOptions(['male', 'female', 'other']) },
      { key: 'address', label: 'Address' },
      { key: 'guardianName', label: 'Guardian name' },
      { key: 'guardianPhone', label: 'Guardian phone' },
      { key: 'admissionDate', label: 'Admission date', type: 'date' },
      { key: 'currentSemester', label: 'Current semester', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions(['active', 'graduated', 'withdrawn', 'suspended']) },
    ],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'studentCode', label: 'Student code' },
      { key: 'userId', label: 'User' },
      { key: 'departmentId', label: 'Department' },
      { key: 'currentSemester', label: 'Semester' },
      { key: 'status', label: 'Status' },
    ],
  },
  teachers: {
    title: 'Teachers',
    endpoint: '/teachers',
    fields: [
      { key: 'userId', label: 'User ID', type: 'number', required: true },
      { key: 'teacherCode', label: 'Teacher code', required: true },
      { key: 'departmentId', label: 'Department ID', type: 'number' },
      { key: 'qualification', label: 'Qualification' },
      { key: 'specialization', label: 'Specialization' },
      { key: 'hireDate', label: 'Hire date', type: 'date' },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions(['active', 'inactive']) },
    ],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'teacherCode', label: 'Teacher code' },
      { key: 'userId', label: 'User' },
      { key: 'departmentId', label: 'Department' },
      { key: 'specialization', label: 'Specialization' },
      { key: 'status', label: 'Status' },
    ],
  },
  enrollments: {
    title: 'Enrollments',
    endpoint: '/enrollments',
    fields: [
      { key: 'studentId', label: 'Student ID', type: 'number', required: true },
      { key: 'courseSectionId', label: 'Course section ID', type: 'number', required: true },
      { key: 'semesterId', label: 'Semester ID', type: 'number', required: true },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions(['pending', 'approved', 'rejected', 'dropped', 'completed']) },
    ],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'studentId', label: 'Student' },
      { key: 'courseSectionId', label: 'Section' },
      { key: 'semesterId', label: 'Semester' },
      { key: 'enrolledAt', label: 'Enrolled' },
      { key: 'status', label: 'Status' },
    ],
  },
  announcements: {
    title: 'Announcements',
    endpoint: '/announcements',
    fields: [
      { key: 'title', label: 'Title', required: true },
      { key: 'content', label: 'Message', type: 'textarea', required: true },
      { key: 'audience', label: 'Audience', type: 'select', options: statusOptions(['all', 'students', 'teachers', 'admins', 'department', 'course']) },
      { key: 'departmentId', label: 'Department ID', type: 'number' },
      { key: 'courseSectionId', label: 'Course section ID', type: 'number' },
      { key: 'createdBy', label: 'Created by user ID', type: 'number', required: true },
      { key: 'expiresAt', label: 'Expires at', type: 'datetime-local' },
    ],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'title', label: 'Title' },
      { key: 'audience', label: 'Audience' },
      { key: 'createdAt', label: 'Created' },
    ],
    readOnly: true,
  },
  attendance: {
    title: 'Attendance',
    endpoint: '/attendance',
    fields: [
      { key: 'courseSectionId', label: 'Course section ID', type: 'number', required: true },
      { key: 'studentId', label: 'Student ID', type: 'number', required: true },
      { key: 'attendanceDate', label: 'Date', type: 'date', required: true },
      { key: 'status', label: 'Status', type: 'select', required: true, options: statusOptions(['present', 'absent', 'late', 'excused']) },
      { key: 'remarks', label: 'Remarks', type: 'textarea' },
      { key: 'markedBy', label: 'Marked by user ID', type: 'number' },
    ],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'courseSectionId', label: 'Section' },
      { key: 'studentId', label: 'Student' },
      { key: 'attendanceDate', label: 'Date' },
      { key: 'status', label: 'Status' },
      { key: 'remarks', label: 'Remarks' },
    ],
  },
  grades: {
    title: 'Grades',
    endpoint: '/grades',
    fields: [
      { key: 'enrollmentId', label: 'Enrollment ID', type: 'number', required: true },
      { key: 'midtermScore', label: 'Midterm score', type: 'number' },
      { key: 'finalScore', label: 'Final score', type: 'number' },
      { key: 'assignmentScore', label: 'Assignment score', type: 'number' },
      { key: 'totalScore', label: 'Total score', type: 'number' },
      { key: 'letterGrade', label: 'Letter grade' },
      { key: 'gradePoint', label: 'Grade point', type: 'number' },
      { key: 'enteredBy', label: 'Entered by user ID', type: 'number' },
    ],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'enrollmentId', label: 'Enrollment' },
      { key: 'midtermScore', label: 'Midterm' },
      { key: 'finalScore', label: 'Final' },
      { key: 'totalScore', label: 'Total' },
      { key: 'letterGrade', label: 'Grade' },
      { key: 'gradePoint', label: 'Points' },
      { key: 'approvalStatus', label: 'Review status' },
    ],
    readOnly: true,
  },
  invoices: {
    title: 'Invoices',
    endpoint: '/invoices',
    fields: [
      { key: 'invoiceNumber', label: 'Invoice number', required: true },
      { key: 'studentId', label: 'Student ID', type: 'number', required: true },
      { key: 'feeStructureId', label: 'Fee structure ID', type: 'number' },
      { key: 'amount', label: 'Amount', type: 'number', required: true },
      { key: 'discount', label: 'Discount', type: 'number' },
      { key: 'totalDue', label: 'Total due', type: 'number', required: true },
      { key: 'amountPaid', label: 'Amount paid', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: statusOptions(['unpaid', 'partial', 'paid', 'overdue', 'cancelled']) },
      { key: 'issuedDate', label: 'Issued date', type: 'date', required: true },
      { key: 'dueDate', label: 'Due date', type: 'date' },
    ],
    columns: [
      { key: 'invoiceNumber', label: 'Invoice' },
      { key: 'studentId', label: 'Student' },
      { key: 'totalDue', label: 'Due' },
      { key: 'amountPaid', label: 'Paid' },
      { key: 'status', label: 'Status' },
      { key: 'dueDate', label: 'Due date' },
    ],
  },
  payments: {
    title: 'Payments',
    endpoint: '/payments',
    fields: [
      { key: 'invoiceId', label: 'Invoice ID', type: 'number', required: true },
      { key: 'studentId', label: 'Student ID', type: 'number', required: true },
      { key: 'amount', label: 'Amount', type: 'number', required: true },
      { key: 'method', label: 'Method', type: 'select', required: true, options: statusOptions(['cash', 'bank_transfer', 'card', 'online', 'mobile_money']) },
      { key: 'referenceNo', label: 'Reference number' },
      { key: 'receivedBy', label: 'Received by user ID', type: 'number' },
      { key: 'notes', label: 'Notes' },
    ],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'invoiceId', label: 'Invoice' },
      { key: 'studentId', label: 'Student' },
      { key: 'amount', label: 'Amount' },
      { key: 'method', label: 'Method' },
      { key: 'paymentDate', label: 'Date' },
    ],
  },
  materials: {
    title: 'Course materials',
    endpoint: '/course-materials',
    fields: [
      { key: 'courseSectionId', label: 'Course section ID', type: 'number', required: true },
      { key: 'title', label: 'Title', required: true },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'filePath', label: 'File URL or path', type: 'url', required: true },
      { key: 'fileType', label: 'File type' },
    ],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'courseSectionId', label: 'Section' },
      { key: 'title', label: 'Title' },
      { key: 'fileType', label: 'Type' },
      { key: 'uploadedAt', label: 'Uploaded' },
    ],
    readOnly: true,
  },
  requests: {
    title: 'Student requests',
    endpoint: '/requests',
    fields: [
      { key: 'type', label: 'Request type', type: 'select', required: true, options: statusOptions(['transcript', 'certificate', 'leave', 'other']) },
      { key: 'description', label: 'Details', type: 'textarea' },
    ],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'studentId', label: 'Student' },
      { key: 'type', label: 'Type' },
      { key: 'description', label: 'Details' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Submitted' },
    ],
  },
  assignments: {
    title: 'Assignments',
    endpoint: '/assignments',
    fields: [
      { key: 'courseSectionId', label: 'Course section ID', type: 'number', required: true },
      { key: 'title', label: 'Title', required: true },
      { key: 'description', label: 'Instructions', type: 'textarea' },
      { key: 'dueDate', label: 'Due date', type: 'datetime-local', required: true },
      { key: 'maxScore', label: 'Maximum score', type: 'number', required: true },
    ],
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'courseSectionId', label: 'Section' },
      { key: 'title', label: 'Assignment' },
      { key: 'dueDate', label: 'Due date' },
      { key: 'maxScore', label: 'Max score' },
    ],
  },
};

export function ConfiguredResource({
  resource,
  readOnly,
  canCreate,
  canEdit,
  canDelete,
}: {
  resource: keyof typeof configurations;
  readOnly?: boolean;
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  const config = configurations[resource];
  return (
    <ResourceManager
      {...config}
      readOnly={readOnly ?? config.readOnly}
      canCreate={canCreate}
      canEdit={canEdit}
      canDelete={canDelete}
    />
  );
}
