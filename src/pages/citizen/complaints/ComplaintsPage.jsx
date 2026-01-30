import React, { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import ComplaintFormModal from "./ComplaintFormModal";
import api from "../../../api/api";

export default function ComplaintsPage() {
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaints, setComplaints] = useState([]);

  // LOAD ALL COMPLAINTS
  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const res = await api.get("/complaints/allcomplaints");
        setComplaints(res.data.data || []);
      } catch (err) {
        console.error("Error loading complaints", err);
      }
    };
    loadComplaints();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "In Progress":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysOpen = (dateISO) => {
    const created = new Date(dateISO);
    const now = new Date();
    return Math.ceil(Math.max(0, now - created) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-50">
      <main className="container mx-auto px-6 py-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-4xl font-extrabold">
                  Welcome to the Citizen Dashboard
                </h2>
                <p className="text-green-200 mt-3 max-w-3xl">
                  Monitor complaints and help keep our city clean. Capture and
                  submit issues in real time!
                </p>
              </div>

              <button
                onClick={() => setShowComplaintForm(true)}
                className="mt-6 md:mt-0 bg-white text-green-700 font-semibold py-4 px-8 rounded-2xl flex items-center gap-3 shadow-lg hover:scale-105 transition"
              >
                <Camera className="h-6 w-6" />
                Post a Complaint
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-10">
            <h3 className="text-2xl font-bold mb-6">Complaint Summary</h3>

            {/* EMPTY STATE */}
            {complaints.length === 0 && (
              <div className="border-2 border-dashed rounded-2xl p-16 text-center">
                <Camera className="h-14 w-14 text-green-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold mb-2">
                  No complaints submitted yet
                </h4>
                <p className="text-gray-600 max-w-md mx-auto">
                  Capture an image and post your first complaint to help keep
                  the environment clean.
                </p>
              </div>
            )}

            {/* COMPLAINT LIST */}
            {complaints.map((complaint) => {
              const daysOpen = getDaysOpen(complaint.createdAt);

              return (
                <div
                  key={complaint._id}
                  className="border rounded-2xl p-6 mb-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex flex-col md:flex-row md:justify-between gap-6">
                    {/* LEFT CONTENT */}
                    <div>
                      <h4 className="text-xl font-bold">
                        {complaint.fullName}{" "}
                        <span className="text-sm text-gray-400">
                          #{complaint._id.slice(-6)}
                        </span>
                      </h4>

                      <p className="text-gray-700 mt-1">
                        📞 {complaint.phoneNumber}
                      </p>

                      {/* ✅ ADDED – THIS WAS MISSING */}
                      <p className="text-gray-700 mt-1">
                        📍 Area: {complaint.area} | Ward: {complaint.wardNumber}
                      </p>

                      <p className="text-gray-600 mt-1">
                        🗂 {complaint.category} |{" "}
                        {new Date(complaint.createdAt).toLocaleString("en-IN")}
                      </p>

                      <p className="mt-3 text-gray-800">
                        {complaint.description}
                      </p>

                      <div
                        className={`inline-block mt-4 px-5 py-1 rounded-full border text-sm ${getStatusColor(
                          complaint.status,
                        )}`}
                      >
                        {complaint.status}
                      </div>

                      <p className="mt-2 text-sm text-gray-500">
                        Days Open: {daysOpen} day
                        {daysOpen !== 1 ? "s" : ""}
                      </p>
                    </div>

                    {/* IMAGE */}
                    {complaint.image && (
                      <img
                        src={`http://localhost:5900/${complaint.image}`}
                        alt="Complaint"
                        className="w-48 h-32 object-cover rounded-xl"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* POST COMPLAINT MODAL */}
      {showComplaintForm && (
        <ComplaintFormModal
          onClose={() => setShowComplaintForm(false)}
          onComplaintAdded={(newComplaint) =>
            setComplaints((prev) => [newComplaint, ...prev])
          }
        />
      )}
    </div>
  );
}
