import { useState, useRef, useCallback } from "react";
import { X, Camera, RotateCcw } from "lucide-react";
import Webcam from "react-webcam";
import api from "../../../api/api";

const CATEGORIES = [
  "Illegal Dumping of C & D Waste",
  "Dead Animals",
  "Practice of Manual Scavenging",
  "Open Defecation",
  "Urination in Public",
  "No Electricity in Public Toilet",
  "Stagnant Water on the Road",
  "Sewerage or Storm Water Overflow",
  "Open Manholes or Drains",
  "Improper Disposal of Faecal Waste or Septage",
  "Cleaning of Sewer",
  "Public Toilet Blockage",
  "Public Toilet Cleaning",
  "Cleaning of Drain",
  "No Water Supply in Public Toilet",
  "Garbage Dump",
  "Dustbins Not Cleaned",
  "Sweeping Not Done",
  "Burning Of Garbage In Open Space",
  "Garbage Vehicle Not Arrived",
  "Cleaning of Garbage from Public Spaces",
  "Cleaning of Street Roads",
  "Door To Door Collection Not Done",
];

export default function ComplaintFormModal({ onClose, onComplaintAdded }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    wardNumber: "",
    area: "",
    category: "",
    description: "",
    photo: null,
  });

  const webcamRef = useRef(null);

  const videoConstraints = {
    width: 480,
    height: 360,
    facingMode: "user",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedPhoto(imageSrc);
      setFormData((prev) => ({ ...prev, photo: imageSrc }));
    }
  }, []);

  const resetForm = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      wardNumber: "",
      area: "",
      category: "",
      description: "",
      photo: null,
    });
    setCapturedPhoto(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("fullName", formData.fullName);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("wardNumber", formData.wardNumber);
      payload.append("area", formData.area);
      payload.append("category", formData.category);
      payload.append("description", formData.description);

      if (formData.photo) {
        const blob = await fetch(formData.photo).then((r) => r.blob());
        const file = new File([blob], "complaint.jpg", {
          type: "image/jpeg",
        });
        payload.append("image", file);
      }

      const res = await api.post("/complaints/createcomplaint", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onComplaintAdded(res.data.data);
      resetForm();
      onClose();
    } catch (err) {
      console.error("Submit failed", err);
      alert("Failed to submit complaint");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-3xl shadow-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-700 text-white p-8 flex items-center justify-between rounded-t-3xl shadow-md">
          <h3 className="text-3xl font-bold">Post a New Complaint</h3>
          <button
            onClick={onClose}
            className="bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-200"
            aria-label="Close complaint form"
          >
            <X className="h-7 w-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-7">
          {/* Full Name */}
          <div>
            <label className="block text-md font-semibold text-gray-800 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:outline-none focus:ring-3 focus:ring-green-500 transition"
              placeholder="Enter your name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-md font-semibold text-gray-800 mb-2">
              Phone Number *
            </label>

            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
              maxLength={10}
              inputMode="numeric"
              className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:outline-none focus:ring-3 focus:ring-green-500 transition"
              placeholder="Enter 10 digit phone number"
            />
          </div>

          {/* Ward + Area */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-md font-semibold text-gray-800 mb-2">
                Ward Number *
              </label>
              <input
                type="text"
                name="wardNumber"
                value={formData.wardNumber}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:outline-none focus:ring-3 focus:ring-green-500 transition"
                placeholder="Enter ward number"
              />
            </div>

            <div>
              <label className="block text-md font-semibold text-gray-800 mb-2">
                Area *
              </label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:outline-none focus:ring-3 focus:ring-green-500 transition"
                placeholder="Enter area/locality"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-md font-semibold text-gray-800 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full rounded-xl border border-gray-300 px-5 py-4 focus:outline-none focus:ring-3 focus:ring-green-500 transition"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-md font-semibold text-gray-800 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full rounded-xl border border-gray-300 px-5 py-4 resize-none focus:outline-none focus:ring-3 focus:ring-green-500 transition"
              placeholder="Describe the issue in detail..."
            />
          </div>

          {/* Camera / Capture area */}
          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center shadow-inner bg-gray-50">
            {!capturedPhoto ? (
              <div>
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  className="rounded-2xl mx-auto mb-6 shadow-lg"
                  mirrored
                />
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl font-semibold shadow-lg hover:from-green-700 hover:to-emerald-800 transition-transform duration-300 transform hover:scale-105 flex items-center justify-center gap-3 mx-auto"
                >
                  <Camera className="h-6 w-6" />
                  Capture Photo
                </button>
              </div>
            ) : (
              <div>
                <img
                  src={capturedPhoto}
                  alt="Captured"
                  className="max-h-64 rounded-2xl mx-auto mb-4 shadow-md border border-gray-300 object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    setCapturedPhoto(null);
                    setFormData((p) => ({ ...p, photo: null }));
                  }}
                  className="px-5 py-2 flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl mx-auto transition-transform duration-300 hover:scale-110 shadow-sm"
                >
                  <RotateCcw className="h-5 w-5" />
                  Retake
                </button>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-6 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-100 font-semibold transition-colors duration-300 shadow-sm"
            //   disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-2xl font-semibold shadow-lg hover:from-green-700 hover:to-emerald-800 transition-transform duration-300 hover:scale-105 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
