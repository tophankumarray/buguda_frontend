// @ts-nocheck
import React from "react";

const ContactDetailsModal = ({
  show,
  contactData,
  handleContactChange,
  handleContactSubmit,
  handleContactCancel,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);

  if (!show) return null;

  const handleEdit = () => {
    console.log("Edit button clicked, setting isEditing to true");
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    console.log("Submit button clicked, calling handleContactSubmit");
    e.preventDefault();
    await handleContactSubmit(e);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    handleContactCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-linear-to-r from-emerald-500 to-teal-500 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">CONTACT DETAILS</h2>
            <button
              onClick={handleContactCancel}
              className="text-white hover:text-gray-200 text-2xl font-bold transition-colors"
            >
              ×
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contact Level *
              </label>
              <select
                name="contactLevel"
                value={contactData.contactLevel}
                onChange={handleContactChange}
                required
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="ULB">ULB</option>
                <option value="State">State</option>
                <option value="District">District</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={contactData.state}
                onChange={handleContactChange}
                required
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                District *
              </label>
              <input
                type="text"
                name="district"
                value={contactData.district}
                onChange={handleContactChange}
                required
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City/ULB *
              </label>
              <input
                type="text"
                name="cityULB"
                value={contactData.cityULB}
                onChange={handleContactChange}
                required
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Designation *
              </label>
              <input
                type="text"
                name="designation"
                value={contactData.designation}
                onChange={handleContactChange}
                required
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={contactData.name}
                onChange={handleContactChange}
                required
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Official Mobile *
              </label>
              <input
                type="tel"
                name="officialMobile"
                value={contactData.officialMobile}
                onChange={handleContactChange}
                required
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                It will be used for OTP
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Official Email *
              </label>
              <input
                type="email"
                name="officialEmail"
                value={contactData.officialEmail}
                onChange={handleContactChange}
                required
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                It will be used for OTP
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={contactData.address}
              onChange={handleContactChange}
              rows="2"
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 justify-start">
            <button
              type="button"
              onClick={handleEdit}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isEditing}
            >
              Edit
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-linear-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!isEditing}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 shadow-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactDetailsModal;
