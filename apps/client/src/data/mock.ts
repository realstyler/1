import { Style, ProcessingStatus, Project } from '@/types';

export const mockStyles: Style[] = [
    {
        id: 'modern-living',
        name: 'Modern Living Room',
        description: 'Sleek contemporary design with clean lines and comfort',
        thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop',
        category: 'MODERN_COASTAL',
    },
    {
        id: 'minimalist',
        name: 'Minimalist Interior',
        description: 'Clutter-free aesthetic focusing on simplicity and functionality',
        thumbnail: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=400&h=300&fit=crop',
        category: 'MINIMAL_LUXE',
    },
    {
        id: 'luxury',
        name: 'Luxury Staging',
        description: 'Premium textures, elegant lighting, and sophisticated contrast',
        thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
        category: 'luxury',
    },
    {
        id: 'daylight',
        name: 'Bright Daylight',
        description: 'Enhance natural light and airy atmosphere',
        thumbnail: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=300&fit=crop',
        category: 'lighting',
    },
];

export const processingStages: ProcessingStatus[] = [
    { stage: 'uploading', progress: 10, message: 'Uploading your image...' },
    { stage: 'analyzing', progress: 30, message: 'Analyzing room structure...' },
    { stage: 'styling', progress: 60, message: 'Applying style transformation...' },
    { stage: 'finalizing', progress: 90, message: 'Adding final touches...' },
    { stage: 'complete', progress: 100, message: 'Complete!' },
];

// Mock result images for demo
export const mockResultImages: Record<string, string> = {
    'modern-living': 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
    'minimalist': 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&h=600&fit=crop',
    'luxury': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    'daylight': 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800&h=600&fit=crop',
};

// Sample room image for demo
export const sampleRoomImage = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'The Highland Loft',
    address: '1284 Highland Ave, Los Angeles',
    imagesCount: 12,
    updatedAt: '2m ago',
    status: 'Processing',
    imageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '2',
    title: 'Sunset Boulevard Villa',
    address: '8920 Sunset Blvd, West Hollywood',
    imagesCount: 24,
    updatedAt: '2h ago',
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '3',
    title: 'Modern Glass House',
    address: '4421 Glass Way, Austin',
    imagesCount: 18,
    updatedAt: '5h ago',
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '4',
    title: 'The Onyx Residence',
    address: '550 Market St, San Francisco',
    imagesCount: 8,
    updatedAt: '2d ago',
    status: 'Draft',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '5',
    title: 'Azure Bay Estate',
    address: '742 Marine Drive, Miami',
    imagesCount: 15,
    updatedAt: '1h ago',
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '6',
    title: 'Nordic Pine Cabin',
    address: '45 Skogen Road, Oslo',
    imagesCount: 6,
    updatedAt: '4h ago',
    status: 'Draft',
    imageUrl: 'https://images.unsplash.com/photo-1692866048250-bd135ca9d47d?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '7',
    title: 'Emerald Garden Mews',
    address: '12 Kensington Lane, London',
    imagesCount: 32,
    updatedAt: '3d ago',
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '8',
    title: 'Desert Mirage Villa',
    address: '88 Palm Canyon, Palm Springs',
    imagesCount: 20,
    updatedAt: '5m ago',
    status: 'Processing',
    imageUrl: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '9',
    title: 'Industrial Heights',
    address: '202 Factory St, Brooklyn',
    imagesCount: 10,
    updatedAt: '6h ago',
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1716807335226-dfe1e2062db1?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '10',
    title: 'The Sakura Suite',
    address: '3-12-1 Ginza, Tokyo',
    imagesCount: 14,
    updatedAt: '12h ago',
    status: 'Draft',
    imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '11',
    title: 'Alpine Vista Lodge',
    address: '900 Peak Path, Zermatt',
    imagesCount: 22,
    updatedAt: '1d ago',
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '12',
    title: 'The Marquee Penthouse',
    address: '1 Central Park West, New York',
    imagesCount: 45,
    updatedAt: '15m ago',
    status: 'Processing',
    imageUrl: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '13',
    title: 'Golden Hour Studio',
    address: '50 Arts District, Barcelona',
    imagesCount: 4,
    updatedAt: '4d ago',
    status: 'Completed',
    imageUrl: 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '14',
    title: 'Coastal Breeze Manor',
    address: '300 Surfside, Malibu',
    imagesCount: 28,
    updatedAt: '2h ago',
    status: 'Completed',
    imageUrl: 'https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=800&h=600&fit=crop',
  },
  {
    id: '15',
    title: 'The Concrete Grove',
    address: '15 Brutalist Way, Berlin',
    imagesCount: 11,
    updatedAt: '3h ago',
    status: 'Draft',
    imageUrl: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=800&h=600&fit=crop',
  },
];

export const libraryProjects = [
  {
    id: 1,
    title: "47 Ocean Drive",
    subtitle: "Living Room • 4 Variations",
    images: [
      { 
        id: '1-1', 
        type: 'original', 
        label: 'ORIGINAL', 
        src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80' 
      },
      { 
        id: '1-2', 
        type: 'variation', 
        label: 'Modern', 
        src: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=600&q=80' 
      },
      { 
        id: '1-3', 
        type: 'variation', 
        label: 'Coastal', 
        src: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=600&q=80' 
      },
      { 
        id: '1-4', 
        type: 'variation', 
        label: 'Minimal', 
        src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80' 
      },
    ],
  },
  {
    id: 2,
    title: "47 Ocean Drive",
    subtitle: "Kitchen • 2 Variations",
    images: [
      { 
        id: '2-1', 
        type: 'original', 
        label: 'ORIGINAL', 
        src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80' 
      },
      { 
        id: '2-2', 
        type: 'variation', 
        label: 'Industrial', 
        src: 'https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?w=600&q=80' 
      },
      { 
        id: '2-3', 
        type: 'variation', 
        label: 'Scandi', 
        src: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=600&q=80' 
      },
    ],
  },
  {
    id: 3,
    title: "47 Ocean Drive",
    subtitle: "Bedroom • 5 Variations",
    images: [
      { 
        id: '3-1', 
        type: 'original', 
        label: 'ORIGINAL', 
        src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80' 
      },
      { 
        id: '3-2', 
        type: 'variation', 
        label: 'Abstract', 
        src: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80' 
      },
      { 
        id: '3-3', 
        type: 'variation', 
        label: 'Dining', 
        src: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=80' 
      },
      { 
        id: '3-4', 
        type: 'more', 
        label: '+1 More', 
        src: '' 
      },
    ],
  },
];

export const mockSelectedImages = [
  {
    id: '1',
    src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=100&h=100&fit=crop',
    title: '47 Ocean Drive - Living',
    subtitle: 'Original + 4 Styles'
  },
  {
    id: '2',
    src: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=100&h=100&fit=crop',
    title: '47 Ocean Drive - Kitchen',
    subtitle: 'Original + 2 Styles'
  }
];