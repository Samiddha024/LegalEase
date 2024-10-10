import React from 'react'
import { ArrowRightIcon, ScaleIcon, BookOpenIcon, UsersIcon } from '@heroicons/react/24/outline'
import Header from './Header'
import Footer from './Footer'
export default function About() {
  return (
    <>
    <Header ></Header>
    <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-6 text-gray-600 md:px-12 xl:px-6">
        <div className="space-y-6 md:space-y-0 md:flex md:gap-6 lg:items-center lg:gap-12">
          <div className="md:w-5/12 lg:w-5/12">
            <img
              src="/placeholder.svg?height=600&width=600"
              alt="LegalEase Team"
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <div className="md:w-7/12 lg:w-6/12">
            <h2 className="text-3xl text-gray-900 font-bold md:text-4xl mb-4">
              Empowering Justice, Simplifying Law
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              At LegalEase, we believe that access to justice should be simple, transparent, and within reach for everyone. Our team of dedicated legal professionals is committed to demystifying the law and providing innovative solutions to complex legal challenges.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { icon: ScaleIcon, text: "Expert Counsel" },
                { icon: BookOpenIcon, text: "Continuous Learning" },
                { icon: UsersIcon, text: "Client-Centric" },
                { icon: ArrowRightIcon, text: "Forward-Thinking" },
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-700">
                  <item.icon className="h-6 w-6 text-blue-600" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 mb-8">
              Founded in 2010, LegalEase has grown from a small practice to a leading legal services provider. Our success is built on a foundation of trust, expertise, and a genuine commitment to our clients' needs. We're not just lawyers; we're partners in your legal journey.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
              Meet Our Team
            </button>
          </div>
        </div>
      </div>
    </div>
    <Footer></Footer>
    </>
  )
}