import React, { useState } from 'react';
import type { User, Challenge } from '../types';
import ChallengeModal from './ChallengeModal';
import { NoSymbolIcon } from './icons';

interface Activity {
  id: string;
  title: string;
  emoji: string;
  points: number;
  description: string;
  proof: string;
  image: string;
}

const ecoDontsData: { 
    category: string; 
    icon: string; 
    activities: Activity[];
    negativeImpact: {
        image: string;
        stat: string;
        description: string;
    }
}[] = [
  {
    category: 'Plastic & Waste',
    icon: '🌍',
    negativeImpact: {
        image: 'https://images.unsplash.com/photo-1618345100063-101a0a58e0a7?q=80&w=600&auto=format&fit=crop',
        stat: '8 Million Tons',
        description: 'of plastic end up in our oceans every year, harming over 100,000 marine animals.',
    },
    activities: [
      {
        id: 'dont-plastic-bottle',
        title: 'No-Plastic Bottle Week',
        emoji: '🚫🍼',
        points: 30,
        description: 'Don’t bring single-use plastic bottles to school or use them at home for a whole week.',
        proof: 'Show off your reusable steel, glass, or other eco-friendly bottle.',
        image: 'https://images.unsplash.com/photo-1602143393494-721d002d3405?q=80&w=400&auto=format&fit=crop',
      },
      {
        id: 'dont-plastic-bags',
        title: 'Say No to Plastic Bags',
        emoji: '🛍️',
        points: 20,
        description: 'If you go shopping with your family, make sure to carry your own cloth or reusable bags.',
        proof: 'Upload a picture with your reusable shopping bag at a store.',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=400&auto=format&fit=crop',
      },
      {
        id: 'dont-snack-wrapper',
        title: 'Snack Without Wrapper Day',
        emoji: '🍫',
        points: 15,
        description: 'Bring lunch or snacks to school that don’t have any plastic wrappers or packaging.',
        proof: 'Showcase your cool wrapper-free snacks in a reusable container.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop',
      },
    ],
  },
  {
    category: 'Energy & Resources',
    icon: '💡',
    negativeImpact: {
        image: 'https://images.unsplash.com/photo-1599389938834-5f5f683a420b?q=80&w=600&auto=format&fit=crop',
        stat: '1/3 of All Food',
        description: 'produced globally is wasted. This wastes the energy and water used to grow it.',
    },
    activities: [
      {
        id: 'dont-waste-electricity',
        title: 'No Fan/Light in Empty Classrooms',
        emoji: '🚫💡',
        points: 10,
        description: 'Be a vigilant EcoChamp! Spot and switch off any fans or lights left on in empty classrooms.',
        proof: 'Points are awarded each time you spot and correct wasted electricity.',
        image: 'https://images.unsplash.com/photo-1510070112810-d4e9a46d9e91?q=80&w=400&auto=format&fit=crop',
      },
      {
        id: 'dont-waste-food',
        title: 'Zero-Waste Lunch Day',
        emoji: '🍱',
        points: 25,
        description: 'Don’t throw away any food from your lunch. Finish your meal completely and avoid food waste.',
        proof: 'Show your empty, waste-free lunchbox after your meal.',
        image: 'https://images.unsplash.com/photo-1532634896-26909d0d4b89?q=80&w=400&auto=format&fit=crop',
      },
      {
        id: 'dont-single-use-cutlery',
        title: 'No Single-Use Cutlery',
        emoji: '🍴',
        points: 20,
        description: 'Avoid using disposable plastic spoons, straws, forks, or plates when eating outside or at events.',
        proof: 'Use and show your personal reusable cutlery set.',
        image: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?q=80&w=400&auto=format&fit=crop',
      },
    ],
  },
  {
    category: 'Water & Lifestyle',
    icon: '🚰',
    negativeImpact: {
        image: 'https://images.unsplash.com/photo-1543336370-3d3a44de219a?q=80&w=600&auto=format&fit=crop',
        stat: 'Only 1% of Water',
        description: 'on Earth is available for drinking. Every drop we save matters for our future.',
    },
    activities: [
      {
        id: 'dont-running-tap',
        title: 'No Running Tap Challenge',
        emoji: '🚫🚰',
        points: 15,
        description: 'Make it a habit to not keep the tap running while brushing your teeth or washing your hands.',
        proof: 'This is based on the honor system or a short video pledge.',
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop',
      },
      {
        id: 'dont-vehicle-day',
        title: 'No Vehicle Day',
        emoji: '🚶🚴',
        points: 40,
        description: 'For short distances where you might use a scooter or car, choose to walk or cycle instead.',
        proof: 'Track and share your walk or cycle route for a short trip.',
        image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=400&auto=format&fit=crop',
      },
      {
        id: 'dont-fast-fashion',
        title: 'Say No to Fast Fashion Day',
        emoji: '👕',
        points: 25,
        description: 'Instead of buying new clothes, wear reused, thrifted, or sustainably made outfits for a day.',
        proof: 'Share a photo of your stylish, sustainable outfit of the day (#OOTD).',
        image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=400&auto=format&fit=crop',
      },
    ],
  },
  {
    category: 'Awareness & Habits',
    icon: '🧠',
    negativeImpact: {
        image: 'https://images.unsplash.com/photo-1623193296608-256d09b63432?q=80&w=600&auto=format&fit=crop',
        stat: '75 Decibels',
        description: 'is the safe noise level. Constant exposure to louder sounds can harm our health and wildlife.',
    },
    activities: [
      {
        id: 'dont-litter-pledge',
        title: 'No Litter Pledge',
        emoji: '🚯',
        points: 10,
        description: 'Make a promise not to throw any trash on the ground, in parks, or on the streets. Always use a dustbin.',
        proof: 'A daily pledge to keep your surroundings clean (honor system).',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=400&auto=format&fit=crop',
      },
      {
        id: 'dont-digital-waste',
        title: 'No Digital Waste Hour',
        emoji: '📱',
        points: 15,
        description: 'Avoid spending more than one hour on unnecessary scrolling or gaming to save electricity and time.',
        proof: 'Share a screenshot of your digital wellness or screen time report.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400&auto=format&fit=crop',
      },
      {
        id: 'dont-noise-pollution',
        title: 'No Loud Horn/Noise Pollution Day',
        emoji: '🚫📢',
        points: 20,
        description: 'Encourage your family to avoid unnecessary honking or using loud speakers to reduce noise pollution.',
        proof: 'A pledge or an observation log of a peaceful commute.',
        image: 'https://images.unsplash.com/photo-1469474099711-4239078bb21e?q=80&w=400&auto=format&fit=crop',
      },
    ],
  },
];

