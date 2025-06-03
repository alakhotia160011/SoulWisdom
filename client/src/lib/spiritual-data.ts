// Sample spiritual passages for lesson generation
export const spiritualPassages = [
  // Bible
  {
    traditionId: 1,
    source: "Psalm 23:4",
    title: "Walking Through Darkness",
    content: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
    context: "David's psalm of trust in divine protection during difficult times",
    theme: "Trust and Comfort"
  },
  {
    traditionId: 1,
    source: "Job 14:7-9",
    title: "Hope of a Tree",
    content: "For there is hope of a tree, if it be cut down, that it will sprout again, and that the tender branch thereof will not cease.",
    context: "Job's reflection on resilience and renewal even in suffering",
    theme: "Resilience and Hope"
  },
  {
    traditionId: 1,
    source: "Matthew 6:26",
    title: "Consider the Birds",
    content: "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?",
    context: "Jesus teaching about trust and divine provision",
    theme: "Trust and Providence"
  },

  // Qur'an
  {
    traditionId: 2,
    source: "Qur'an 2:286",
    title: "Not Beyond Your Strength",
    content: "Allah does not burden a soul beyond that it can bear. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned.",
    context: "Divine wisdom about human capacity and divine justice",
    theme: "Divine Mercy and Human Capacity"
  },
  {
    traditionId: 2,
    source: "Qur'an 94:5-6",
    title: "With Hardship Comes Ease",
    content: "So truly with hardship comes ease. Truly with hardship comes ease.",
    context: "Comfort and hope during difficult times",
    theme: "Hope in Difficulty"
  },

  // Bhagavad Gita
  {
    traditionId: 3,
    source: "Bhagavad Gita 2:47",
    title: "The Right to Action",
    content: "You have the right to perform your actions, but you are not entitled to the fruits of your actions. Do not let the results be your motive, nor let your attachment be to inaction.",
    context: "Krishna's teaching to Arjuna about duty without attachment to results",
    theme: "Detachment and Duty"
  },
  {
    traditionId: 3,
    source: "Bhagavad Gita 6:5",
    title: "Self as Friend and Enemy",
    content: "A person must elevate themselves by their own mind, not degrade themselves. The mind alone is one's friend as well as one's enemy.",
    context: "Teaching on self-mastery and mental discipline",
    theme: "Self-Mastery"
  },

  // Dhammapada
  {
    traditionId: 4,
    source: "Dhammapada 1:1",
    title: "The Mind's Creation",
    content: "All that we are is the result of what we have thought. If a man speaks or acts with an evil thought, pain follows him. If a man speaks or acts with a pure thought, happiness follows him, like a shadow that never leaves him.",
    context: "Buddha's teaching on the power of thought and its consequences",
    theme: "Mindfulness and Thought"
  },
  {
    traditionId: 4,
    source: "Dhammapada 223",
    title: "Conquering Anger with Love",
    content: "Conquer anger with non-anger. Conquer badness with goodness. Conquer meanness with generosity. Conquer dishonesty with truth.",
    context: "Buddha's teaching on transforming negative emotions",
    theme: "Compassion and Transformation"
  },

  // Tao Te Ching
  {
    traditionId: 5,
    source: "Tao Te Ching 78",
    title: "Water's Wisdom",
    content: "Nothing in the world is softer than water, yet nothing is better at overcoming the hard and strong. This is because nothing can substitute for it.",
    context: "Lao Tzu's teaching on the power of gentleness and persistence",
    theme: "Gentleness and Persistence"
  },
  {
    traditionId: 5,
    source: "Tao Te Ching 33",
    title: "Knowing Others and Self",
    content: "Knowing others is wisdom; knowing yourself is enlightenment. Mastering others is strength; mastering yourself is true power.",
    context: "Teaching on self-knowledge and true power",
    theme: "Self-Knowledge and Wisdom"
  },

  // Upanishads
  {
    traditionId: 6,
    source: "Chandogya Upanishad 6.8.7",
    title: "Thou Art That",
    content: "That which is the finest essence—this whole world has that as its soul. That is Reality. That is Atman. Thou art That.",
    context: "Teaching on the unity of individual soul with universal consciousness",
    theme: "Unity and Divine Nature"
  },
  {
    traditionId: 6,
    source: "Isha Upanishad 1",
    title: "All is Divine",
    content: "The entire universe is pervaded by the Lord. Find your enjoyment in renunciation; do not covet what belongs to others.",
    context: "Teaching on seeing the divine in everything and contentment",
    theme: "Divine Presence and Contentment"
  },

  // Talmud & Midrash
  {
    traditionId: 7,
    source: "Talmud, Sanhedrin 37a",
    title: "Saving One Life",
    content: "Whoever saves one life, it is as if they saved an entire world.",
    context: "Rabbinic teaching on the infinite value of each human life",
    theme: "Human Dignity and Compassion"
  },
  {
    traditionId: 7,
    source: "Pirkei Avot 1:14",
    title: "Hillel's Wisdom",
    content: "If I am not for myself, who will be for me? And if I am only for myself, what am I? And if not now, when?",
    context: "Hillel's teaching on balancing self-care with service to others",
    theme: "Balance and Action"
  }
];

// SVG artwork patterns for different traditions
export const traditionalArtwork = {
  bible: [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f7f3f0'/%3E%3Cstop offset='100%25' stop-color='%23e8ddd4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Ccircle r='80' fill='none' stroke='%23b8860b' stroke-width='3' opacity='0.6'/%3E%3Cpath d='M-40,-20 L40,-20 L40,20 L-40,20 Z' fill='%23daa520' opacity='0.8'/%3E%3Cpath d='M-20,-40 L20,-40 L20,40 L-20,40 Z' fill='%23b8860b' opacity='0.9'/%3E%3Ctext y='120' text-anchor='middle' font-family='serif' font-size='18' fill='%236b5b47'%3EChristian Illuminated Art%3C/text%3E%3C/g%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3CradialGradient id='bg'%3E%3Cstop offset='0%25' stop-color='%23faf7f2'/%3E%3Cstop offset='100%25' stop-color='%23e6d7c3'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Ccircle r='120' fill='none' stroke='%23cd853f' stroke-width='2' opacity='0.4'/%3E%3Ccircle r='60' fill='%23daa520' opacity='0.3'/%3E%3Cpath d='M-30,-60 L30,-60 L30,60 L-30,60 Z' fill='%23b8860b' opacity='0.7'/%3E%3Cpath d='M-60,-30 L60,-30 L60,30 L-60,30 Z' fill='%23cd853f' opacity='0.6'/%3E%3Ctext y='150' text-anchor='middle' font-family='serif' font-size='16' fill='%236b5b47'%3EByzantine Cross Pattern%3C/text%3E%3C/g%3E%3C/svg%3E"
  ],
  quran: [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f0f8e8'/%3E%3Cstop offset='100%25' stop-color='%23d4e6c7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Cpath d='M-80,0 A80,80 0 1,1 80,0 A80,80 0 1,1 -80,0 Z' fill='none' stroke='%23228b22' stroke-width='3' opacity='0.7'/%3E%3Cg transform='rotate(45)'%3E%3Crect x='-60' y='-60' width='120' height='120' fill='none' stroke='%2332cd32' stroke-width='2' opacity='0.6'/%3E%3C/g%3E%3Cpath d='M-40,0 L0,-40 L40,0 L0,40 Z' fill='%23228b22' opacity='0.5'/%3E%3Ctext y='120' text-anchor='middle' font-family='serif' font-size='18' fill='%232d5016'%3EIslamic Geometric Art%3C/text%3E%3C/g%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3CradialGradient id='bg'%3E%3Cstop offset='0%25' stop-color='%23f5f9f5'/%3E%3Cstop offset='100%25' stop-color='%23e0ede0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Cg%3E%3Cpath d='M0,-60 L52,-18 L32,48 L-32,48 L-52,-18 Z' fill='%2332cd32' opacity='0.4'/%3E%3Cpath d='M0,-40 L35,-12 L21,32 L-21,32 L-35,-12 Z' fill='%23228b22' opacity='0.6'/%3E%3C/g%3E%3Ctext y='100' text-anchor='middle' font-family='serif' font-size='16' fill='%232d5016'%3ECalligraphic Pattern%3C/text%3E%3C/g%3E%3C/svg%3E"
  ],
  "bhagavad-gita": [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23fff8dc'/%3E%3Cstop offset='100%25' stop-color='%23ffeaa7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Ccircle r='100' fill='none' stroke='%23ff7f00' stroke-width='4' opacity='0.6'/%3E%3Cg%3E%3Cpath d='M0,-80 L20,-20 L80,-20 L35,10 L55,70 L0,40 L-55,70 L-35,10 L-80,-20 L-20,-20 Z' fill='%23ff8c00' opacity='0.7'/%3E%3C/g%3E%3Ccircle r='30' fill='%23ffa500' opacity='0.8'/%3E%3Ctext y='130' text-anchor='middle' font-family='serif' font-size='18' fill='%23cc5500'%3EHindu Sacred Lotus%3C/text%3E%3C/g%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3CradialGradient id='bg'%3E%3Cstop offset='0%25' stop-color='%23fffacd'/%3E%3Cstop offset='100%25' stop-color='%23f4d03f'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Cg%3E%3Ccircle r='80' fill='none' stroke='%23ff6347' stroke-width='3' opacity='0.5'/%3E%3Ccircle r='50' fill='none' stroke='%23ff7f00' stroke-width='2' opacity='0.7'/%3E%3Ccircle r='20' fill='%23ffa500' opacity='0.8'/%3E%3C/g%3E%3Ctext y='120' text-anchor='middle' font-family='serif' font-size='16' fill='%23cc5500'%3EKrishna's Divine Wheel%3C/text%3E%3C/g%3E%3C/svg%3E"
  ],
  dhammapada: [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f3e5f5'/%3E%3Cstop offset='100%25' stop-color='%23e1bee7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Cg%3E%3Cpath d='M0,-60 C30,-60 60,-30 60,0 C60,30 30,60 0,60 C-30,60 -60,30 -60,0 C-60,-30 -30,-60 0,-60 Z' fill='%23ba68c8' opacity='0.6'/%3E%3Cpath d='M0,-40 C20,-40 40,-20 40,0 C40,20 20,40 0,40 C-20,40 -40,20 -40,0 C-40,-20 -20,-40 0,-40 Z' fill='%239c27b0' opacity='0.7'/%3E%3Ccircle r='15' fill='%23673ab7' opacity='0.9'/%3E%3C/g%3E%3Ctext y='90' text-anchor='middle' font-family='serif' font-size='18' fill='%234a148c'%3EBuddhist Lotus Wisdom%3C/text%3E%3C/g%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3CradialGradient id='bg'%3E%3Cstop offset='0%25' stop-color='%23f8f4ff'/%3E%3Cstop offset='100%25' stop-color='%23e8d5ff'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Ccircle r='80' fill='none' stroke='%239c27b0' stroke-width='3' opacity='0.5'/%3E%3Cg%3E%3Cpath d='M-50,0 L-25,-43 L25,-43 L50,0 L25,43 L-25,43 Z' fill='%23ba68c8' opacity='0.6'/%3E%3C/g%3E%3Ctext y='110' text-anchor='middle' font-family='serif' font-size='16' fill='%234a148c'%3EDharma Wheel Pattern%3C/text%3E%3C/g%3E%3C/svg%3E"
  ],
  "tao-te-ching": [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f5f5f5'/%3E%3Cstop offset='100%25' stop-color='%23e0e0e0'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Ccircle r='80' fill='none' stroke='%23696969' stroke-width='3' opacity='0.7'/%3E%3Cg%3E%3Cpath d='M0,-60 A60,60 0 0,1 0,60 A60,30 0 0,1 0,-60 Z' fill='%23000' opacity='0.8'/%3E%3Cpath d='M0,-60 A60,60 0 0,0 0,60 A60,30 0 0,0 0,-60 Z' fill='%23fff' opacity='0.9'/%3E%3Ccircle cy='-30' r='15' fill='%23fff'/%3E%3Ccircle cy='30' r='15' fill='%23000'/%3E%3C/g%3E%3Ctext y='110' text-anchor='middle' font-family='serif' font-size='18' fill='%232f2f2f'%3ETaoist Yin Yang Harmony%3C/text%3E%3C/g%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3CradialGradient id='bg'%3E%3Cstop offset='0%25' stop-color='%23fafafa'/%3E%3Cstop offset='100%25' stop-color='%23e8e8e8'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Cg%3E%3Cpath d='M-60,-60 Q0,-30 60,-60 Q30,0 60,60 Q0,30 -60,60 Q-30,0 -60,-60 Z' fill='none' stroke='%23808080' stroke-width='2' opacity='0.6'/%3E%3Ccircle r='40' fill='none' stroke='%23696969' stroke-width='2' opacity='0.7'/%3E%3C/g%3E%3Ctext y='100' text-anchor='middle' font-family='serif' font-size='16' fill='%232f2f2f'%3EFlowing Water Pattern%3C/text%3E%3C/g%3E%3C/svg%3E"
  ],
  upanishads: [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23fff9c4'/%3E%3Cstop offset='100%25' stop-color='%23ffeb3b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Cg%3E%3Cpath d='M0,-80 L25,-25 L80,-25 L40,10 L60,65 L0,35 L-60,65 L-40,10 L-80,-25 L-25,-25 Z' fill='%23f57f17' opacity='0.7'/%3E%3Cpath d='M0,-50 L15,-15 L50,-15 L25,5 L35,40 L0,20 L-35,40 L-25,5 L-50,-15 L-15,-15 Z' fill='%23ff9800' opacity='0.8'/%3E%3C/g%3E%3Cpath d='M-30,80 Q0,50 30,80' fill='none' stroke='%23f57f17' stroke-width='3'/%3E%3Ctext y='110' text-anchor='middle' font-family='serif' font-size='18' fill='%23e65100'%3EVedic Fire Symbol%3C/text%3E%3C/g%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3CradialGradient id='bg'%3E%3Cstop offset='0%25' stop-color='%23fffde7'/%3E%3Cstop offset='100%25' stop-color='%23fff176'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Ccircle r='100' fill='none' stroke='%23ff8f00' stroke-width='4' opacity='0.6'/%3E%3Cg%3E%3Ctext font-family='serif' font-size='36' fill='%23f57f17' text-anchor='middle' y='10'%3EOM%3C/text%3E%3C/g%3E%3Ctext y='130' text-anchor='middle' font-family='serif' font-size='16' fill='%23e65100'%3ESacred Sanskrit Om%3C/text%3E%3C/g%3E%3C/svg%3E"
  ],
  talmud: [
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23f0f4ff'/%3E%3Cstop offset='100%25' stop-color='%23c5cae9'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Cg%3E%3Cpath d='M0,-60 L52,-18 L52,18 L0,60 L-52,18 L-52,-18 Z' fill='%23303f9f' opacity='0.7'/%3E%3Cpath d='M0,-40 L35,-12 L35,12 L0,40 L-35,12 L-35,-12 Z' fill='%233f51b5' opacity='0.8'/%3E%3C/g%3E%3Ctext y='90' text-anchor='middle' font-family='serif' font-size='18' fill='%231a237e'%3EStar of David Pattern%3C/text%3E%3C/g%3E%3C/svg%3E",
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Cdefs%3E%3CradialGradient id='bg'%3E%3Cstop offset='0%25' stop-color='%23f5f7ff'/%3E%3Cstop offset='100%25' stop-color='%23d1c4e9'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23bg)'/%3E%3Cg transform='translate(400,300)'%3E%3Cg%3E%3Crect x='-80' y='-60' width='160' height='120' fill='none' stroke='%233f51b5' stroke-width='3' opacity='0.6'/%3E%3Cpath d='M-60,-40 L60,-40 M-60,-20 L60,-20 M-60,0 L60,0 M-60,20 L60,20 M-60,40 L60,40' stroke='%23303f9f' stroke-width='1' opacity='0.5'/%3E%3C/g%3E%3Ctext y='90' text-anchor='middle' font-family='serif' font-size='16' fill='%231a237e'%3ETalmudic Text Pattern%3C/text%3E%3C/g%3E%3C/svg%3E"
  ]
};

