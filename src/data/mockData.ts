import type { User, Course, Subject, Module, Lesson, Instructor } from '../types';

// ─────────────────────────────────────────────
// Demo User
// ─────────────────────────────────────────────

export const DEMO_USER: User = {
  id: 'user-ahmed-001',
  name: 'Ahmed Osama',
  email: 'ahmed.osama@medstudent.edu',
  role: 'student',
  faculty: 'Faculty of Medicine',
  year: 'Year 1',
  enrolledCourseIds: ['course-anatomy', 'course-histology', 'course-physiology', 'course-pathology'],
  createdAt: '2024-09-01T00:00:00Z',
};

// ─────────────────────────────────────────────
// Instructors
// ─────────────────────────────────────────────

export const INSTRUCTORS: Record<string, Instructor> = {
  'inst-kamal': {
    id: 'inst-kamal',
    name: 'Prof. Kamal Hassan',
    title: 'Professor of Anatomy',
  },
  'inst-sara': {
    id: 'inst-sara',
    name: 'Dr. Sara El-Masry',
    title: 'Associate Professor of Histology',
  },
  'inst-nour': {
    id: 'inst-nour',
    name: 'Prof. Nour El-Din Ahmed',
    title: 'Professor of Physiology',
  },
  'inst-rania': {
    id: 'inst-rania',
    name: 'Dr. Rania Khalil',
    title: 'Senior Lecturer, Pathology',
  },
};

// ─────────────────────────────────────────────
// Lessons
// ─────────────────────────────────────────────

