/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';

const ContactPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !message) {
            setStatus('error');
            return;
        }
        setStatus('sending');
        // Simulate sending a message
        console.log({ name, email, message });
        setTimeout(() => {
            setStatus('sent');
            setName('');
            setEmail('');
            setMessage('');
        }, 1500);
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-8 animate-fade-in text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-100 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-400 mb-10">We'd love to hear from you! Whether you have a question, feedback, or need support, feel free to reach out.</p>

            <div className="bg-gray-800/80 border border-gray-700/80 rounded-lg p-8 text-left">
                {status === 'sent' ? (
                     <div className="text-center p-8">
                        <h2 className="text-2xl font-bold text-yellow-400">Thank You!</h2>
                        <p className="text-gray-300 mt-2">Your message has been sent. We'll get back to you shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition" required />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Your Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition" required />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                            <textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="w-full bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-yellow-500 focus:outline-none transition resize-none" required></textarea>
                        </div>
                         {status === 'error' && <p className="text-red-400 text-sm -mt-2">Please fill out all fields.</p>}
                        <div>
                            <button type="submit" disabled={status === 'sending'} className="w-full bg-gradient-to-br from-yellow-600 to-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-yellow-500/20 hover:shadow-xl hover:shadow-yellow-500/40 disabled:from-gray-600 disabled:to-gray-500 disabled:cursor-not-allowed">
                                {status === 'sending' ? 'Sending...' : 'Send Message'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
            <p className="text-gray-500 mt-8 text-sm">For support, feedback, or any questions, you can also reach us directly at <a href="mailto:prothumbnailgenerator@gmail.com" className="text-yellow-400 hover:underline">prothumbnailgenerator@gmail.com</a>.</p>
        </div>
    );
};

export default React.memo(ContactPage);