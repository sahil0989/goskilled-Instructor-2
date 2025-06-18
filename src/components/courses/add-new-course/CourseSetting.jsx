import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../@/components/ui/card";
import { Label } from "../../../@/components/ui/label";
import { useInstructor } from "../../../context/instructor-context/InstructorContext";
import { Input } from "../../../@/components/ui/input";
import {
  mediaPhotoDeleteService,
  mediaUploadService,
} from "../../../services";
import MediaProgressbar from "../../media-progress-bar/media-progress";
import { Button } from "../../../@/components/ui/button";

function CourseSetting() {
  const {
    setMediaUploadProgress,
    courseLandingFormData,
    mediaUploadProgress,
    setCourseLandingFormData,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useInstructor();

  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response?.data?.url,
            imagePublicId: response?.data?.public_id,
          });
        }
      } catch (e) {
        console.log(e);
      } finally {
        setMediaUploadProgress(false);
      }
    }
  }

  async function handleReplaceImage() {
    const currentPublicId = courseLandingFormData?.imagePublicId;

    if (currentPublicId) {
      const deleteResponse = await mediaPhotoDeleteService(currentPublicId);

      if (deleteResponse?.success) {
        setCourseLandingFormData({
          ...courseLandingFormData,
          image: "",
          imagePublicId: "",
        });

        fileInputRef.current?.click();
      }
    } else {
      fileInputRef.current?.click();
    }
  }

  const renderSkeleton = () => (
    <div className="space-y-4 animate-pulse">
      <div className="h-6 w-40 bg-gray-300 rounded"></div>
      <div className="h-32 w-full bg-gray-200 rounded"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto md:p-4">
      <Card>
        <CardHeader>
          <CardTitle>Course Settings</CardTitle>
        </CardHeader>

        <div className="px-4 pt-2">
          {mediaUploadProgress && (
            <MediaProgressbar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercentage}
            />
          )}
        </div>

        <CardContent>
          {isLoading ? (
            renderSkeleton()
          ) : courseLandingFormData?.image ? (
            <div className="flex flex-col gap-4">
              <Button onClick={handleReplaceImage} className="w-fit">
                Replace Image
              </Button>
              <div className="w-full overflow-hidden rounded-lg border">
                <img
                  src={courseLandingFormData.image}
                  alt="Course"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Label>Upload Course Image</Label>
              <Input
                ref={fileInputRef}
                onChange={handleImageUploadChange}
                type="file"
                accept="image/*"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CourseSetting;