export const LESSONS: Record<string, Lesson> = {
  // Anatomy — Upper Limb
  'les-anat-ul-01': {
    id: 'les-anat-ul-01',
    moduleId: 'mod-anat-ul',
    subjectId: 'subj-anat-upperlimb',
    courseId: 'course-anatomy',
    title: 'Bones of the Upper Limb',
    type: 'video',
    description: 'An overview of the skeletal framework of the upper limb including the clavicle, scapula, humerus, radius, ulna, and hand bones.',
    durationMinutes: 28,
    order: 1,
    videoPlaceholder: true,
  },
  'les-anat-ul-02': {
    id: 'les-anat-ul-02',
    moduleId: 'mod-anat-ul',
    subjectId: 'subj-anat-upperlimb',
    courseId: 'course-anatomy',
    title: 'The Shoulder Joint',
    type: 'video',
    description: 'Detailed anatomy of the glenohumeral joint, its ligaments, bursae, and rotator cuff muscles.',
    durationMinutes: 35,
    order: 2,
    videoPlaceholder: true,
  },
  'les-anat-ul-03': {
    id: 'les-anat-ul-03',
    moduleId: 'mod-anat-ul',
    subjectId: 'subj-anat-upperlimb',
    courseId: 'course-anatomy',
    title: 'Upper Limb — Reference Atlas',
    type: 'document',
    description: 'Comprehensive labeled diagrams and clinical notes for upper limb anatomy.',
    pageCount: 42,
    order: 3,
    documentPlaceholder: true,
  },
  'les-anat-ul-04': {
    id: 'les-anat-ul-04',
    moduleId: 'mod-anat-ul',
    subjectId: 'subj-anat-upperlimb',
    courseId: 'course-anatomy',
    title: 'Muscles of the Arm',
    type: 'video',
    description: 'Anterior and posterior compartment muscles, their origins, insertions, and innervations.',
    durationMinutes: 30,
    order: 4,
    videoPlaceholder: true,
  },
  // Anatomy — Lower Limb
  'les-anat-ll-01': {
    id: 'les-anat-ll-01',
    moduleId: 'mod-anat-ll',
    subjectId: 'subj-anat-lowerlimb',
    courseId: 'course-anatomy',
    title: 'Bones of the Lower Limb',
    type: 'video',
    description: 'Overview of the femur, tibia, fibula, patella and foot bones.',
    durationMinutes: 25,
    order: 1,
    videoPlaceholder: true,
  },
  'les-anat-ll-02': {
    id: 'les-anat-ll-02',
    moduleId: 'mod-anat-ll',
    subjectId: 'subj-anat-lowerlimb',
    courseId: 'course-anatomy',
    title: 'The Hip Joint',
    type: 'video',
    description: 'Structure of the coxofemoral joint, clinical significance, and common pathologies.',
    durationMinutes: 32,
    order: 2,
    videoPlaceholder: true,
  },
  'les-anat-ll-03': {
    id: 'les-anat-ll-03',
    moduleId: 'mod-anat-ll',
    subjectId: 'subj-anat-lowerlimb',
    courseId: 'course-anatomy',
    title: 'Lower Limb — Study Notes',
    type: 'document',
    description: 'Study-ready notes covering key lower limb anatomical concepts and clinical correlations.',
    pageCount: 36,
    order: 3,
    documentPlaceholder: true,
  },
  // Anatomy — Head & Neck
  'les-anat-hn-01': {
    id: 'les-anat-hn-01',
    moduleId: 'mod-anat-hn',
    subjectId: 'subj-anat-headneck',
    courseId: 'course-anatomy',
    title: 'The Skull',
    type: 'video',
    description: 'Bones of the cranium and facial skeleton, foramina and their contents.',
    durationMinutes: 40,
    order: 1,
    videoPlaceholder: true,
  },
  'les-anat-hn-02': {
    id: 'les-anat-hn-02',
    moduleId: 'mod-anat-hn',
    subjectId: 'subj-anat-headneck',
    courseId: 'course-anatomy',
    title: 'Cranial Nerves Overview',
    type: 'video',
    description: 'The 12 cranial nerves — their origins, functions and clinical testing.',
    durationMinutes: 45,
    order: 2,
    videoPlaceholder: true,
  },
  'les-anat-hn-03': {
    id: 'les-anat-hn-03',
    moduleId: 'mod-anat-hn',
    subjectId: 'subj-anat-headneck',
    courseId: 'course-anatomy',
    title: 'Head & Neck Reference Document',
    type: 'document',
    description: 'Atlas-style reference for head and neck anatomical structures.',
    pageCount: 58,
    order: 3,
    documentPlaceholder: true,
  },

  // Histology — Epithelial Tissue
  'les-histo-ep-01': {
    id: 'les-histo-ep-01',
    moduleId: 'mod-histo-ep',
    subjectId: 'subj-histo-epithelial',
    courseId: 'course-histology',
    title: 'Introduction to Epithelial Tissue',
    type: 'video',
    description: 'Classification, characteristics, and functions of epithelial tissues.',
    durationMinutes: 22,
    order: 1,
    videoPlaceholder: true,
  },
  'les-histo-ep-02': {
    id: 'les-histo-ep-02',
    moduleId: 'mod-histo-ep',
    subjectId: 'subj-histo-epithelial',
    courseId: 'course-histology',
    title: 'Simple vs Stratified Epithelium',
    type: 'video',
    description: 'Microscopic identification and functional differences between epithelial types.',
    durationMinutes: 26,
    order: 2,
    videoPlaceholder: true,
  },
  'les-histo-ep-03': {
    id: 'les-histo-ep-03',
    moduleId: 'mod-histo-ep',
    subjectId: 'subj-histo-epithelial',
    courseId: 'course-histology',
    title: 'Epithelial Tissue — Slide Atlas',
    type: 'document',
    description: 'High-resolution microscopy slides with annotated labels for all epithelial types.',
    pageCount: 30,
    order: 3,
    documentPlaceholder: true,
  },
  // Histology — Connective Tissue
  'les-histo-ct-01': {
    id: 'les-histo-ct-01',
    moduleId: 'mod-histo-ct',
    subjectId: 'subj-histo-connective',
    courseId: 'course-histology',
    title: 'Connective Tissue Components',
    type: 'video',
    description: 'Cells, fibers, and ground substance of connective tissue.',
    durationMinutes: 24,
    order: 1,
    videoPlaceholder: true,
  },
  'les-histo-ct-02': {
    id: 'les-histo-ct-02',
    moduleId: 'mod-histo-ct',
    subjectId: 'subj-histo-connective',
    courseId: 'course-histology',
    title: 'Connective Tissue — Study Notes',
    type: 'document',
    description: 'Comprehensive notes on connective tissue classification and clinical significance.',
    pageCount: 24,
    order: 2,
    documentPlaceholder: true,
  },

  // Physiology — Cardiovascular
  'les-physio-cv-01': {
    id: 'les-physio-cv-01',
    moduleId: 'mod-physio-cv',
    subjectId: 'subj-physio-cardiovascular',
    courseId: 'course-physiology',
    title: 'The Cardiac Cycle',
    type: 'video',
    description: 'Phases of the cardiac cycle, pressure-volume relationships, and heart sounds.',
    durationMinutes: 38,
    order: 1,
    videoPlaceholder: true,
  },
  'les-physio-cv-02': {
    id: 'les-physio-cv-02',
    moduleId: 'mod-physio-cv',
    subjectId: 'subj-physio-cardiovascular',
    courseId: 'course-physiology',
    title: 'Blood Pressure Regulation',
    type: 'video',
    description: 'Short-term and long-term mechanisms of blood pressure control.',
    durationMinutes: 34,
    order: 2,
    videoPlaceholder: true,
  },
  'les-physio-cv-03': {
    id: 'les-physio-cv-03',
    moduleId: 'mod-physio-cv',
    subjectId: 'subj-physio-cardiovascular',
    courseId: 'course-physiology',
    title: 'Cardiovascular Physiology — Notes',
    type: 'document',
    description: 'Detailed study notes covering all cardiovascular physiology topics.',
    pageCount: 48,
    order: 3,
    documentPlaceholder: true,
  },
  // Physiology — Respiratory
  'les-physio-resp-01': {
    id: 'les-physio-resp-01',
    moduleId: 'mod-physio-resp',
    subjectId: 'subj-physio-respiratory',
    courseId: 'course-physiology',
    title: 'Mechanics of Breathing',
    type: 'video',
    description: 'Lung volumes, pressures, and the physiology of ventilation.',
    durationMinutes: 30,
    order: 1,
    videoPlaceholder: true,
  },
  'les-physio-resp-02': {
    id: 'les-physio-resp-02',
    moduleId: 'mod-physio-resp',
    subjectId: 'subj-physio-respiratory',
    courseId: 'course-physiology',
    title: 'Gas Exchange and Transport',
    type: 'video',
    description: 'Oxygen and CO2 exchange at alveolar and tissue levels, hemoglobin dissociation curves.',
    durationMinutes: 36,
    order: 2,
    videoPlaceholder: true,
  },

  // Pathology — Cell Injury
  'les-path-ci-01': {
    id: 'les-path-ci-01',
    moduleId: 'mod-path-ci',
    subjectId: 'subj-path-cellinjury',
    courseId: 'course-pathology',
    title: 'Causes of Cell Injury',
    type: 'video',
    description: 'Mechanisms of reversible and irreversible cell injury, including hypoxia and chemical injury.',
    durationMinutes: 32,
    order: 1,
    videoPlaceholder: true,
  },
  'les-path-ci-02': {
    id: 'les-path-ci-02',
    moduleId: 'mod-path-ci',
    subjectId: 'subj-path-cellinjury',
    courseId: 'course-pathology',
    title: 'Apoptosis vs Necrosis',
    type: 'video',
    description: 'Morphological and biochemical features that distinguish apoptosis from necrosis.',
    durationMinutes: 28,
    order: 2,
    videoPlaceholder: true,
  },
  'les-path-ci-03': {
    id: 'les-path-ci-03',
    moduleId: 'mod-path-ci',
    subjectId: 'subj-path-cellinjury',
    courseId: 'course-pathology',
    title: 'Cell Injury — Reference Document',
    type: 'document',
    description: 'Illustrated reference covering all cell injury pathways.',
    pageCount: 38,
    order: 3,
    documentPlaceholder: true,
  },
  // Pathology — Inflammation
  'les-path-inf-01': {
    id: 'les-path-inf-01',
    moduleId: 'mod-path-inf',
    subjectId: 'subj-path-inflammation',
    courseId: 'course-pathology',
    title: 'Acute Inflammation',
    type: 'video',
    description: 'Vascular and cellular events in acute inflammation, cardinal signs, and mediators.',
    durationMinutes: 40,
    order: 1,
    videoPlaceholder: true,
  },
  'les-path-inf-02': {
    id: 'les-path-inf-02',
    moduleId: 'mod-path-inf',
    subjectId: 'subj-path-inflammation',
    courseId: 'course-pathology',
    title: 'Chronic Inflammation',
    type: 'video',
    description: 'Features, cell types, and disease associations of chronic inflammation.',
    durationMinutes: 35,
    order: 2,
    videoPlaceholder: true,
  },
};

