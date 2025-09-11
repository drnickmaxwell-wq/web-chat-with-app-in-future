// app/treatments/[treatment]/page.tsx
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Interactive3DDentalViewer } from '@/components/3d/advanced-tooth-viewer';
import { GlassMorphismCard, LayeredGlassCard } from '@/components/effects/glass-morphism';
import { SparkleButton } from '@/components/effects/sparkle-buttons';
import { CoastalParticles } from '@/components/effects/coastal-particles';
import { WebGLWaveEffects } from '@/components/effects/webgl-wave-effects';

interface TreatmentPageProps {
  params: {
    treatment: string;
  };
}

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const treatmentData = {
  'dental-implants': {
    title: 'Dental Implants',
    subtitle: 'Permanent tooth replacement with titanium implants',
    heroImage: '/images/treatments/implants-hero.jpg',
    modelType: 'implant' as const,
    price: 'From £2,500',
    duration: '2-6 months',
    description: 'Our advanced dental implant procedures use the latest 3D technology to provide you with permanent, natural-looking tooth replacements.',
    benefits: [
      'Permanent solution',
      'Natural appearance',
      'Preserves jawbone',
      'No impact on adjacent teeth',
      'Long-lasting results'
    ],
    process: [
      'Initial consultation and 3D scanning',
      'Treatment planning with AI assistance',
      'Implant placement surgery',
      'Healing period (3-6 months)',
      'Crown attachment',
      'Follow-up care'
    ]
  },
  'porcelain-veneers': {
    title: 'Porcelain Veneers',
    subtitle: 'Transform your smile with custom porcelain veneers',
    heroImage: '/images/treatments/veneers-hero.jpg',
    modelType: 'veneer' as const,
    price: 'From £800',
    duration: '2-3 weeks',
    description: 'Ultra-thin porcelain shells that are bonded to the front of your teeth to create a perfect smile.',
    benefits: [
      'Instant smile transformation',
      'Stain-resistant material',
      'Natural appearance',
      'Minimal tooth preparation',
      'Long-lasting results'
    ],
    process: [
      'Smile design consultation',
      '3D digital planning',
      'Minimal tooth preparation',
      'Temporary veneers',
      'Custom veneer creation',
      'Final bonding and polishing'
    ]
  }
};

const faqData: FAQItem[] = [
  {
    question: 'How long do dental implants last?',
    answer: 'With proper care, dental implants can last 25+ years or even a lifetime. They have a success rate of over 95%.',
    category: 'durability'
  },
  {
    question: 'Is the implant procedure painful?',
    answer: 'The procedure is performed under local anesthesia, so you won\'t feel pain during surgery. Post-operative discomfort is typically mild and manageable with over-the-counter pain medication.',
    category: 'comfort'
  },
  {
    question: 'How much do dental implants cost?',
    answer: 'Costs vary depending on the complexity of your case. We offer consultation to provide accurate pricing and discuss payment options.',
    category: 'cost'
  },
  {
    question: 'Am I a candidate for dental implants?',
    answer: 'Most adults with good oral health are candidates. We\'ll assess your bone density, gum health, and overall medical condition during consultation.',
    category: 'eligibility'
  }
];

export default function TreatmentPage({ params }: TreatmentPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  
  const treatment = treatmentData[params.treatment as keyof typeof treatmentData];
  
  if (!treatment) {
    return <div>Treatment not found</div>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <WebGLWaveEffects 
        intensity="medium" 
        speed="medium" 
        colors={['#C2185B', '#40C4B4', '#D4AF37']}
        className="fixed inset-0 z-0"
      />
      <CoastalParticles 
        particleCount={60}
        colors={['#C2185B40', '#40C4B440', '#D4AF3740']}
        className="fixed inset-0 z-5"
      />

      {/* Hero Section with 3D Viewer */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <GlassMorphismCard className="p-8">
                <motion.h1 
                  className="text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-teal-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {treatment.title}
                </motion.h1>
                <motion.p 
                  className="text-xl text-gray-700 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {treatment.subtitle}
                </motion.p>
                <motion.p 
                  className="text-gray-600 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  {treatment.description}
                </motion.p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="bg-pink-100 px-4 py-2 rounded-full">
                    <span className="text-pink-800 font-semibold">{treatment.price}</span>
                  </div>
                  <div className="bg-teal-100 px-4 py-2 rounded-full">
                    <span className="text-teal-800 font-semibold">{treatment.duration}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <SparkleButton variant="primary" size="lg">
                    Book Consultation
                  </SparkleButton>
                  <SparkleButton variant="outline" size="lg">
                    Learn More
                  </SparkleButton>
                </div>
              </GlassMorphismCard>
            </motion.div>

            {/* 3D Viewer */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <LayeredGlassCard>
                <Interactive3DDentalViewer
                  modelType={treatment.modelType}
                  heroMode={true}
                  showControls={true}
                  autoRotate={true}
                  showLabels={true}
                />
              </LayeredGlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6">
          <GlassMorphismCard className="p-8">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-4 mb-8 border-b border-gray-200">
              {['overview', 'benefits', 'process', 'faq'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 font-semibold capitalize transition-all ${
                    activeTab === tab
                      ? 'text-pink-600 border-b-2 border-pink-600'
                      : 'text-gray-600 hover:text-pink-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-3xl font-bold mb-6">Treatment Overview</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {treatment.description}
                  </p>
                </div>
              )}

              {activeTab === 'benefits' && (
                <div>
                  <h2 className="text-3xl font-bold mb-6">Benefits</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {treatment.benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-6 h-6 bg-gradient-to-r from-pink-600 to-teal-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                        <span className="text-gray-700">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'process' && (
                <div>
                  <h2 className="text-3xl font-bold mb-6">Treatment Process</h2>
                  <div className="space-y-6">
                    {treatment.process.map((step, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start space-x-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-teal-600 rounded-full flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-gray-700">{step}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'faq' && (
                <div>
                  <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {faqData.map((faq, index) => (
                      <motion.div
                        key={index}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <button
                          onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                          className="w-full text-left p-6 hover:bg-gray-50 transition-colors flex justify-between items-center"
                        >
                          <span className="font-semibold text-gray-800">{faq.question}</span>
                          <span className="text-pink-600 text-xl">
                            {expandedFAQ === index ? '−' : '+'}
                          </span>
                        </button>
                        {expandedFAQ === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="px-6 pb-6"
                          >
                            <p className="text-gray-700">{faq.answer}</p>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </GlassMorphismCard>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-6 text-center">
          <LayeredGlassCard className="p-12">
            <motion.h2 
              className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-600 to-teal-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Ready to Transform Your Smile?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Book your consultation today and discover how our advanced {treatment.title.toLowerCase()} treatment can give you the smile you've always wanted.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center"
            >
              <SparkleButton variant="primary" size="lg">
                Book Free Consultation
              </SparkleButton>
              <SparkleButton variant="secondary" size="lg">
                Call 01273 453109
              </SparkleButton>
            </motion.div>
          </LayeredGlassCard>
        </div>
      </section>
    </div>
  );
}

