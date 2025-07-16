import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useInstructor } from "../../../context/instructor-context/InstructorContext";
import { useEffect, useState } from "react";
import {
    addNewCourseService,
    fetchInstructorCourseDetailsService,
    updateCourseByIdService,
} from "../../../services";
import {
    courseCurriculumInitialFromData,
    courseLandingInitialFormData,
    getEmptyCurriculum,
} from "../../../config";
import { Button } from "../../../@/components/ui/button";
import { Card, CardContent } from "../../../@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../../@/components/ui/tabs";
import CourseCurriculum from "./courseLecture";
import CourseLandingForm from "./courseDetails";
import { toast } from "sonner";
import ExtraDetailsForm from "./DynamicInputs";

export default function Course() {
    const {
        courseLandingFormData,
        courseCurriculumFormData,
        setCourseLandingFormData,
        setCourseCurriculumFormData,
        currentEditedCourseId,
        setCurrentEditedCourseId,
    } = useInstructor();

    const { fetchAdminAllCourses } = useAuth();
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Utility to check if a value is empty (trimmed strings or empty arrays)
    function isEmpty(value) {
        if (Array.isArray(value)) return value.length === 0;
        if (typeof value === "string") return value.trim() === "";
        return value === null || value === undefined;
    }

    // Validate course landing and curriculum form data
    function validateFormData() {
        for (const key in courseLandingFormData) {
            if (key === 'heroSection') {
                if (
                    courseLandingFormData.heroSection.features.length === 0
                ) return false;
            } else if (key === 'pricing') {
                const pricing = courseLandingFormData.pricing;
                if (isEmpty(pricing.standard) || isNaN(pricing.standard) || Number(pricing.standard) <= 0) return false;
            } else if (
                Array.isArray(courseLandingFormData[key]) &&
                courseLandingFormData[key].length === 0 &&
                ['whyChoose', 'whatYouWillLearn', 'whoIsThisFor'].includes(key)
            ) {
                return false;
            } else if (
                typeof courseLandingFormData[key] !== 'object' &&
                isEmpty(courseLandingFormData[key])
            ) {
                return false;
            }
        }

        // Curriculum validation
        let hasFreePreview = false;
        for (const item of courseCurriculumFormData) {
            if (isEmpty(item.title) || isEmpty(item.videoUrl)) return false;
            if (item.freePreview) hasFreePreview = true;
        }

        return hasFreePreview;
    }

    // Fetch course details for editing
    async function fetchCurrentCourseDetails() {
        setIsLoading(true);
        try {
            const response = await fetchInstructorCourseDetailsService(currentEditedCourseId);
            if (response?.success) {
                const data = response.data;
                const setCourseFormData = {
                    ...courseLandingInitialFormData,
                    ...data,
                    pricing: {
                        standard: String(data.pricing?.standard || ''),
                        premium: String(data.pricing?.premium || ''),
                        discountNote: data.pricing?.discountNote || '',
                        gstNote: data.pricing?.gstNote || '',
                        bonuses: Array.isArray(data.pricing?.bonuses) ? data.pricing.bonuses : [],
                    },
                };
                setCourseLandingFormData(setCourseFormData);
                setCourseLandingFormData(setCourseFormData);
                setCourseCurriculumFormData(data.curriculum ?? getEmptyCurriculum());
            } else {
                toast.error("Failed to load course details.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Error loading course details.");
        } finally {
            setIsLoading(false);
        }
    }

    // Create or update course submit handler
    async function handleCreateCourse() {
        if (!validateFormData()) {
            toast.error("Please fill all fields and have at least one free preview lecture.");
            return;
        }

        setIsSubmitting(true);

        try {
            let existingCourseData = {};
            if (currentEditedCourseId !== null) {
                const response = await fetchInstructorCourseDetailsService(currentEditedCourseId);
                if (response?.success) {
                    existingCourseData = response.data || {};
                }
            }

            const courseFinalFormData = {
                ...existingCourseData,
                ...courseLandingFormData,
                curriculum: courseCurriculumFormData,
                isPublished: true,
                date: new Date(),
                instructorName: "GoSkilled",
            };

            const response =
                currentEditedCourseId !== null
                    ? await updateCourseByIdService(currentEditedCourseId, courseFinalFormData)
                    : await addNewCourseService(courseFinalFormData);

            if (response?.success) {
                toast.success("Course saved successfully!");
                setCourseLandingFormData(courseLandingInitialFormData);
                setCourseCurriculumFormData(courseCurriculumInitialFromData);
                setCurrentEditedCourseId(null);
                fetchAdminAllCourses();
                navigate(-1);
            } else {
                toast.error(response?.message || "Failed to save course.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Internal server error.");
        } finally {
            setIsSubmitting(false);
        }
    }

    // Cancel and reset form handler
    function handleCancel() {
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(getEmptyCurriculum());
        setCurrentEditedCourseId(null);
        navigate("/dashboard/courses");
    }

    // Sync currentEditedCourseId with route param courseId
    useEffect(() => {
        async function fetchCourseDetails() {
            if (params?.courseId) {
                try {
                    setCurrentEditedCourseId(params.courseId);
                } catch (error) {
                    console.error('Failed to fetch course details:', error);
                }
            } else {
                setCurrentEditedCourseId(null);
            }
        }

        fetchCourseDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.courseId]);

    // Fetch course details when editing a course
    useEffect(() => {
        if (currentEditedCourseId !== null) {
            fetchCurrentCourseDetails();
        } else {
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(getEmptyCurriculum());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentEditedCourseId]);

    return (
        <section className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold tracking-tight">
                    {currentEditedCourseId ? "Edit Course" : "Create a New Course"}
                </h1>
                <div className="flex gap-3">
                    <Button onClick={handleCancel} disabled={isSubmitting || isLoading}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!validateFormData() || isSubmitting || isLoading}
                        onClick={handleCreateCourse}
                        className="text-sm font-semibold px-6 py-2"
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </div>

            <Card className="shadow-md">
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="p-6 space-y-4 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-1/3" />
                            <div className="h-40 bg-gray-200 rounded" />
                            <div className="h-6 bg-gray-200 rounded w-1/4" />
                            <div className="h-6 bg-gray-200 rounded w-1/2" />
                        </div>
                    ) : (
                        <Tabs defaultValue="curriculum" className="w-full">
                            <TabsList className="flex gap-8 border-b">
                                <TabsTrigger value="curriculum">Lectures</TabsTrigger>
                                <TabsTrigger value="course-landing-page">Course Details</TabsTrigger>
                                <TabsTrigger value="extra-details">Extra Details</TabsTrigger>
                            </TabsList>

                            <TabsContent value="curriculum" className="p-4">
                                <CourseCurriculum />
                            </TabsContent>
                            <TabsContent value="course-landing-page" className="p-4">
                                <CourseLandingForm />
                            </TabsContent>
                            <TabsContent value="extra-details" className="p-4">
                                <ExtraDetailsForm />
                            </TabsContent>
                        </Tabs>
                    )}
                </CardContent>
            </Card>
        </section>
    );
}
