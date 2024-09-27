"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Phone, Mail, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";
import emailjs from "emailjs-com";

emailjs.init("T9m-zKoD43Ku270JO");

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the email parameters
    const templateParams = {
      name: name,
      email: email,
      message: message,
    };

    // Replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', and 'YOUR_USER_ID' with actual values
    emailjs.send("service_dp4bwll", "template_7fzfmes", templateParams).then(
      (response) => {
        console.log("SUCCESS!", response.status, response.text);
        alert("Thanks for your message! We'll get back to you soon!");
      },
      (error) => {
        console.error("FAILED...", error);
        alert("Failed to send message. Please try again.");
      }
    );

    // Clear form fields after submission
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <motion.h1
          className="text-4xl font-bold text-center mb-8 text-indigo-600 dark:text-indigo-400"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Contact Us
        </motion.h1>

        <div className="flex flex-col md:flex-row gap-8">
          <motion.div
            className="w-full md:w-1/2 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">
              Send Us a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows="4"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                ></textarea>
              </div>
              <motion.button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-full hover:bg-indigo-700 transition duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Send className="inline mr-2" size={18} />
                Send Message
              </motion.button>
            </form>
          </motion.div>

          <motion.div
            className="w-full md:w-1/2 space-y-6"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-yellow-100 dark:bg-yellow-900 rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-yellow-800 dark:text-yellow-200">
                Fun Facts About Us
              </h2>
              <ul className="list-disc list-inside space-y-2 text-yellow-700 dark:text-yellow-300">
                <li>Our 'Word Wall' grows with every new sound we learn!</li>
                <li>Our rhyming chain record: 15 words! Can you top it?</li>
                <li>
                  Our classroom mascot 'Soundy the Owl' helps spot tricky words.
                </li>
              </ul>
            </div>

            <div className="bg-green-100 dark:bg-green-900 rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-green-800 dark:text-green-200">
                Get in Touch
              </h2>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <Phone className="mr-2 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300">
                    +918178448183
                  </span>
                </li>
                <li className="flex items-center">
                  <Mail className="mr-2 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300">
                    phonicsjoy.business@gmail.com
                  </span>
                </li>
                <li className="flex items-center">
                  <MapPin className="mr-2 text-green-600 dark:text-green-400" />
                  <span className="text-green-700 dark:text-green-300">
                    Delhi, India
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-100 dark:bg-blue-900 rounded-3xl shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-blue-800 dark:text-blue-200">
                Our Office Mascot
              </h2>
              <div className="flex items-center justify-center">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <span className="text-6xl">🐶</span>
                </motion.div>
                <p className="ml-4 text-blue-700 dark:text-blue-300">
                  Meet Phonics, our lovable office dog!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
