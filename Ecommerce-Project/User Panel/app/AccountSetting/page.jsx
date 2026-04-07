"use client";

import {
  useGetPostsQuery,
  useCreatePostsMutation,
} from "../../app/Features/UserApi";

import { useEffect, useState } from "react";
import "./accountSetting.css";
import Image from "next/image";
import { toast } from "react-toastify";

export default function AccountModal({ isOpen, onClose }) {
  const [errorMessage, setErrorMessage] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { data } = useGetPostsQuery();
  const [createPosts] = useCreatePostsMutation();

  const userData = data;

  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    profileImage: "",
  });

  useEffect(() => {
    if (isOpen && userData) {
      setFormData({
        fname: userData.fname || "",
        lname: userData.lname || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        dob: userData.dob ? userData.dob.split("T")[0] : "",
        profileImage: userData.profileImage || "",
      });

      setPreviewImage(userData.profileImage || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOpen,
    userData?.fname,
    userData?.lname,
    userData?.email,
    userData?.phone,
    userData?.address,
    userData?.dob,
    userData?.profileImage,
  ]);

  // Handle Image Change
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 2 * 1024 * 1024;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage({ profileImage: "Unsupported file format" });
      return;
    }

    if (file.size > maxSize) {
      setErrorMessage({ profileImage: "File too large (max 2MB)" });
      return;
    }

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
    setErrorMessage((prev) => ({ ...prev, profileImage: "" }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};
    const nameRegex = /^[A-Za-z]+$/;
    const phoneRegex = /^\d{11}$/;
    const addressRegex = /^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/;
    const address = formData.address.trim();

    if (!address) {
      errors.address = "Address is required";
    } else if (!addressRegex.test(address)) {
      errors.address = "Only one space allowed between words";
    }

    const fname = formData.fname.trim();
    const lname = formData.lname.trim();
    const phone = formData.phone.replace(/\D/g, "");

    if (!nameRegex.test(fname))
      errors.fname = "First name must contain letters only";
    if (!nameRegex.test(lname))
      errors.lname = "Last name must contain letters only";
    if (!phoneRegex.test(phone))
      errors.phone = "Phone number must contain exactly 11 digits";

    setErrorMessage(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      const sendData = new FormData();
      sendData.append("fname", fname);
      sendData.append("lname", lname);
      sendData.append("phone", phone);
      sendData.append("address", formData.address);
      sendData.append("dob", formData.dob);

      if (profileImage) sendData.append("profileImage", profileImage);

      await createPosts(sendData);

      toast.success("Profile Updated Successfully");
      // renderData();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Update Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>

      <div className="modal-wrapper">
        <div className="account-card shadow p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="m-0">Account Settings</h4>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.fname}
                  onChange={(e) => {
                    setFormData({ ...formData, fname: e.target.value });
                    setErrorMessage((prev) => ({ ...prev, fname: "" }));
                  }}
                />
                {errorMessage.fname && (
                  <small className="text-danger">{errorMessage.fname}</small>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.lname}
                  onChange={(e) => {
                    setFormData({ ...formData, lname: e.target.value });
                    setErrorMessage((prev) => ({ ...prev, lname: "" }));
                  }}
                />
                {errorMessage.lname && (
                  <small className="text-danger">{errorMessage.lname}</small>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  readOnly
                  className="form-control"
                  value={formData.email}
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    setErrorMessage((prev) => ({ ...prev, phone: "" }));
                  }}
                />
                {errorMessage.phone && (
                  <small className="text-danger">{errorMessage.phone}</small>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Date of Birth</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.dob}
                  onChange={(e) =>
                    setFormData({ ...formData, dob: e.target.value })
                  }
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    setErrorMessage((prev) => ({ ...prev, address: "" }));
                  }}
                ></textarea>
                {errorMessage.address && (
                  <small className="text-danger">{errorMessage.address}</small>
                )}
              </div>

              <div className="col-12 mb-4 d-flex align-items-center gap-3">
                <Image
                  src={previewImage || "/placeholder.jpg"}
                  alt="Profile Image"
                  width={100}
                  height={100}
                  className="profile-img"
                  unoptimized
                />
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3 mt-4">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
