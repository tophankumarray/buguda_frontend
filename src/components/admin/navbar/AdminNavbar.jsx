import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import ContactDetailsModal from "./ContactDetailsModal";
import ChangePasswordModal from "./ChangePasswordModal";
import AdminNavbarContent from "./AdminNavbarContent";
import api from './../../../api/api';

const AdminNavbar = ({ onMenuClick }) => {
  /* ===================== UI STATES ===================== */
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  /* ===================== NOTIFICATIONS ===================== */
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [allComplaints, setAllComplaints] = useState([]);
  const [prevCount, setPrevCount] = useState(0);

  const [readIds, setReadIds] = useState(() =>
    JSON.parse(localStorage.getItem("readNotifications") || "[]"),
  );

  /* ===================== CONTACT ===================== */
  const [contactData, setContactData] = useState({
    contactLevel: "ULB",
    state: "ODISHA",
    district: "BUGUDA",
    cityULB: "BUGUDA (NAC)",
    designation: "",
    name: "",
    officialMobile: "",
    officialEmail: "",
    officialLandline: "",
    whatsappNumber: "",
    personalEmail: "",
    personalPhone: "",
    address: "NAC,BUGUDA",
    twitter: "",
    facebook: "",
    instagram: "",
    linkedIn: "",
  });

  /* ===================== PASSWORD ===================== */
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrent: false,
    showNew: false,
    showConfirm: false,
  });

  /* ===================== FETCH NOTIFICATIONS ===================== */
  const fetchNotifications = useCallback(async () => {
    try {
      const [complaintsRes, machineryRes] = await Promise.all([
        api.get("/complaints/allcomplaints"),
        api.get("/machinery-defects/all-machinery-defects"),
      ]);

      const complaints = complaintsRes.data?.data || [];
      const machineryDefects = machineryRes.data?.data || [];

      setAllComplaints(complaints);

      const citizenNotifications = complaints
        .filter(
          (c) =>
            c.status !== "Resolved" && !readIds.includes(`citizen:${c._id}`),
        )
        .map((c) => ({
          key: `citizen:${c._id}`,
          id: c._id,
          type: "citizen",
          subject: Array.isArray(c.category)
            ? c.category.join(", ")
            : c.category,
          name: c.fullName,
          cityULB: `${c.area}, Ward ${c.wardNumber}`,
          priority: "medium",
          createdAt: c.createdAt,
        }));

      const machineryNotifications = machineryDefects
        .filter(
          (m) =>
            m.status !== "Resolved" && !readIds.includes(`machinery:${m._id}`),
        )
        .map((m) => ({
          key: `machinery:${m._id}`,
          id: m._id,
          type: "machinery",
          subject: m.issueType || "Machinery Defect",
          name: m.vehicleNumber || "Vehicle",
          cityULB: m.location || "N/A",
          priority: m.severity === "High" ? "high" : "medium",
          createdAt: m.createdAt,
        }));

      const merged = [...citizenNotifications, ...machineryNotifications]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

      setNotifications(merged);
      setUnreadCount(merged.length);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  }, [readIds]);

  /* ===================== POLLING ===================== */
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  /* ===================== TOAST ON NEW ===================== */
  useEffect(() => {
    if (notifications.length > prevCount) {
      const latest = notifications[0];
      toast.info(
        `🔔 New ${
          latest.type === "machinery" ? "Machinery Defect" : "Complaint"
        }: ${latest.subject}`,
        { toastId: `notif-${latest.key}` },
      );
    }
    setPrevCount(notifications.length);
  }, [notifications, prevCount]);

  /* ===================== HANDLERS ===================== */
  const handleContactChange = (e) =>
    setContactData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handlePasswordChange = (e) =>
    setPasswordData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleContactSubmit = (e) => {
    e.preventDefault();
    toast.success("Contact details updated successfully!");
    setShowContactModal(false);
  };

  /* ===================== 🔥 CHANGE PASSWORD LOGIC ===================== */
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      const res = await api.post(
        "/admin/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          withCredentials: true,
        },
      );

      toast.success(res.data.message || "Password changed successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrent: false,
        showNew: false,
        showConfirm: false,
      });

      setShowPasswordModal(false);
      setShowUserMenu(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to change password",
      );
    }
  };

  const handleContactCancel = () => {
    setShowContactModal(false);
    setShowUserMenu(false);
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setShowUserMenu(false);
  };

  /* ===================== JSX ===================== */
  return (
    <nav className="bg-linear-to-r from-emerald-500 via-emerald-600 to-teal-600 shadow-lg fixed top-0 right-0 left-0 lg:left-64 z-40 h-16">
      <AdminNavbarContent
        onMenuClick={onMenuClick}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        unreadCount={unreadCount}
        notifications={notifications}
        allComplaints={allComplaints}
        showUserMenu={showUserMenu}
        setShowUserMenu={setShowUserMenu}
        setShowContactModal={setShowContactModal}
        setShowPasswordModal={setShowPasswordModal}
      />

      {showContactModal && (
        <ContactDetailsModal
          show={showContactModal}
          contactData={contactData}
          handleContactChange={handleContactChange}
          handleContactSubmit={handleContactSubmit}
          handleContactCancel={handleContactCancel}
        />
      )}

      {showPasswordModal && (
        <ChangePasswordModal
          show={showPasswordModal}
          passwordData={passwordData}
          setPasswordData={setPasswordData}
          handlePasswordChange={handlePasswordChange}
          handlePasswordSubmit={handlePasswordSubmit}
          handlePasswordCancel={handlePasswordCancel}
        />
      )}
    </nav>
  );
};

export default AdminNavbar;
