export const APP_NAME = 'Visa Genius';
export const APP_DESCRIPTION = 'Your AI-powered EB1A immigration application assistant';

export const EB1A_CRITERIA = [
  {
    id: 'judging',
    name: 'Judging the Work of Others',
    description: 'Evidence of having judged the work of others, either individually or on a panel',
    icon: '🏛️',
    sections: [
      'judging_experience',
      'judging_credentials',
      'judging_impact',
      'judging_recognition'
    ]
  },
  {
    id: 'leading_role',
    name: 'Leading or Critical Role',
    description: 'Evidence of having played a leading or critical role in distinguished organizations',
    icon: '👑',
    sections: [
      'leadership_experience',
      'organization_distinction',
      'critical_role_evidence',
      'leadership_impact'
    ]
  },
  {
    id: 'original_contribution',
    name: 'Original Scientific Contribution',
    description: 'Evidence of original scientific, scholarly, artistic, athletic, or business-related contributions',
    icon: '🔬',
    sections: [
      'scientific_contributions',
      'publications',
      'patents',
      'research_impact'
    ]
  },
  {
    id: 'authorship',
    name: 'Authorship of Scholarly Articles',
    description: 'Evidence of authorship of scholarly articles in professional journals or major media',
    icon: '📚',
    sections: [
      'publications_list',
      'journal_quality',
      'citation_impact',
      'media_coverage'
    ]
  },
  {
    id: 'high_salary',
    name: 'High Salary or Remuneration',
    description: 'Evidence of having commanded a high salary or other significantly high remuneration',
    icon: '💰',
    sections: [
      'salary_evidence',
      'remuneration_comparison',
      'market_position',
      'compensation_documentation'
    ]
  },
  {
    id: 'commercial_success',
    name: 'Commercial Success',
    description: 'Evidence of commercial success in the performing arts',
    icon: '🎭',
    sections: [
      'commercial_achievements',
      'box_office_success',
      'awards_recognition',
      'industry_impact'
    ]
  },
  {
    id: 'awards',
    name: 'Awards and Recognition',
    description: 'Evidence of receipt of lesser nationally or internationally recognized prizes or awards',
    icon: '🏆',
    sections: [
      'awards_list',
      'award_significance',
      'selection_criteria',
      'peer_recognition'
    ]
  },
  {
    id: 'membership',
    name: 'Membership in Distinguished Organizations',
    description: 'Evidence of membership in associations which require outstanding achievements',
    icon: '🏛️',
    sections: [
      'organization_membership',
      'membership_criteria',
      'contribution_to_organization',
      'leadership_roles'
    ]
  },
  {
    id: 'media_coverage',
    name: 'Media Coverage',
    description: 'Evidence of published material about the alien in professional or major trade publications',
    icon: '📰',
    sections: [
      'media_mentions',
      'publication_quality',
      'coverage_frequency',
      'impact_assessment'
    ]
  },
  {
    id: 'exhibitions',
    name: 'Display of Work at Exhibitions',
    description: 'Evidence of display of the alien\'s work in the field at artistic exhibitions or showcases',
    icon: '🎨',
    sections: [
      'exhibition_list',
      'exhibition_quality',
      'curatorial_selection',
      'audience_reach'
    ]
  },
  {
    id: 'critical_role',
    name: 'Performance in Critical Role',
    description: 'Evidence of performance in a leading or critical role for distinguished organizations',
    icon: '⭐',
    sections: [
      'role_description',
      'organization_prestige',
      'critical_impact',
      'leadership_evidence'
    ]
  }
];

