export const benchmarks = {
    levels: [
        { id: 'lvl1', name: 'Level 1' },
        { id: 'lvl2', name: 'Level 2' },
        { id: 'lvl3', name: 'Level 3' }
    ],
    models: [
        {
            name: 'Claude 4.6 Sonnet (with extended reasoning)',
            scores: {
                'lvl1': 12,
                'lvl2': 5,
                'lvl3': 2,
                'lvl4': 0,
                'lvl5': 0
            },
            releaseDate: '2026-02-21'
        },
        {
            name: 'Gemini 3.1 Pro Preview',
            scores: {
                'lvl1': 75,
                'lvl2': 64,
                'lvl3': 62,
                'lvl4': 0,
                'lvl5': 0
            },
            releaseDate: '2026-02-20'
        },
        {
            name: 'Gemini 3.1 Pro Preview (with code execution)',
            scores: {
                'lvl1': 84,
                'lvl2': 73,
                'lvl3': 56,
                'lvl4': 0,
                'lvl5': 0
            },
            releaseDate: '2026-02-20'
        },
        {
            name: 'Gemini 3.1 Flashlite GA',
            scores: {
                'lvl1': 38,
                'lvl2': 33,
                'lvl3': 39,
                'lvl4': 0,
                'lvl5': 0
            }
        },
        {
            name: 'Gemini 3.1 Flashlite GA (with code execution)',
            scores: {
                'lvl1': 40,
                'lvl2': 33,
                'lvl3': 43,
                'lvl4': 0,
                'lvl5': 0
            }
        },
        {
            name: 'Gemini 3.0 Flash Preview (with code execution)',
            scores: {
                'lvl1': 85,
                'lvl2': 61,
                'lvl3': 66,
                'lvl4': 4,
                'lvl5': 0
            },
            releaseDate: '2026-02-06'
        },
        {
            name: 'Gemini 2.5 Pro',
            scores: {
                'lvl1': 40,
                'lvl2': 32,
                'lvl3': 44,
                'lvl4': 0,
                'lvl5': 0
            }
        },
        {
            name: 'Gemini 3.0 Pro Preview',
            scores: {
                'lvl1': 42,
                'lvl2': 50,
                'lvl3': 35,
                'lvl4': 2,
                'lvl5': 0
            }
        },
        {
            name: 'Gemini 3.1 Flashlite Preview',
            scores: {
                'lvl1': 30,
                'lvl2': 29,
                'lvl3': 63,
                'lvl4': 0,
                'lvl5': 0
            }
        },
        {
            name: 'Gemini 3.0 Flash Preview',
            scores: {
                'lvl1': 81,
                'lvl2': 60,
                'lvl3': 54,
                'lvl4': 3,
                'lvl5': 0
            }
        },
        {
            name: 'Gemini 2.5 Flash',
            scores: {
                'lvl1': 6,
                'lvl2': 11,
                'lvl3': 13,
                'lvl4': 0,
                'lvl5': 0
            }
        },
        {
            name: 'Grok 4.20 Expert',
            scores: {
                'lvl1': 10,
                'lvl2': 7,
                'lvl3': 3,
                'lvl4': 0,
                'lvl5': 0
            },
            releaseDate: '2026-02-18'
        },
        {
            name: 'Muse Spark (with reasoning)',
            scores: {
                'lvl1': 0,
                'lvl2': 0,
                'lvl3': 0,
                'lvl4': 0,
                'lvl5': 0
            }
        },
        {
            name: 'GPT-5.5 Instant',
            scores: {
                'lvl1': 30,
                'lvl2': 38,
                'lvl3': 19,
                'lvl4': 0,
                'lvl5': 0
            }
        },
        {
            name: 'Grok 4.3 Fast',
            scores: {
                'lvl1': 6,
                'lvl2': 4,
                'lvl3': 0,
                'lvl4': 0,
                'lvl5': 0
            }
        }
    ],
    dataRetrieval: [
        { name: 'Grok 4.20 Expert', scores: { worm: 24, koala: "UNAVAILABLE", crow: "UNAVAILABLE" }, releaseDate: '2026-02-18' },
        { name: 'Grok 4.3 Fast', scores: { worm: 27, koala: 21, crow: 7 } },
        { name: 'Gemini 3.1 Pro Preview', scores: { worm: 20, koala: 11, crow: 11 } },
        { name: 'Muse Spark (with reasoning)', scores: { worm: 13, koala: 0, crow: 0 } },
        { name: 'Claude 4.6 Sonnet (with extended thinking)', scores: { worm: 9, koala: 10, crow: 3 }, releaseDate: '2026-02-21' },
        { name: 'GPT-5.5 Instant', scores: { worm: 34, koala: 3, crow: 0 } }
    ]
};
