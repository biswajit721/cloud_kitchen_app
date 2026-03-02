import React, { useEffect, useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import api from "../../services/api";

const AdminContact = () => {

    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    // Fetch Contacts
    const fetchContacts = async () => {
        try {
            const res = await api.get(`/contact/get`);
            if (res.data.status) {
                setContacts(res?.data?.contact);
            }
        } catch (error) {
            console.error("Error fetching contacts");
        } finally {
            setLoading(false);
        }
    };

    // Delete Contact
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete?");
        if (!confirmDelete) return;

        try {
            setDeletingId(id);
            await api.delete(`/contact/delete/${id}`);
            setContacts(contacts.filter((item) => item._id !== id));
        } catch (error) {
            console.error("Delete failed");
        } finally {
            setDeletingId(null);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Contact Messages
                        </h1>
                        <p className="text-gray-500 text-sm">
                            Manage all user contact inquiries
                        </p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm font-semibold">
                        {contacts.length} Messages
                    </span>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="animate-spin text-indigo-600" size={40} />
                    </div>
                ) : contacts.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        No contact messages found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Email</th>
                                    <th className="p-4">Phone</th>
                                    <th className="p-4">Message</th>
                                    <th className="p-4 text-center">Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {contacts.map((contact) => (
                                    <tr
                                        key={contact._id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="p-4 font-medium text-gray-700">
                                            {contact.name}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {contact.email}
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            {contact.phone || "—"}
                                        </td>
                                        <td className="p-4 text-gray-600 max-w-xs truncate">
                                            {contact.message}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleDelete(contact._id)}
                                                disabled={deletingId === contact._id}
                                                className="text-red-500 hover:text-red-700 transition"
                                            >
                                                {deletingId === contact._id ? (
                                                    <Loader2
                                                        className="animate-spin mx-auto"
                                                        size={18}
                                                    />
                                                ) : (
                                                    <Trash2 size={18} />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminContact;
