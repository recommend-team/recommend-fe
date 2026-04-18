'use client'
import React, { useState } from 'react';
import CustomInput from '../molecules/CustomInput';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <CustomInput 
        label="Full Name" 
        name="fullName" 
        value={formData.fullName} 
        onChange={handleChange} 
        placeholder="Full name" 
      />
      
      <div className="grid grid-cols-2 gap-4">
        <CustomInput 
          label="Email" 
          type="email" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email" 
        />
        <CustomInput 
          label="Phone Number" 
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(+234) 90 0000 0000" 
        />
      </div>

      <label className="block text-sm font-bold text-gray-800 mb-1">Subject</label>
      <select 
        name="subject" 
        value={formData.subject} 
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-4 bg-white"
      >
        <option value="">Select a topic...</option>
      </select>

      <label className="block text-sm font-bold text-gray-800 mb-1">Your Message</label>
      <textarea 
        name="message"
        value={formData.message}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg mb-6 h-32"
        placeholder="Tell us what's on your mind..."
      />

      <button className="w-full py-4 border-2 border-gray-900 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-colors">
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;