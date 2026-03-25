

import React from 'react';
// Restore missing type imports
// fix: Import 'LearningModule' to resolve 'Cannot find name' error.
import type { Challenge, Badge, RewardItem, LearningModule } from './types';
// Restore missing icon imports
import { FireIcon, TrophyIcon, SparklesIcon } from './components/icons';

// App-wide constants
export const CHATBOT_UNLOCK_THRESHOLD = 50;

// Icons
export const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const WaterDropIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a7 7 0 01-4.95-12.05A7 7 0 0112 5a7 7 0 017 7c0 3.86-3.14 7-7 7z" />
    </svg>
);

// fix: Add missing BoltIcon and RecycleIcon to fix import errors in PersonalizedSuggestions.tsx
export const BoltIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export const RecycleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7.014a8.003 8.003 0 0110.014 10.014C19.5 15 17 14 17 12c1 2 2.657 3.657-1.343 4.657z" />
    </svg>
);

// fix: Add missing INTEREST_CATEGORIES constant
export const INTEREST_CATEGORIES = [
    'Waste Management',
    'Water Conservation',
    'Biodiversity',
    'Energy Conservation',
    'Climate Action',
];

// fix: Add missing INITIAL_CHALLENGES constant
export const INITIAL_CHALLENGES: Challenge[] = [
    {
      id: 'waste-1',
      title: 'Waste Segregation Master',
      description: 'Correctly segregate your household waste into dry, wet, and hazardous categories for a week.',
      points: 25,
      category: 'Waste Management',
      icon: <RecycleIcon />,
      difficulty: 'Medium',
    },
    {
      id: 'water-1',
      title: 'Water Audit',
      description: 'Check for leaky faucets and pipes at home. Fix one if you find it!',
      points: 20,
      category: 'Water Conservation',
      icon: <WaterDropIcon />,
      difficulty: 'Easy',
    },
    {
      id: 'energy-1',
      title: 'Unplug Power Vampires',
      description: 'Unplug at least 5 electronic devices that are not in use to save standby power for a day.',
      points: 15,
      category: 'Energy Conservation',
      icon: <BoltIcon />,
      difficulty: 'Easy',
    },
    {
      id: 'bio-1',
      title: 'Plant a Sapling',
      description: 'Plant a native sapling in your backyard, a pot, or a community garden.',
      points: 30,
      category: 'Biodiversity',
      icon: <LeafIcon />,
      difficulty: 'Medium',
    },
    {
      id: 'waste-2',
      title: 'DIY Compost Bin',
      description: 'Create a small compost bin for your kitchen scraps.',
      points: 40,
      category: 'Waste Management',
      icon: <RecycleIcon />,
      difficulty: 'Hard',
    },
    {
      id: 'climate-1',
      title: 'Eco-Friendly Commute',
      description: 'Use public transport, cycle, or walk for a commute you usually take by car or bike.',
      points: 20,
      category: 'Climate Action',
      icon: <SparklesIcon />,
      difficulty: 'Medium',
    },
    {
      id: 'water-2',
      title: 'DIY Water Filter',
      description: 'Build a simple water filter at home using a bottle, sand, gravel, and cotton to understand purification.',
      points: 45,
      category: 'Water Conservation',
      icon: <WaterDropIcon />,
      difficulty: 'Hard',
    },
    {
      id: 'bio-2',
      title: 'Build a Bird Feeder',
      description: 'Create a simple bird feeder from a recycled plastic bottle or carton and hang it in your balcony or garden.',
      points: 35,
      category: 'Biodiversity',
      icon: <LeafIcon />,
      difficulty: 'Medium',
    },
    {
      id: 'energy-2',
      title: 'Natural Light Hour',
      description: 'For one hour during the day, use only natural light in your room. No electric lights allowed!',
      points: 10,
      category: 'Energy Conservation',
      icon: <BoltIcon />,
      difficulty: 'Easy',
    },
    {
      id: 'climate-2',
      title: 'Eco-Pledge Poster',
      description: 'Create a colorful poster with your personal eco-pledge and display it in your room or on the class board.',
      points: 25,
      category: 'Climate Action',
      icon: <SparklesIcon />,
      difficulty: 'Medium',
    },
];

// fix: Add missing BADGES constant
export const BADGES: Badge[] = [
    {
        name: 'Eco-Initiate',
        description: 'You\'ve started your journey by earning your first 100 points!',
        icon: <TrophyIcon />,
        threshold: 100,
        type: 'points',
    },
    {
        name: 'Streak Starter',
        description: 'You\'ve maintained a 3-day login streak!',
        icon: <FireIcon />,
        threshold: 3,
        type: 'streak',
    },
    {
        name: 'Green Guardian',
        description: 'You\'ve earned 500 points. You are a true protector of the Earth!',
        icon: <TrophyIcon className="text-yellow-500"/>,
        threshold: 500,
        type: 'points',
    },
    {
        name: 'Firestarter',
        description: 'You\'ve maintained a 7-day login streak! You are on fire!',
        icon: <FireIcon className="text-orange-500" />,
        threshold: 7,
        type: 'streak',
    }
];