const ecoInfoData = [
    {
        image: 'https://images.unsplash.com/photo-1574939223835-23c5890b168a?q=80&w=600&auto=format&fit=crop',
        title: 'Avoid Single-Use Plastics',
        description: 'Plastic bottles, bags, and straws pollute our oceans and harm wildlife. Always choose reusable alternatives.',
    },
    {
        image: 'https://images.unsplash.com/photo-1542861250-8616c623fe49?q=80&w=600&auto=format&fit=crop',
        title: "Don't Feed Wildlife",
        description: 'Feeding wild animals can make them sick and dependent on humans, disrupting natural ecosystems.',
    },
    {
        image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=600&auto=format&fit=crop',
        title: 'Stay on Designated Trails',
        description: 'Going off-trail can damage fragile plants, disturb wildlife habitats, and cause soil erosion.',
    },
    {
        image: 'https://images.unsplash.com/photo-1618353604340-9114764b38a7?q=80&w=600&auto=format&fit=crop',
        title: "Don't Litter",
        description: 'Trash left in nature can take hundreds of years to decompose and can be deadly to animals that ingest it.',
    }
];

interface EcosystemDontsProps {
  currentUser: User;
  onCompleteChallenge: (challenge: Challenge, proofUrl: string) => void;
}

const EcosystemDonts: React.FC<EcosystemDontsProps> = ({ currentUser, onCompleteChallenge }) => {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const completedChallengeIds = currentUser.completedChallenges.map(c => c.challengeId);

  const handleSelectActivity = (activity: Activity, category: string) => {
    const challenge: Challenge = {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      points: activity.points,
      category: category,
      icon: <NoSymbolIcon />,
      image: activity.image
    };
    setSelectedChallenge(challenge);
  };
  
  return (
    <>
      <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-text-primary">Eco Don'ts: Avoid & Earn Points</h2>
              <p className="text-lg text-text-secondary mt-2 max-w-3xl mx-auto">
                  Being an EcoChamp is not just about doing good things, but also avoiding harmful habits. Complete these "Don't" challenges to prove your commitment and earn bonus points!
              </p>
          </div>

          <div className="space-y-12">
              {ecoDontsData.map((category) => (
                  <section key={category.category}>
                      <h3 className="text-3xl font-bold text-text-primary mb-6 flex items-center gap-3">
                          <span className="text-4xl">{category.icon}</span>
                          {category.category}
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                           {/* Negative Impact Card */}
                          <div className="lg:col-span-4 bg-red-500/10 dark:bg-red-900/30 rounded-xl p-6 flex flex-col items-center text-center border border-red-200 dark:border-red-800">
                              <img src={category.negativeImpact.image} alt={category.category} className="w-full h-32 object-cover rounded-lg shadow-md mb-4" />
                              <h4 className="text-lg font-bold text-red-700 dark:text-red-300">The Negative Impact</h4>
                              <p className="text-4xl font-extrabold text-red-500 dark:text-red-400 my-2">{category.negativeImpact.stat}</p>
                              <p className="text-sm text-red-600 dark:text-red-300">{category.negativeImpact.description}</p>
                          </div>
                          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                              {category.activities.map((activity) => {
                                  const isCompleted = completedChallengeIds.includes(activity.id);
                                  return (
                                    <div 
                                      key={activity.title}
                                      onClick={() => !isCompleted && handleSelectActivity(activity, category.category)}
                                      className={`bg-surface rounded-xl shadow-lg flex flex-col transform transition-all duration-300 relative overflow-hidden ${
                                        isCompleted 
                                          ? 'border-t-4 border-green-400 opacity-70' 
                                          : 'border-t-4 border-red-400 dark:border-red-500 hover:-translate-y-1 cursor-pointer'
                                      }`}
                                    >
                                        <div className="h-32 w-full overflow-hidden relative">
                                            <img 
                                                src={activity.image} 
                                                alt={activity.title} 
                                                className="w-full h-full object-cover"
                                                referrerPolicy="no-referrer"
                                            />
                                            <div className="absolute top-2 right-2 bg-secondary text-white text-sm font-bold rounded-full px-3 py-1 shadow-md">
                                                +{activity.points}
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col justify-between flex-grow">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-lg font-bold text-text-primary pr-2 leading-tight">
                                                        {activity.title} <span className="text-xl ml-1">{activity.emoji}</span>
                                                    </h4>
                                                </div>
                                                <p className="text-text-secondary text-sm mb-4 line-clamp-2">{activity.description}</p>
                                            </div>
                                            <div className="mt-auto pt-3 border-t border-dashed border-gray-300 dark:border-gray-600">
                                                <p className="text-xs text-text-secondary">
                                                    <span className="font-semibold text-primary">How to prove it:</span> {activity.proof}
                                                </p>
                                            </div>
                                        </div>
                                        {isCompleted && (
                                          <div className="absolute inset-0 bg-black/30 rounded-xl flex items-center justify-center">
                                            <div className="flex items-center gap-2 text-white font-bold text-lg bg-green-500/90 px-4 py-2 rounded-full">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                COMPLETED
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  )
                              })}
                          </div>
                      </div>
                  </section>
              ))}
          </div>

          <div className="mt-24">
              <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-text-primary">Ecosystem Protectors' Guide: What to Avoid</h2>
                  <p className="text-lg text-text-secondary mt-2 max-w-3xl mx-auto">
                      Learn about simple actions to avoid that have a big positive impact on our environment.
                  </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {ecoInfoData.map((item) => (
                      <div key={item.title} className="bg-surface rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                          <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
                          <div className="p-5">
                              <h4 className="font-bold text-lg text-text-primary">{item.title}</h4>
                              <p className="text-sm text-text-secondary mt-1">{item.description}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onComplete={(challenge, proofUrl) => {
            onCompleteChallenge(challenge, proofUrl);
            setSelectedChallenge(null);
          }}
          isCompleted={completedChallengeIds.includes(selectedChallenge.id)}
        />
      )}
    </>
  );
};

export default EcosystemDonts;