// ─────────────────────────────────────────────
// Modules
// ─────────────────────────────────────────────

export const MODULES: Record<string, Module> = {
  'mod-anat-ul': {
    id: 'mod-anat-ul',
    subjectId: 'subj-anat-upperlimb',
    courseId: 'course-anatomy',
    title: 'Upper Limb',
    description: 'Bones, joints, muscles, and neurovascular supply of the upper limb.',
    order: 1,
    lessonIds: ['les-anat-ul-01', 'les-anat-ul-02', 'les-anat-ul-03', 'les-anat-ul-04'],
  },
  'mod-anat-ll': {
    id: 'mod-anat-ll',
    subjectId: 'subj-anat-lowerlimb',
    courseId: 'course-anatomy',
    title: 'Lower Limb',
    description: 'Complete lower limb anatomy from hip to foot.',
    order: 1,
    lessonIds: ['les-anat-ll-01', 'les-anat-ll-02', 'les-anat-ll-03'],
  },
  'mod-anat-hn': {
    id: 'mod-anat-hn',
    subjectId: 'subj-anat-headneck',
    courseId: 'course-anatomy',
    title: 'Head & Neck',
    description: 'Skull, cranial nerves, neck triangles, and deep structures.',
    order: 1,
    lessonIds: ['les-anat-hn-01', 'les-anat-hn-02', 'les-anat-hn-03'],
  },
  'mod-histo-ep': {
    id: 'mod-histo-ep',
    subjectId: 'subj-histo-epithelial',
    courseId: 'course-histology',
    title: 'Epithelial Tissue',
    description: 'Microscopic structure and classification of epithelial tissues.',
    order: 1,
    lessonIds: ['les-histo-ep-01', 'les-histo-ep-02', 'les-histo-ep-03'],
  },
  'mod-histo-ct': {
    id: 'mod-histo-ct',
    subjectId: 'subj-histo-connective',
    courseId: 'course-histology',
    title: 'Connective Tissue',
    description: 'Fibers, cells, and ground substance of connective tissues.',
    order: 1,
    lessonIds: ['les-histo-ct-01', 'les-histo-ct-02'],
  },
  'mod-physio-cv': {
    id: 'mod-physio-cv',
    subjectId: 'subj-physio-cardiovascular',
    courseId: 'course-physiology',
    title: 'Cardiovascular Physiology',
    description: 'Heart function, circulation, and blood pressure regulation.',
    order: 1,
    lessonIds: ['les-physio-cv-01', 'les-physio-cv-02', 'les-physio-cv-03'],
  },
  'mod-physio-resp': {
    id: 'mod-physio-resp',
    subjectId: 'subj-physio-respiratory',
    courseId: 'course-physiology',
    title: 'Respiratory Physiology',
    description: 'Mechanics of breathing and gas exchange.',
    order: 1,
    lessonIds: ['les-physio-resp-01', 'les-physio-resp-02'],
  },
  'mod-path-ci': {
    id: 'mod-path-ci',
    subjectId: 'subj-path-cellinjury',
    courseId: 'course-pathology',
    title: 'Cell Injury & Death',
    description: 'Mechanisms of cell injury, necrosis, and apoptosis.',
    order: 1,
    lessonIds: ['les-path-ci-01', 'les-path-ci-02', 'les-path-ci-03'],
  },
  'mod-path-inf': {
    id: 'mod-path-inf',
    subjectId: 'subj-path-inflammation',
    courseId: 'course-pathology',
    title: 'Inflammation',
    description: 'Acute and chronic inflammation, repair, and healing.',
    order: 1,
    lessonIds: ['les-path-inf-01', 'les-path-inf-02'],
  },
};