export const REWARD_ITEMS_DATA: RewardItem[] = [
  {
    id: 'reward-1',
    name: 'Plant a Tree',
    description: 'We\'ll plant a tree in your name in a local reforestation project. You\'ll receive a digital certificate!',
    cost: 500,
    icon: '🌳',
  },
  {
    id: 'reward-2',
    name: 'Eco-Friendly Stationery Set',
    description: 'A set of recycled paper notebooks, seed pencils, and a bamboo pen delivered to the school.',
    cost: 750,
    icon: '✏️',
  },
  {
    id: 'reward-3',
    name: 'Digital Wallpaper Pack',
    description: 'A pack of exclusive, beautiful nature-themed digital wallpapers for your phone and computer.',
    cost: 150,
    icon: '🖼️',
  },
  {
    id: 'reward-4',
    name: 'Eco-Warrior E-Badge',
    description: 'A special, exclusive badge that will be displayed permanently on your profile.',
    cost: 1000,
    icon: '🏅',
  },
  {
    id: 'reward-5',
    name: 'Reusable Water Bottle',
    description: 'A high-quality, school-branded reusable steel water bottle to help you avoid plastic.',
    cost: 1200,
    icon: '💧',
  },
  {
    id: 'reward-6',
    name: 'Class Pizza Party Coupon',
    description: 'Contribute towards a pizza party for your class once enough coupons are redeemed!',
    cost: 250,
    icon: '🍕',
  },
];

