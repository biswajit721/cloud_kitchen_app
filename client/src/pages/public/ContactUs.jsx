import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import api from "../../services/api"

const ContactUs = () => {
    const url = import.meta.env.VITE_BACKEND_URL;

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await api.post(`/contact/add`, formData);

            if (res.data.success) {
                setSuccess("Message sent successfully!");
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    message: "",
                });
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-6 py-12">
            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-10 bg-white shadow-2xl rounded-3xl overflow-hidden">

                {/* Left Section - Contact Info */}
                <div className="bg-indigo-600 text-white p-10 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                    <p className="mb-8 text-indigo-100">
                        Have questions? We'd love to hear from you. Send us a message and
                        we'll respond as soon as possible.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Mail />
                            <span>support@example.com</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Phone />
                            <span>+91 98765 43210</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <MapPin />
                            <span>India</span>
                        </div>
                    </div>
                </div>

                {/* Right Section - Form */}
                <div className="p-10">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        Send a Message
                    </h2>

                    {success && (
                        <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
                            {success}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />

                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />

                        <textarea
                            name="message"
                            rows="4"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        ></textarea>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition duration-300"
                        >
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
