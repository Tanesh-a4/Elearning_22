// src/Contact.js
import React, { useState } from 'react';

const Contact = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setFormData({ fullName: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="bg-100 p-5 mt-20"> {/* Added mt-10 for margin top */}
            <h2 className="text-4xl font-bold text-teal-600 mb-2 text-center">Contact QuikLearn</h2>
            <p className="text-lg mb-10 text-center">We're here to support your educational journey. Our team is ready to assist with any questions you may have.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                    <h3 className="text-2xl font-semibold text-teal-600 mb-4">Send Us a Message</h3>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 p-3"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 p-3"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 p-3"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-teal-500 focus:ring focus:ring-teal-500 focus:ring-opacity-50 p-3"
                            rows="4"
                        ></textarea>
                    </div>
                    <button type="submit" className="bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition duration-200 shadow-md">Send Message</button>
                </form>

                {/* Contact Information */}
                <div className="bg-white p-8 rounded-lg shadow-lg transition-transform transform hover:scale-105">
                    <h3 className="text-2xl font-semibold text-teal-600 mb-4">Contact Information</h3>
                    <p className="mb-2"><strong>Email Us:</strong> <a href="mailto:support@quiklearn.com" className="text-teal-600 hover:underline">support@quiklearn.com</a></p>
                    <p className="mb-2"><strong>Call Us:</strong> +1 (555) 123-4567</p>
                    <p className="mb-2"><strong>Visit Us:</strong> 123 Learning Avenue, Suite 400, Education City, CA 94103, United States</p>
                    <h4 className="mt-4 font-semibold">Support Hours:</h4>
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 2:00 PM</p>
                    <p>Sunday: Closed</p>
                    <a href="/faq" className="text-teal-600 hover:underline mt-4 inline-block">Visit our FAQ</a>
                </div>
            </div>

            {/* Map Section */}
            <h3 className="text-2xl font-semibold text-teal-600 mt-10">Our Location</h3>
            <div className="mt-4 mb-10">
                <iframe
                    title="QuikLearn Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.305651086046!2d-122.42067918468066!3d37.77492927975988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808bfae4b0d1%3A0xb9c1b8d92d1b1c5f!2s123%20Learning%20Ave%2C%20San%20Francisco%2C%20CA%2094103%2C%20USA!5e0!3m2!1sen!2sus!4v1617292118102!5m2!1sen!2sus"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>

            {/* Additional Contact Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
                    <h4 className="font-semibold text-teal-600">Course Inquiries</h4>
                    <p className="mb-4">Questions about specific courses, curriculum, or learning paths.</p>
                    <a href="mailto:courses@quiklearn.com" className="text-teal-600 hover:underline">courses@quiklearn.com</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
                    <h4 className="font-semibold text-teal-600">Technical Support</h4>
                    <p className="mb-4">Help with platform issues, account access, or technical difficulties.</p>
                    <a href="mailto:support@quiklearn.com" className="text-teal-600 hover:underline">support@quiklearn.com</a>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md text-center transition-transform transform hover:scale-105">
                    <h4 className="font-semibold text-teal-600">Partnerships</h4>
                    <p className="mb-4">Collaboration opportunities, content creation, or business inquiries.</p>
                    <a href="mailto:partners@quiklearn.com" className="text-teal-600 hover:underline">partners@quiklearn.com</a>
                </div>
            </div>
        </div>
    );
};

export default Contact;