// ─────────────────────────────────────────────
// Subjects
// ─────────────────────────────────────────────

export const SUBJECTS: Record<string, Subject> = {
  'subj-anat-upperlimb': {
    id: 'subj-anat-upperlimb',
    courseId: 'course-anatomy',
    title: 'Upper Limb',
    description: 'Comprehensive study of the upper limb including shoulder, arm, forearm, and hand.',
    color: '#4f8ef7',
    order: 1,
    moduleIds: ['mod-anat-ul'],
  },
  'subj-anat-lowerlimb': {
    id: 'subj-anat-lowerlimb',
    courseId: 'course-anatomy',
    title: 'Lower Limb',
    description: 'Study of the hip, thigh, leg, and foot anatomy.',
    color: '#7c6ef7',
    order: 2,
    moduleIds: ['mod-anat-ll'],
  },
  'subj-anat-headneck': {
    id: 'subj-anat-headneck',
    courseId: 'course-anatomy',
    title: 'Head & Neck',
    description: 'Skull, brain coverings, cranial nerves, and neck structures.',
    color: '#ef7c6e',
    order: 3,
    moduleIds: ['mod-anat-hn'],
  },
  'subj-histo-epithelial': {
    id: 'subj-histo-epithelial',
    courseId: 'course-histology',
    title: 'Epithelial Tissue',
    description: 'Microscopic study of all epithelial tissue types.',
    color: '#4fc28e',
    order: 1,
    moduleIds: ['mod-histo-ep'],
  },
  'subj-histo-connective': {
    id: 'subj-histo-connective',
    courseId: 'course-histology',
    title: 'Connective Tissue',
    description: 'Structure and function of connective tissue and its subtypes.',
    color: '#e9a84c',
    order: 2,
    moduleIds: ['mod-histo-ct'],
  },
  'subj-physio-cardiovascular': {
    id: 'subj-physio-cardiovascular',
    courseId: 'course-physiology',
    title: 'Cardiovascular System',
    description: 'Heart physiology, circulation, and blood pressure regulation.',
    color: '#e96c6c',
    order: 1,
    moduleIds: ['mod-physio-cv'],
  },
  'subj-physio-respiratory': {
    id: 'subj-physio-respiratory',
    courseId: 'course-physiology',
    title: 'Respiratory System',
    description: 'Mechanics of breathing and gas exchange at alveolar and tissue levels.',
    color: '#4fc2c2',
    order: 2,
    moduleIds: ['mod-physio-resp'],
  },
  'subj-path-cellinjury': {
    id: 'subj-path-cellinjury',
    courseId: 'course-pathology',
    title: 'Cell Injury & Death',
    description: 'Causes, mechanisms, and morphological features of cell injury.',
    color: '#9b59b6',
    order: 1,
    moduleIds: ['mod-path-ci'],
  },
  'subj-path-inflammation': {
    id: 'subj-path-inflammation',
    courseId: 'course-pathology',
    title: 'Inflammation & Repair',
    description: 'Acute inflammation, chronic inflammation, and tissue repair.',
    color: '#e67e22',
    order: 2,
    moduleIds: ['mod-path-inf'],
  },
};

