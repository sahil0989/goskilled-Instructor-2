import { useRef, useState, useCallback } from "react";
import { useInstructor } from "../../../context/instructor-context/InstructorContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../../@/components/ui/card";
import { Input } from "../../../@/components/ui/input";
import { Label } from "../../../@/components/ui/label";
import { Textarea } from "../../../@/components/ui/textarea";
import { Button } from "../../../@/components/ui/button";
import MediaProgressbar from "../../media-progress-bar/media-progress";
import {
  mediaUploadService,
  mediaPhotoDeleteService,
} from "../../../services";
import { toast } from "sonner";

function CourseLandingForm() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useInstructor();

  const [showImageModal, setShowImageModal] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const inputValue = type === "checkbox" ? checked : value;

      setCourseLandingFormData((prev) => {
        if (name.includes(".")) {
          const keys = name.split(".");
          const [firstKey, secondKey] = keys;

          return {
            ...prev,
            [firstKey]: {
              ...prev[firstKey],
              [secondKey]: inputValue,
            },
          };
        }

        // Handle regular fields
        return {
          ...prev,
          [name]: inputValue,
        };
      });
    },
    [setCourseLandingFormData]
  );

  // Handle image upload with progress
  const handleImageUploadChange = useCallback(
    async (event) => {
      const selectedImage = event.target.files?.[0];
      if (!selectedImage) return;

      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        setMediaUploadProgressPercentage(0);

        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );

        if (response?.success) {
          setCourseLandingFormData((prev) => ({
            ...prev,
            image: response.data.url,
            imagePublicId: response.data.public_id,
          }));
          toast.success("Image uploaded successfully");
          // Reset input so same file can be reselected
          event.target.value = "";
        } else {
          toast.error("Failed to upload image");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error uploading image");
      } finally {
        setMediaUploadProgress(false);
      }
    },
    [setCourseLandingFormData, setMediaUploadProgress, setMediaUploadProgressPercentage]
  );

  // Replace image - delete existing one then open file dialog
  const handleReplaceImage = useCallback(async () => {
    const publicId = courseLandingFormData?.imagePublicId;

    if (publicId) {
      try {
        const res = await mediaPhotoDeleteService(publicId);
        if (res?.success) {
          setCourseLandingFormData((prev) => ({
            ...prev,
            image: "",
            imagePublicId: "",
          }));
          fileInputRef.current?.click();
        } else {
          toast.error("Failed to delete previous image");
        }
      } catch (error) {
        toast.error("Error deleting image");
      }
    } else {
      fileInputRef.current?.click();
    }
  }, [courseLandingFormData?.imagePublicId, setCourseLandingFormData]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Course Landing Page</CardTitle>
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
          <form className="space-y-6" noValidate>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter a title"
                onChange={handleChange}
                value={courseLandingFormData?.title || ""}
                required
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                name="subtitle"
                type="text"
                placeholder="Enter a subtitle"
                onChange={handleChange}
                value={courseLandingFormData?.subtitle || ""}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Enter a description"
                onChange={handleChange}
                value={courseLandingFormData?.description || ""}
                required
              />
            </div>

            {/* Pricing */}
            <div className="space-y-2 flex flex-col md:flex-row gap-5 items-center">
              <div className=" w-full">
                <Label htmlFor="pricing">Skill Builder Price</Label>
                <Input
                  id="pricing"
                  name="pricing.standard"
                  type="number"
                  min="0"
                  placeholder="Enter a price"
                  onChange={handleChange}
                  value={courseLandingFormData?.pricing?.standard || ""}
                  required
                />
              </div>
              <div className=" w-full">
                <Label htmlFor="pricing">Carrer Booster Price</Label>
                <Input
                  id="pricing"
                  name="pricing.premium"
                  type="number"
                  min="0"
                  placeholder="Enter a price"
                  onChange={handleChange}
                  value={courseLandingFormData?.pricing?.premium || ""}
                  required
                />
              </div>
            </div>

            {/* Objectives */}
            <div className="space-y-2">
              <Label htmlFor="objectives">Objectives</Label>
              <Textarea
                id="objectives"
                name="objectives"
                placeholder="Enter objectives"
                onChange={handleChange}
                value={courseLandingFormData?.objectives || ""}
                required
              />
            </div>

            {/* Welcome Message */}
            <div className="space-y-2">
              <Label htmlFor="welcomeMessage">Welcome Message</Label>
              <Textarea
                id="welcomeMessage"
                name="welcomeMessage"
                placeholder="Enter a welcome message"
                onChange={handleChange}
                value={courseLandingFormData?.welcomeMessage || ""}
                required
              />
            </div>

            {/*
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                name="category"
                className="w-full p-2 border rounded-md"
                onChange={handleChange}
                value={courseLandingFormData?.category || ""}
                required
              >
                <option value="">Select category</option>
                <option value="AI & Automation">AI & Automation</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Business">Business</option>
              </select>
            </div> */}

            {/* Plan */}
            {/* <div className="space-y-2">
              <Label htmlFor="plan">Course Plan</Label>
              <select
                id="plan"
                name="plan"
                className="w-full p-2 border rounded-md"
                onChange={handleChange}
                value={courseLandingFormData?.plan || ""}
                required
              >
                <option value="">Select plan</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
              </select>
            </div> */}

            {/* Bonus Included */}
            <div className="flex items-center gap-2">
              <input
                id="bonusIncluded"
                name="bonusIncluded"
                type="checkbox"
                checked={courseLandingFormData?.bonusIncluded || false}
                onChange={handleChange}
              />
              <Label htmlFor="bonusIncluded" className="text-sm">
                Include AI Bonus Pack
              </Label>
            </div>

            {/* Is Taxable */}
            <div className="flex items-center gap-2">
              <input
                id="isTaxable"
                name="isTaxable"
                type="checkbox"
                checked={courseLandingFormData?.isTaxable || false}
                onChange={handleChange}
              />
              <Label htmlFor="isTaxable" className="text-sm">
                Apply GST After ₹20L Limit
              </Label>
            </div>

            {/* Image Upload */}
            <div className="space-y-3 pt-4">
              <Label>Course Image</Label>

              {!courseLandingFormData?.image ? (
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUploadChange}
                  aria-label="Upload course image"
                  disabled={mediaUploadProgress}
                />
              ) : (
                <div className="flex flex-wrap gap-4 items-center">
                  <Button
                    onClick={handleReplaceImage}
                    type="button"
                    disabled={mediaUploadProgress}
                  >
                    Replace Image
                  </Button>
                  <Button
                    onClick={() => setShowImageModal(true)}
                    type="button"
                    variant="outline"
                  >
                    View Image
                  </Button>
                </div>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-image-modal-title"
        >
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-xl w-full relative">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-2 right-2 text-black"
              aria-label="Close image modal"
            >
              ✕
            </button>
            <img
              src={courseLandingFormData.image}
              alt="Course Preview"
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseLandingForm;