// fix: Add missing LEARNING_MODULES_DATA
export const LEARNING_MODULES_DATA: LearningModule[] = [
  {
    id: 'learn-1',
    title: 'The Water Cycle',
    description: 'Learn how water moves around, above, and below the surface of the Earth.',
    icon: '💧',
    content: `The water cycle is Earth's way of recycling water! It's a continuous journey water takes from the ground to the sky and back again.

**Key Stages:**

1. **Evaporation:** The sun heats up water in rivers, lakes, and oceans, turning it into vapor (a gas) that rises into the air.
2. **Condensation:** As the water vapor rises higher, it cools down and turns back into tiny liquid water droplets, forming clouds.
3. **Precipitation:** When the clouds get heavy with water, they release it back to Earth in the form of rain, snow, or hail.
4. **Collection:** The water that falls back to Earth collects in rivers, lakes, and oceans, or soaks into the ground, ready to start the cycle all over again!

**Why it matters:** The water cycle gives us the fresh water we need to live, for drinking, farming, and much more. Protecting our water sources is vital for a healthy planet.`
  },
  {
    id: 'learn-2',
    title: 'Decomposers: Nature\'s Recyclers',
    description: 'Discover the tiny organisms that clean up our planet.',
    icon: '🍄',
    content: `Decomposers are the cleanup crew of the ecosystem! They are tiny living things like bacteria and fungi that have a very important job.

**What they do:**

- Decomposers break down dead plants and animals (like fallen leaves or dead insects) into tiny pieces.
- This process releases important nutrients back into the soil.
- Plants then use these nutrients to grow strong and healthy.

**Examples of Decomposers:**

- **Fungi:** Mushrooms and molds are types of fungi.
- **Bacteria:** These are microscopic organisms found everywhere.
- **Earthworms:** They munch through soil, breaking down organic matter.

Without decomposers, our planet would be covered in dead stuff, and the soil wouldn't have the food it needs to grow new plants. They are essential for a healthy, balanced ecosystem.`
  },
  {
    id: 'learn-3',
    title: 'Pollinators: The Busy Helpers',
    description: 'Find out why bees, butterflies, and other animals are so important for plants.',
    icon: '🐝',
    content: `Pollinators are animals that help plants make fruits and seeds. They are like a delivery service for plants!

**How it works:**

- Plants have a fine powder called **pollen**. To make a new seed, pollen from one flower needs to get to another flower of the same kind.
- Animals like bees, butterflies, and even some birds visit flowers to drink a sweet liquid called nectar.
- While they are drinking, pollen gets stuck to their bodies.
- When they fly to the next flower, some of that pollen rubs off, which fertilizes the flower.
- Once fertilized, the flower can grow into a fruit with seeds inside, like an apple or a mango!

**Why they are crucial:** About one-third of the food we eat, including many fruits and vegetables, depends on pollinators. Protecting them helps ensure we have delicious food to eat.`
  },
  {
    id: 'learn-4',
    title: 'The Problem with Plastic',
    description: 'Understand the impact of plastic pollution on our environment.',
    icon: '🚫',
    content: `Plastic is a useful material, but it has a dark side. Most plastic doesn't biodegrade, which means it doesn't rot away like a banana peel. It just breaks into smaller and smaller pieces.

**The Journey of Plastic Waste:**

- Much of our plastic waste is not recycled properly.
- It can end up in rivers and eventually flow into the ocean.
- In the ocean, sunlight and waves break it down into tiny pieces called **microplastics**.

**Why it's harmful:**

- Marine animals like turtles and fish can mistake plastic bags for food, which can make them very sick.
- Microplastics can be eaten by small fish, which are then eaten by bigger fish, moving up the food chain and even ending up in the food we eat.
- Plastic pollution makes our beautiful beaches and oceans dirty and unsafe.

**What can we do?** We can help by using less plastic! Say no to plastic straws, use reusable water bottles and bags, and always recycle the plastic we do use.`
  },
  {
    id: 'learn-5',
    title: 'Renewable Energy Sources',
    description: 'Explore clean ways to power our world, like solar and wind.',
    icon: '☀️',
    content: `Renewable energy comes from sources that won't run out, unlike coal or oil. They are much cleaner for our planet!

**Two Superstars of Renewable Energy:**

- **Solar Power:** This is energy from the sun. **Solar panels** are special panels that can capture sunlight and turn it into electricity to power our homes and schools. The sun gives us more energy every hour than the whole world uses in a year!
- **Wind Power:** This is energy from the wind. Huge windmills called **wind turbines** are used to capture the wind's energy. As the blades spin, they generate electricity.

**Why is it better?**
Using renewable energy doesn't release harmful gases into the air that cause climate change and air pollution. It's a key step towards a cleaner, healthier future for everyone.`
  },
  {
    id: 'learn-6',
    title: 'Composting: From Scraps to Soil',
    description: 'Learn how to turn your kitchen waste into "black gold" for plants.',
    icon: '♻️',
    content: `Composting is a fantastic way to recycle your kitchen and garden waste. It turns things like fruit and vegetable peels, eggshells, and leaves into a super-rich soil called compost.

**How to Compost:**

1. **Collect:** Gather your "green" materials (like veggie scraps, coffee grounds) and "brown" materials (like dry leaves, cardboard).
2. **Mix:** In a compost bin, layer your greens and browns. It's like making a lasagna for the soil!
3. **Wait:** Over time, decomposers (like worms and bacteria) will get to work, breaking everything down. You should mix it occasionally to help them out.
4. **Harvest:** After a few months, you'll have dark, crumbly, sweet-smelling compost.

**Why it's amazing:**
Compost is a natural fertilizer that helps plants grow strong without using chemical fertilizers. It also reduces the amount of waste that goes to landfills, which helps reduce harmful greenhouse gases.`
  },
  {
    id: 'learn-7',
    title: 'Understanding Air Pollution',
    description: 'What causes air pollution and how does it affect us?',
    icon: '💨',
    content: `Air pollution happens when harmful substances like gases and tiny particles are released into the air.

**Main Causes in India:**

- **Vehicles:** Smoke from cars, buses, and scooters.
- **Factories:** Industrial emissions from making products.
- **Burning:** Burning trash or crops releases a lot of smoke.
- **Construction:** Dust from building sites.

**Its Effects:**

- **Health:** It can make it hard to breathe and cause health problems like asthma.
- **Environment:** It can lead to acid rain, which harms forests and lakes, and contributes to climate change.
- **Visibility:** It creates smog, a thick haze that makes it hard to see.

**How can we help?** Planting more trees is a great way to fight air pollution, as trees absorb harmful gases and release clean oxygen. Using public transport, walking, or cycling also helps reduce the number of vehicles on the road.`
  },
  {
    id: 'learn-8',
    title: 'Protecting Our Wildlife',
    description: 'Learn about biodiversity and why it\'s important to protect every species.',
    icon: '🐅',
    content: `Biodiversity is the amazing variety of all living things on Earth, from the tiniest insect to the biggest blue whale. India is one of the most biodiverse countries in the world!

**Why is it Important?**

- **Balance:** Every species has a role to play in its ecosystem. If one species disappears, it can affect many others.
- **Resources:** We rely on nature for food, clean water, and even medicines.
- **Beauty & Wonder:** Wildlife and nature make our world a beautiful and interesting place.

**Threats to Wildlife:**

- **Habitat Loss:** When forests are cut down for cities or farms, animals lose their homes. This is the biggest threat.
- **Pollution:** Plastic and chemical pollution can harm animals in their natural habitats.
- **Climate Change:** Changing weather patterns can disrupt ecosystems and make it hard for species to survive.

**How can you be a Wildlife Protector?**
You can help by planting native trees, reducing your plastic use, learning about local animals, and supporting conservation efforts. Every action, no matter how small, makes a difference!`
  }
];