// ─────────────────────────────────────────────
// Courses
// ─────────────────────────────────────────────

export const COURSES: Record<string, Course> = {
  'course-anatomy': {
    id: 'course-anatomy',
    title: 'Anatomy',
    description: 'Systematic study of the human body structure.',
    longDescription: 'A comprehensive first-year anatomy course covering gross anatomy of the upper limb, lower limb, thorax, abdomen, pelvis, head and neck. Combines lecture content with clinical correlations.',
    instructorId: 'inst-kamal',
    faculty: 'Faculty of Medicine',
    year: 'Year 1',
    color: '#4f8ef7',
    icon: '🫀',
    totalLessons: 10,
    subjectIds: ['subj-anat-upperlimb', 'subj-anat-lowerlimb', 'subj-anat-headneck'],
    createdAt: '2024-09-01T00:00:00Z',
  },
  'course-histology': {
    id: 'course-histology',
    title: 'Histology',
    description: 'Microscopic anatomy of tissues and organs.',
    longDescription: 'Study of the microstructure of tissues using light and electron microscopy. Covers all basic tissue types and their organ-specific specializations.',
    instructorId: 'inst-sara',
    faculty: 'Faculty of Medicine',
    year: 'Year 1',
    color: '#4fc28e',
    icon: '🔬',
    totalLessons: 5,
    subjectIds: ['subj-histo-epithelial', 'subj-histo-connective'],
    createdAt: '2024-09-01T00:00:00Z',
  },
  'course-physiology': {
    id: 'course-physiology',
    title: 'Physiology',
    description: 'Functions and mechanisms of the human body systems.',
    longDescription: 'Covers cardiovascular, respiratory, renal, gastrointestinal, and neurological physiology with an emphasis on integrated organ-system function.',
    instructorId: 'inst-nour',
    faculty: 'Faculty of Medicine',
    year: 'Year 1',
    color: '#e96c6c',
    icon: '❤️',
    totalLessons: 5,
    subjectIds: ['subj-physio-cardiovascular', 'subj-physio-respiratory'],
    createdAt: '2024-09-01T00:00:00Z',
  },
  'course-pathology': {
    id: 'course-pathology',
    title: 'Pathology',
    description: 'Disease mechanisms and morphological changes.',
    longDescription: 'Introduction to general pathology: cell injury, inflammation, neoplasia, hemodynamic disorders, and immunopathology. Bridges basic science to clinical medicine.',
    instructorId: 'inst-rania',
    faculty: 'Faculty of Medicine',
    year: 'Year 1',
    color: '#9b59b6',
    icon: '🧫',
    totalLessons: 5,
    subjectIds: ['subj-path-cellinjury', 'subj-path-inflammation'],
    createdAt: '2024-09-01T00:00:00Z',
  },
};

