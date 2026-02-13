const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockAuth = {
  async login({ email }) {
    await delay(450);
    return {
      token: 'mock-token',
      user: {
        id: 'user_01',
        email,
        fullName: 'Stoik Member',
        status: 'active'
      }
    };
  },
  async register({ email, fullName }) {
    await delay(500);
    return {
      token: 'mock-token',
      user: {
        id: 'user_02',
        email,
        fullName,
        status: 'active'
      }
    };
  }
};

export const mockSubscriptions = async () => {
  await delay(350);
  return [
    {
      id: 'sub_001',
      label: 'Essentials cadence',
      status: 'active',
      nextBillingDate: '2026-03-01'
    }
  ];
};

export const mockFitProfile = async (payload) => {
  await delay(400);
  return {
    ...payload,
    sizeLabel: calculateSize(payload),
    updatedAt: new Date().toISOString()
  };
};

export const calculateSize = ({ chest, waist }) => {
  if (chest <= 92 && waist <= 78) return 'XS';
  if (chest <= 96 && waist <= 82) return 'S';
  if (chest <= 100 && waist <= 86) return 'M';
  if (chest <= 105 && waist <= 91) return 'L';
  if (chest <= 110 && waist <= 96) return 'XL';
  return 'XXL';
};
