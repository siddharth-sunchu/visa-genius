export const APP_NAME = 'Visa Genius';
export const APP_DESCRIPTION = 'Your AI-powered EB1A immigration application assistant';

export const EB1A_CRITERIA = [
  {
    id: 'extraordinary-ability',
    category: 'Extraordinary Ability',
    title: 'Evidence of Extraordinary Ability',
    description: 'Demonstrate extraordinary ability in sciences, arts, education, business, or athletics',
    required: true
  },
  {
    id: 'national-recognition',
    category: 'National Recognition',
    title: 'National or International Recognition',
    description: 'Show sustained national or international acclaim',
    required: true
  },
  {
    id: 'scholarly-contributions',
    category: 'Scholarly Contributions',
    title: 'Original Scientific Contributions',
    description: 'Evidence of original scientific, scholarly, or artistic contributions',
    required: true
  },
  {
    id: 'authorship',
    category: 'Authorship',
    title: 'Authorship of Scholarly Articles',
    description: 'Authorship of scholarly articles in professional journals',
    required: false
  },
  {
    id: 'judging',
    category: 'Judging',
    title: 'Judging the Work of Others',
    description: 'Service as a judge of the work of others in the field',
    required: false
  },
  {
    id: 'original-contributions',
    category: 'Original Contributions',
    title: 'Original Contributions of Major Significance',
    description: 'Original scientific, scholarly, or artistic contributions of major significance',
    required: false
  },
  {
    id: 'authorship-books',
    category: 'Authorship of Books',
    title: 'Authorship of Scholarly Books',
    description: 'Authorship of scholarly books or articles in professional journals',
    required: false
  },
  {
    id: 'exhibitions',
    category: 'Exhibitions',
    title: 'Display of Work at Exhibitions',
    description: 'Display of work at artistic exhibitions or showcases',
    required: false
  },
  {
    id: 'leading-role',
    category: 'Leading Role',
    title: 'Leading or Critical Role',
    description: 'Performance in a leading or critical role for distinguished organizations',
    required: false
  },
  {
    id: 'high-salary',
    category: 'High Salary',
    title: 'High Salary or Remuneration',
    description: 'Commanding a high salary or remuneration for services',
    required: false
  },
  {
    id: 'commercial-success',
    category: 'Commercial Success',
    title: 'Commercial Success in Performing Arts',
    description: 'Commercial success in the performing arts',
    required: false
  }
];

export const APPLICATION_STEPS = [
  {
    id: 'personal-info',
    title: 'Personal Information',
    description: 'Fill in your basic information and professional background',
    order: 1
  },
  {
    id: 'eb1a-criteria',
    title: 'EB1A Criteria',
    description: 'Complete the EB1A eligibility criteria sections',
    order: 2
  },
  {
    id: 'referees',
    title: 'Recommendation Letters',
    description: 'Add referees and generate recommendation letters',
    order: 3
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Review your application and submit for case manager review',
    order: 4
  }
];

export const COLORS = {
  primary: '#1890ff',
  secondary: '#722ed1',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  text: '#262626',
  textSecondary: '#8c8c8c',
  background: '#fafafa',
  border: '#d9d9d9'
};

export const BREAKPOINTS = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
}; 