export const QUESTIONNAIRE_SECTIONS = {
  personal_info: {
    id: 'personal_info',
    name: 'Personal Information',
    description: 'Basic personal and contact information',
    subsections: [
      {
        id: 'basic_info',
        name: 'Basic Information',
        description: 'Personal details including name, birth information, and nationality',
        fields: [
          { id: 'firstName', label: 'First Name', type: 'text', required: true },
          { id: 'lastName', label: 'Last Name', type: 'text', required: true },
          { id: 'middleName', label: 'Middle Name', type: 'text', required: false },
          { id: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
          { id: 'placeOfBirth', label: 'Place of Birth', type: 'text', required: true },
          { id: 'nationality', label: 'Nationality', type: 'text', required: true },
          { id: 'passportNumber', label: 'Passport Number', type: 'text', required: false },
          { id: 'passportExpiryDate', label: 'Passport Expiry Date', type: 'date', required: false }
        ]
      },
      {
        id: 'current_status',
        name: 'Current Immigration Status',
        description: 'Your current immigration status and related information',
        fields: [
          { id: 'currentStatus', label: 'Current Immigration Status', type: 'select', required: true, options: ['H-1B', 'F-1', 'L-1', 'O-1', 'Other'] },
          { id: 'statusExpiryDate', label: 'Status Expiry Date', type: 'date', required: false },
          { id: 'i94Number', label: 'I-94 Number', type: 'text', required: false }
        ]
      },
      {
        id: 'current_address',
        name: 'Current Home Address',
        description: 'Your current residential address',
        fields: [
          { id: 'street', label: 'Street Address', type: 'text', required: true },
          { id: 'city', label: 'City', type: 'text', required: true },
          { id: 'state', label: 'State/Province', type: 'text', required: true },
          { id: 'country', label: 'Country', type: 'text', required: true },
          { id: 'zipCode', label: 'ZIP/Postal Code', type: 'text', required: true }
        ]
      },
      {
        id: 'family_life',
        name: 'Family Life',
        description: 'Information about your family and dependents',
        fields: [
          { id: 'maritalStatus', label: 'Marital Status', type: 'select', required: true, options: ['Single', 'Married', 'Divorced', 'Widowed'] },
          { id: 'spouseName', label: 'Spouse Name', type: 'text', required: false },
          { id: 'childrenCount', label: 'Number of Children', type: 'text', required: false }
        ]
      },
      {
        id: 'spouse_info',
        name: 'Spouse Information',
        description: 'Detailed information about your spouse',
        fields: [
          { id: 'spouseName', label: 'Full Name', type: 'text', required: false },
          { id: 'spouseDateOfBirth', label: 'Date of Birth', type: 'date', required: false },
          { id: 'spouseNationality', label: 'Nationality', type: 'text', required: false },
          { id: 'spouseOccupation', label: 'Occupation', type: 'text', required: false },
          { id: 'spouseEducation', label: 'Education', type: 'text', required: false }
        ]
      },
      {
        id: 'children_info',
        name: 'Children and Dependents',
        description: 'Information about your children and dependents',
        fields: [
          { id: 'childrenCount', label: 'Number of Children', type: 'text', required: false },
          { id: 'childrenDetails', label: 'Children Details', type: 'textarea', required: false }
        ]
      },
      {
        id: 'immigration_history',
        name: 'Immigration History',
        description: 'Your immigration and travel history',
        fields: [
          { id: 'previousVisas', label: 'Previous Visa Types', type: 'textarea', required: false },
          { id: 'visaHistory', label: 'Visa History Details', type: 'textarea', required: false },
          { id: 'previousPetitions', label: 'Previous Immigration Petitions', type: 'textarea', required: false },
          { id: 'petitionOutcomes', label: 'Petition Outcomes', type: 'textarea', required: false },
          { id: 'pastVisits', label: 'Past US Visits', type: 'textarea', required: false },
          { id: 'visitPurposes', label: 'Visit Purposes', type: 'textarea', required: false }
        ]
      },
      {
        id: 'occupation',
        name: 'Occupation & Employment',
        description: 'Your professional background and employment history',
        fields: [
          { id: 'jobTitle', label: 'Job Title', type: 'text', required: true },
          { id: 'field', label: 'Field of Work', type: 'text', required: true },
          { id: 'yearsOfExperience', label: 'Years of Experience', type: 'text', required: true },
          { id: 'currentEmployer', label: 'Current Employer', type: 'text', required: true },
          { id: 'jobDescription', label: 'Job Description', type: 'textarea', required: true },
          { id: 'employmentHistory', label: 'Employment History', type: 'textarea', required: false },
          { id: 'previousEmployers', label: 'Previous Employers', type: 'textarea', required: false }
        ]
      }
    ]
  }
};

export const APPLICATION_STEPS = [
  {
    title: 'Personal Information',
    description: 'Complete your basic information and background',
    icon: '👤',
    key: 'personal_info',
    order: 1
  },
  {
    title: 'EB1A Criteria Selection',
    description: 'Select the criteria you qualify for',
    icon: '🎯',
    key: 'criteria_selection',
    order: 2
  },
  {
    title: 'Document Upload',
    description: 'Upload supporting documents',
    icon: '📎',
    key: 'documents',
    order: 3
  },
  {
    title: 'Recommendation Letters',
    description: 'Add references and generate recommendation letters',
    icon: '📄',
    key: 'recommendation_letters',
    order: 4
  },
  {
    title: 'Petition Letter',
    description: 'Generate and customize your petition letter',
    icon: '📝',
    key: 'petition_letter',
    order: 5
  },
  {
    title: 'Review & Submit',
    description: 'Review and submit your application',
    icon: '✅',
    key: 'review',
    order: 6
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