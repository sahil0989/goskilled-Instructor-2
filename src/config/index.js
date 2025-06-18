const courseLevelOptions = []

export const courseLandingPageFormControls = [
    {
        name: 'title',
        label: 'Title',
        componentType: 'input',
        type: 'text',
        placeholder: 'Enter course title'
    },
    {
        name: 'level',
        label: 'Level',
        componentType: 'select',
        type: 'text',
        placeholder: '',
        option: courseLevelOptions
    },
    {
        name: 'subtitle',
        label: 'Subtitle',
        componentType: 'input',
        type: 'text',
        placeholder: 'Enter course subtitle'
    },
    {
        name: 'description',
        label: 'Description',
        componentType: 'textarea',
        type: 'text',
        placeholder: 'Enter course description'
    },
    {
        name: 'pricing',
        label: 'Pricing',
        componentType: 'input',
        type: 'number',
        placeholder: 'Enter course pricing'
    },
    {
        name: 'objectives',
        label: 'Objectives',
        componentType: 'textarea',
        type: 'text',
        placeholder: 'Enter course objectives'
    },
    {
        name: 'welcomeMessage',
        label: 'Welcome Message',
        componentType: 'textarea',
        placeholder: 'Welcome message for students'
    },
];

export const courseLandingInitialFormData = {
    title: '',
    subtitle: '',
    description: '',
    pricing: '',
    objectives: '',
    welcomeMessage: '',
    image: '',
    imagePublicId: ''
}

export const courseCurriculumInitialFromData = [
    {
        title: '',
        videoUrl: '',
        freePreview: false,
        public_id: '',
    }
]
