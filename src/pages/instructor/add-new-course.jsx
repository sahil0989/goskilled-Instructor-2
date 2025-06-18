import { useEffect, useState } from "react"
import { Button } from "../../@/components/ui/button"
import { Card, CardContent } from "../../@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../@/components/ui/tabs"
import CourseLandingPage from "../../components/courses/add-new-course/course-landing"
import CourseCurriculum from "../../components/courses/add-new-course/CourseCurriculum"
import CourseSetting from "../../components/courses/add-new-course/CourseSetting"
import { useInstructor } from "../../context/instructor-context/InstructorContext"
import { useNavigate, useParams } from "react-router-dom"
import { addNewCourseService, fetchInstructorCourseDetailsService, updateCourseByIdService } from "../../services"
import { courseCurriculumInitialFromData, courseLandingInitialFormData } from "../../config"
import { useAuth } from "../../context/AuthContext"

function AddNewCourse() {
    const {
        courseLandingFormData,
        courseCurriculumFormData,
        setCourseLandingFormData,
        setCourseCurriculumFormData,
        currentEditedCourseId,
        setCurrentEditedCourseId
    } = useInstructor()

    const { fetchAdminAllCourses } = useAuth()
    const navigate = useNavigate()
    const params = useParams()
    const [isLoading, setIsLoading] = useState(false)

    function isEmpty(value) {
        if (Array.isArray(value)) return value.length === 0
        return value === "" || value === null || value === undefined
    }

    function validateFormData() {
        for (const key in courseLandingFormData) {
            if (isEmpty(courseLandingFormData[key])) return false
        }

        let hasFreePreview = false

        for (const item of courseCurriculumFormData) {
            if (isEmpty(item.title) || isEmpty(item.videoUrl) || isEmpty(item.public_id)) {
                return false
            }
            if (item.freePreview) hasFreePreview = true
        }

        return hasFreePreview
    }

    async function handleCreateCourse() {
        let existingCourseData = {}
        if (currentEditedCourseId !== null) {
            const response = await fetchInstructorCourseDetailsService(currentEditedCourseId)
            if (response?.success) {
                existingCourseData = response.data || {}
            }
        }

        const courseFinalFormData = {
            ...existingCourseData,
            ...courseLandingFormData,
            curriculum: courseCurriculumFormData,
            isPublished: true,
            date: new Date(),
            instructorName: "GoSkilled",
        }

        const response =
            currentEditedCourseId !== null
                ? await updateCourseByIdService(currentEditedCourseId, courseFinalFormData)
                : await addNewCourseService(courseFinalFormData)

        if (response?.success) {
            setCourseLandingFormData(courseLandingInitialFormData)
            setCourseCurriculumFormData(courseCurriculumInitialFromData)
            setCurrentEditedCourseId(null)
            navigate(-1)
            fetchAdminAllCourses()
        }

    }

    async function fetchCurrentCourseDetails() {
        setIsLoading(true)
        const response = await fetchInstructorCourseDetailsService(currentEditedCourseId)

        if (response?.success) {
            const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key) => {
                acc[key] = response?.data[key] || courseLandingInitialFormData[key]
                return acc
            }, {})

            setCourseLandingFormData(setCourseFormData)
            setCourseCurriculumFormData(response?.data?.curriculum)
        }

        setIsLoading(false)
    }

    useEffect(() => {
        if (params?.courseId) setCurrentEditedCourseId(params?.courseId)
        // eslint-disable-next-line
    }, [params?.courseId])

    useEffect(() => {
        if (currentEditedCourseId !== null) fetchCurrentCourseDetails()
        // eslint-disable-next-line
    }, [currentEditedCourseId])

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-3">
                <h1 className="text-2xl md:text-3xl font-extrabold">Create a New Course</h1>
                <Button
                    disabled={!validateFormData()}
                    onClick={handleCreateCourse}
                    className="text-sm tracking-wider font-bold px-6"
                >
                    SUBMIT
                </Button>
            </div>

            <Card className="shadow-sm">
                <CardContent>
                    <div className="w-full">
                        {isLoading ? (
                            <div className="space-y-4 p-6">
                                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
                                <div className="h-40 bg-gray-200 rounded animate-pulse" />
                                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4" />
                                <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2" />
                            </div>
                        ) : (
                            <Tabs defaultValue="curriculum" className="w-full space-y-4">
                                <TabsList className="flex flex-nowrap gap-4 p-4">
                                    <TabsTrigger value="curriculum" className="px-4 py-2 rounded-lg">Curriculum</TabsTrigger>
                                    <TabsTrigger value="course-landing-page" className="px-4 py-2 rounded-lg">Course Landing Page</TabsTrigger>
                                    <TabsTrigger value="settings" className="px-4 py-2 rounded-lg">Settings</TabsTrigger>
                                </TabsList>

                                <TabsContent value="curriculum">
                                    <CourseCurriculum />
                                </TabsContent>
                                <TabsContent value="course-landing-page">
                                    <CourseLandingPage />
                                </TabsContent>
                                <TabsContent value="settings">
                                    <CourseSetting />
                                </TabsContent>
                            </Tabs>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddNewCourse
