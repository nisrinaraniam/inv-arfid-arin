export interface PhotoItem {
  src: string;
  alt: string;
  pos?: string;
}

export interface LoveStoryItem {
  date: string;
  title: string;
  text: string;
}

export const wedding = {
  groom: {
    nickname: 'Arfid',
    name: 'Arfid Gamal S.T',
    parents: 'First son of Mr. Capt. H. Gamluddin, M.Mar. & Mrs. Hj. Ida Faridah, S.H.I.',
  },
  bride: {
    nickname: 'Arin',
    name: 'dr. Vanetka Daarin Haya',
    parents: 'First daughter of the late Mr. H. Irpan, S.Sos., M.M. & Mrs. Hj. Henny Arifianti, S.Sos.',
  },
  date: '2026-12-05',
  start: '2026-12-05T19:00:00+08:00',
  dateLabel: 'Saturday, 5 December 2026',
  timeLabel: '19.00 WITA',
  event: 'Intimate Dinner',
  venue: 'Grand Ballroom Hotel Aruna Senggigi Resort & Convention',
  address: 'Jl. Raya Senggigi, Senggigi, Kec. Batu Layar, Kabupaten Lombok Barat, Nusa Tenggara Bar. 83355',
  map: 'https://maps.app.goo.gl/nTXHCgNFbq2P4xjP6?g_st=ic',
  
  // Google Apps Script Web App URL untuk integrasi Spreadsheet Database
  gasEndpoint: 'https://script.google.com/macros/s/GANTI_DENGAN_ID_DEPLOYMENT_ANDA/exec',

  bank: {
    bankName: 'Bank BCA',
    accountNumber: '8610840532',
    accountHolder: 'Vanetka Daarin Haya',
  },

  photos: [
    { src: '/assets/couple/moment-her01668.jpg', alt: 'Arfid and Arin holding a bouquet on the coastal hill', pos: '50% 50%' },
    { src: '/assets/couple/moment-her02438.jpg', alt: 'Arfid and Arin walking hand in hand on the hill', pos: '50% 45%' },
    { src: '/assets/couple/moment-dsc09889.jpg', alt: 'Arfid and Arin sharing a warm gaze', pos: '52% 65%' },
    { src: '/assets/couple/moment-her03836.jpg', alt: 'Arfid and Arin in a joyful embrace by the sea', pos: '50% 50%' },
    { src: '/assets/couple/moment-her03678.jpg', alt: 'Arfid and Arin at golden hour on the beach', pos: '46% 55%' },
    { src: '/assets/couple/moment-her04254.jpg', alt: 'Arfid and Arin embracing under the fireworks', pos: '50% 42%' },
  ] as PhotoItem[],
};

export const loveStory: LoveStoryItem[] = [
  {
    date: '18 July 2021',
    title: 'We Said "I Love You"',
    text: 'We chose each other, even though miles stood between us.',
  },
  {
    date: '3 November 2021',
    title: 'We Finally Met',
    text: 'After three months of long distance, Arfid surprised Arin in Yogyakarta, and we met for the very first time.',
  },
  {
    date: '8 April 2026',
    title: 'The Proposal',
    text: 'Five years of long distance, yet we always made time to be together. Then Arfid asked for her hand in the very city where we first met.',
  },
  {
    date: '11 April 2026',
    title: 'The Engagement',
    text: 'Together with our families in Lombok, we made it official.',
  },
  {
    date: '5 December 2026',
    title: 'Forever Begins',
    text: 'And now, we are getting married.',
  },
];
