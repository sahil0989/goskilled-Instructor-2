import React from 'react'
import { useInstructor } from '../../../context/instructor-context/InstructorContext'
import { Card, CardContent, CardHeader, CardTitle } from '../../../@/components/ui/card';
import { Button } from '../../../@/components/ui/button';
import { Input } from '../../../@/components/ui/input';
import { Switch } from '../../../@/components/ui/switch';
import { Label } from '../../../@/components/ui/label';
import { courseCurriculumInitialFromData } from '../../../config';
import { mediaDeleteService, mediaUploadService } from '../../../services';
import MediaProgressbar from '../../media-progress-bar/media-progress';
import VideoPlayer from '../../video-player/video-player';

function SkeletonCard() {
    return (
        <div className="border p-5 rounded-md animate-pulse space-y-4 bg-white shadow">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-10 bg-gray-200 rounded w-full" />
            <div className="h-5 bg-gray-200 rounded w-1/5" />
            <div className="h-48 bg-gray-200 rounded w-full" />
        </div>
    );
}

function CourseCurriculum() {
    const {
        mediaUploadProgress,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        setMediaUploadProgress,
        mediaUploadProgressPercentage,
        setMediaUploadProgressPercentage
    } = useInstructor();

    const handleNewLecture = () => {
        setCourseCurriculumFormData([
            ...courseCurriculumFormData,
            { ...courseCurriculumInitialFromData[0] }
        ]);
    };

    const handleCourseTitleChange = (event, currentIndex) => {
        const cpy = [...courseCurriculumFormData];
        cpy[currentIndex].title = event.target.value;
        setCourseCurriculumFormData(cpy);
    };

    const handleFreePreviewChange = (value, currentIndex) => {
        const cpy = [...courseCurriculumFormData];
        cpy[currentIndex].freePreview = value;
        setCourseCurriculumFormData(cpy);
    };

    const handleSingleLectureUpload = async (event, currentIndex) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const videoFormData = new FormData();
            videoFormData.append("file", selectedFile);
            try {
                setMediaUploadProgress(true);
                const response = await mediaUploadService(videoFormData, setMediaUploadProgressPercentage);
                if (response.success) {
                    const cpy = [...courseCurriculumFormData];
                    cpy[currentIndex] = {
                        ...cpy[currentIndex],
                        videoUrl: response.data.url,
                        public_id: response.data.public_id
                    };
                    setCourseCurriculumFormData(cpy);
                }
            } catch (err) {
                console.log(err.message);
            } finally {
                setMediaUploadProgress(false);
            }
        }
    };

    const handleReplaceVideo = async (currentIndex) => {
        const cpy = [...courseCurriculumFormData];
        const publicId = cpy[currentIndex].public_id;
        const response = await mediaDeleteService(publicId);
        if (response.success) {
            cpy[currentIndex].videoUrl = "";
            cpy[currentIndex].public_id = "";
            setCourseCurriculumFormData(cpy);
        }
    };

    const handleDeleteLecture = async (currentIndex) => {
        const cpy = [...courseCurriculumFormData];
        const publicId = cpy[currentIndex].public_id;
        const response = await mediaDeleteService(publicId);
        if (response.success) {
            setCourseCurriculumFormData(cpy.filter((_, i) => i !== currentIndex));
        }
    };

    function isCourseCurriculumFormDataValid() {
        return courseCurriculumFormData.every(
            (item) => item.title.trim() !== "" && item.videoUrl.trim() !== ""
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
                <Button
                    disabled={!isCourseCurriculumFormDataValid() || mediaUploadProgress}
                    onClick={handleNewLecture}
                    className="mb-4"
                >
                    Add Lecture
                </Button>

                {mediaUploadProgress && (
                    <MediaProgressbar
                        isMediaUploading={mediaUploadProgress}
                        progress={mediaUploadProgressPercentage}
                    />
                )}

                <div className="mt-4 space-y-6">
                    {mediaUploadProgress && <SkeletonCard />}

                    {courseCurriculumFormData?.map((item, index) => (
                        <div key={index} className="border p-5 rounded-md space-y-4 shadow-md bg-white">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <h3 className="font-semibold whitespace-nowrap">Lecture {index + 1}</h3>
                                <Input
                                    type="text"
                                    placeholder="Enter a lecture title"
                                    className="w-full md:w-1/2"
                                    value={item.title}
                                    onChange={(e) => handleCourseTitleChange(e, index)}
                                />
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        onCheckedChange={(value) => handleFreePreviewChange(value, index)}
                                        checked={item.freePreview}
                                        id={`freePreview-${index}`}
                                    />
                                    <Label htmlFor={`freePreview-${index}`}>Free Preview</Label>
                                </div>
                            </div>

                            <Card className="bg-gray-50">
                                {item.videoUrl ? (
                                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                        <VideoPlayer
                                            url={item.videoUrl}
                                            width="100%"
                                            height="200px"
                                        />
                                        <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                                            <Button onClick={() => handleReplaceVideo(index)}>Replace Video</Button>
                                            <Button
                                                onClick={() => handleDeleteLecture(index)}
                                                className="bg-red-600 hover:bg-red-700 text-white"
                                            >
                                                Delete Lecture
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <Input
                                        type="file"
                                        accept="video/*"
                                        className="w-full"
                                        onChange={(e) => handleSingleLectureUpload(e, index)}
                                    />
                                )}
                            </Card>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default CourseCurriculum;