// Lesson generation templates for different themes
export const lessonTemplates = {
  "Trust and Comfort": {
    titleTemplates: [
      "Finding Peace in [situation]",
      "Trust When [challenge]",
      "Comfort in [difficulty]"
    ],
    storyStructure: "context -> challenge -> wisdom -> application",
    lifeLessonTemplates: [
      "Trust deepens when we surrender control and find peace in divine guidance.",
      "Even in darkness, we are never alone—comfort comes from knowing we are held.",
      "True security comes not from controlling outcomes but from trusting the process."
    ]
  },
  "Detachment and Duty": {
    titleTemplates: [
      "Acting Without Attachment",
      "Duty Beyond Results",
      "The Freedom of [action]"
    ],
    storyStructure: "duty -> attachment problem -> teaching -> liberation",
    lifeLessonTemplates: [
      "Freedom comes when we act with full commitment but release attachment to outcomes.",
      "Do your best and let go—this is the path to both effectiveness and peace.",
      "True action flows from love of the work itself, not hunger for its fruits."
    ]
  },
  "Mindfulness and Thought": {
    titleTemplates: [
      "The Mind's Garden",
      "Cultivating [quality] Thoughts",
      "The Power of [mental state]"
    ],
    storyStructure: "mental state -> consequences -> teaching -> practice",
    lifeLessonTemplates: [
      "What we think, we become—choose your thoughts like you choose your friends.",
      "The mind is both our greatest tool and our biggest challenge—train it with compassion.",
      "Every thought is a seed; plant wisely for the garden of your life."
    ]
  }
};
