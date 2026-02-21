export type Tier = {
  name: string;
  price: number;
  description: string;
};

export type Celebrity = {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
  followers: number;
  verified: boolean;
  walletAddress: string;
  tiers: Tier[];
};

export const influencers: Celebrity[] = [
  {
    id: '1',
    name: 'Changpeng Zhao',
    title: 'Founder & CEO, Binance',
    image: 'https://imageio.forbes.com/specials-images/imageserve/61115ac5b4c5d23845419c4e/0x0.jpg?format=jpg&crop=911,911,x0,y0,safe&height=416&width=416&fit=bounds',
    bio: 'Leading the largest crypto exchange | Building the future of finance',
    followers: 5200000,
    verified: true,
    walletAddress: '0x1234567890123456789012345678901234567890',
    tiers: [
      { name: 'Chat', price: 5000000, description: 'Direct message access for 30 days' },
      { name: 'Call', price: 25000000, description: '30-minute strategy call' },
      { name: 'Coffee', price: 250000000, description: 'In-person meeting' },
    ],
  },
  {
    id: '2',
    name: 'Pavel Durov',
    title: 'Founder, Telegram',
    image: 'https://imageio.forbes.com/specials-images/imageserve/605e44a746821557fdbd3e15/0x0.jpg?format=jpg&crop=1080,1080,x0,y0,safe&height=416&width=416&fit=bounds',
    bio: 'Privacy advocate & tech visionary | Building secure communication',
    followers: 3800000,
    verified: true,
    walletAddress: '0x2345678901234567890123456789012345678901',
    tiers: [
      { name: 'Chat', price: 4000000, description: 'Direct message access for 30 days' },
      { name: 'Call', price: 20000000, description: '30-minute tech discussion' },
      { name: 'Coffee', price: 200000000, description: 'Private meeting' },
    ],
  },
  {
    id: '3',
    name: 'Jeremy Allaire',
    title: 'Founder & CEO, Circle',
    image: 'https://thebusinessmagnate.com/wp-content/uploads/2023/10/Jeremy-Allaire-Circle-CEO.jpg',
    bio: 'Stablecoin pioneer | USDC creator | Web3 infrastructure builder',
    followers: 2100000,
    verified: true,
    walletAddress: '0x3456789012345678901234567890123456789012',
    tiers: [
      { name: 'Chat', price: 3000000, description: 'Direct message access for 30 days' },
      { name: 'Call', price: 15000000, description: '30-minute business call' },
      { name: 'Coffee', price: 150000000, description: 'Strategic meeting' },
    ],
  },
  {
    id: '4',
    name: 'Vitalik Buterin',
    title: 'Co-founder, Ethereum',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsg71Z_wsoFE4mCyEaq5BUNuUjvZz-5w6cILaW2kyUcuaIdBH-DGmqHOi7Jc0EM1OfdmloCvyCHylzZuBbLVdxBCecw8d-680qIJiTCGvE&s=10',
    bio: 'Blockchain visionary | Ethereum creator | Web3 architect',
    followers: 4500000,
    verified: true,
    walletAddress: '0x4567890123456789012345678901234567890123',
    tiers: [
      { name: 'Chat', price: 5000000, description: 'Direct message access for 30 days' },
      { name: 'Call', price: 25000000, description: '30-minute technical discussion' },
      { name: 'Coffee', price: 250000000, description: 'Private research session' },
    ],
  },
  {
    id: '5',
    name: 'Cathie Wood',
    title: 'Founder & CEO, ARK Invest',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSCvsBLcObQiRrdQ8QxO7yHZwnHtkQ6QBHJVY6U0cHYW5CT__H4qA3FFnJ6Cem50ckyJ0pRe7m3rXw9-eRKCu_Hx5tjkVvw87q2TncGjkWdg&s=10',
    bio: 'Investment innovator | Crypto advocate | Future tech believer',
    followers: 2800000,
    verified: true,
    walletAddress: '0x5678901234567890123456789012345678901234',
    tiers: [
      { name: 'Chat', price: 3500000, description: 'Direct message access for 30 days' },
      { name: 'Call', price: 17500000, description: '30-minute investment call' },
      { name: 'Coffee', price: 175000000, description: 'Portfolio consultation' },
    ],
  },
  {
    id: '6',
    name: 'Michael Saylor',
    title: 'Founder & Executive Chairman, MicroStrategy',
    image: 'https://www.strategy.com/_next/image?url=https%3A%2F%2Fimages.contentstack.io%2Fv3%2Fassets%2Fbltf8d808d9b8cebd37%2Fblta9597547a826a86f%2F6889293550671cc10fc38564%2Fexecutive-team_michael-saylor.jpg&w=1920&q=100',
    bio: 'Bitcoin maximalist | Business intelligence leader | Crypto evangelist',
    followers: 1900000,
    verified: true,
    walletAddress: '0x6789012345678901234567890123456789012345',
    tiers: [
      { name: 'Chat', price: 2500000, description: 'Direct message access for 30 days' },
      { name: 'Call', price: 12500000, description: '30-minute Bitcoin discussion' },
      { name: 'Coffee', price: 125000000, description: 'Corporate strategy session' },
    ],
  },
];
