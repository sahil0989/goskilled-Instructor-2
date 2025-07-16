const courseLevelOptions = [
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
];

export const courseLandingPageFormControls = [
    {
        name: "title",
        label: "Title",
        componentType: "input",
        type: "text",
        placeholder: "Enter course title",
    },
    {
        name: "level",
        label: "Level",
        componentType: "select",
        type: "text",
        placeholder: "",
        option: courseLevelOptions,
    },
    {
        name: "subtitle",
        label: "Subtitle",
        componentType: "input",
        type: "text",
        placeholder: "Enter course subtitle",
    },
    {
        name: "description",
        label: "Description",
        componentType: "textarea",
        type: "text",
        placeholder: "Enter course description",
    },
    {
        name: "pricing",
        label: "Pricing",
        componentType: "input",
        type: "number",
        placeholder: "Enter course pricing",
    },
    {
        name: "objectives",
        label: "Objectives",
        componentType: "textarea",
        type: "text",
        placeholder: "Enter course objectives",
    },
    {
        name: "welcomeMessage",
        label: "Welcome Message",
        componentType: "textarea",
        placeholder: "Welcome message for students",
    },
    // Add these to match your latest backend/fields:
    {
        name: "tagline",
        label: "Tagline",
        componentType: "input",
        type: "text",
        placeholder: "Enter course tagline",
    },
    {
        name: "category",
        label: "Category",
        componentType: "select",
        option: [
            { label: "AI & Automation", value: "AI & Automation" },
            { label: "Design", value: "Design" },
            { label: "Marketing", value: "Marketing" },
            { label: "Business", value: "Business" },
        ],
    },
    {
        name: "plan",
        label: "Plan",
        componentType: "select",
        option: [
            { label: "Basic", value: "Basic" },
            { label: "Premium", value: "Premium" },
        ],
    },
    {
        name: "bonusIncluded",
        label: "Include AI Bonus Pack",
        componentType: "checkbox",
    },
    {
        name: "isTaxable",
        label: "Apply GST After ₹20L Limit",
        componentType: "checkbox",
    },
];

export const courseLandingInitialFormData = {
    title: '',
    subtitle: '',
    description: '',
    pricing: {
        standard: '',
        premium: '',
    },
    objectives: '',
    welcomeMessage: '',
    image: '',
    imagePublicId: '',
    heroSection: {
        features: [],
        content:[]
    },
    whyChoose: [],
    whatYouWillLearn: [],
    whoIsThisFor: [],
    reviews: [],
    faqs: [],
};

export const courseCurriculumInitialFromData = [
    {
        title: "",
        videoUrl: "",
        freePreview: false,
    },
];

export const getEmptyCurriculum = () => [
    {
        title: "",
        videoUrl: "",
        freePreview: false,
    },
];