// Ordered arrays for iteration
export const COURSE_LIST = Object.values(COURSES);
export const SUBJECT_LIST = Object.values(SUBJECTS);
export const MODULE_LIST = Object.values(MODULES);
export const LESSON_LIST = Object.values(LESSONS);

// Helper: get all lessons for a module, sorted by order
export function getLessonsForModule(moduleId: string): Lesson[] {
  return LESSON_LIST.filter(l => l.moduleId === moduleId).sort((a, b) => a.order - b.order);
}

// Helper: get all modules for a subject, sorted by order
export function getModulesForSubject(subjectId: string): Module[] {
  return MODULE_LIST.filter(m => m.subjectId === subjectId).sort((a, b) => a.order - b.order);
}

// Helper: get all subjects for a course, sorted by order
export function getSubjectsForCourse(courseId: string): Subject[] {
  return SUBJECT_LIST.filter(s => s.courseId === courseId).sort((a, b) => a.order - b.order);
}

// Helper: get all lessons for a course (flat list)
export function getLessonsForCourse(courseId: string): Lesson[] {
  return LESSON_LIST.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);
}

// Helper: adjacent lessons for prev/next navigation
export function getAdjacentLessons(lesson: Lesson): { prev?: Lesson; next?: Lesson } {
  const module = MODULES[lesson.moduleId];
  if (!module) return {};
  const lessons = getLessonsForModule(lesson.moduleId);
  const idx = lessons.findIndex(l => l.id === lesson.id);
  return {
    prev: idx > 0 ? lessons[idx - 1] : undefined,
    next: idx < lessons.length - 1 ? lessons[idx + 1] : undefined,
  };
}
