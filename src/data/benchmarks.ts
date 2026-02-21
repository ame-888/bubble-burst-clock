export const benchmarks = {
    levels: [
        { id: 'lvl1', name: 'Level 1' },
        { id: 'lvl2', name: 'Level 2' },
        { id: 'lvl3', name: 'Level 3' }
    ],
    models: [
        {
            name: 'Human Baseline',
            scores: {
                'lvl1': 100,
                'lvl2': 100,
                'lvl3': 100
            }
        },
        {
            name: 'Claude 4.6 Sonnet (with extended reasoning)',
            scores: {
                'lvl1': 6.3,
                'lvl2': 6.3,
                'lvl3': 6.3
            },
            releaseDate: '2026-02-21'
        },
        {
            name: 'Gemini 3.1 Pro Preview',
            scores: {
                'lvl1': 67,
                'lvl2': 67,
                'lvl3': 67
            },
            releaseDate: '2026-02-20'
        },
        {
            name: 'Gemini 3.0 Flash Preview (with code execution)',
            scores: {
                'lvl1': 70.6,
                'lvl2': 70.6,
                'lvl3': 70.6
            },
            releaseDate: '2026-02-06'
        },
        {
            name: 'Gemini 2.5 Pro',
            scores: {
                'lvl1': 40,
                'lvl2': 32,
                'lvl3': 44
            }
        },
        {
            name: 'Gemini 3.0 Pro Preview',
            scores: {
                'lvl1': 42,
                'lvl2': 50,
                'lvl3': 35
            }
        },
        {
            name: 'Gemini 3.0 Flash Preview',
            scores: {
                'lvl1': 81,
                'lvl2': 60,
                'lvl3': 54
            }
        },
        {
            name: 'Gemini 2.5 Flash',
            scores: {
                'lvl1': 6,
                'lvl2': 11,
                'lvl3': 13
            }
        },
        {
            name: 'Grok 4.20 (chat)',
            scores: {
                'lvl1': 6.66,
                'lvl2': 6.66,
                'lvl3': 6.66
            },
            releaseDate: '2026-02-18'
        }
    ],
    hardMode: [
        { name: 'Human Baseline', score: 100 },
        { name: 'Claude 4.6 Sonnet (with extended reasoning)', score: 0, releaseDate: '2026-02-21' },
        { name: 'Gemini 3.1 Pro Preview', score: 0, releaseDate: '2026-02-20' },
        { name: 'Gemini 3.0 Flash Preview (with code execution)', score: 4, releaseDate: '2026-02-06' },
        { name: 'Gemini 3.0 Flash Preview', score: 3 },
        { name: 'Gemini 3.0 Pro Preview', score: 2 },
        { name: 'Grok 4.20 (chat)', score: 0, releaseDate: '2026-02-18' },
        { name: 'Gemini 2.5 Pro', score: 0 },
        { name: 'Gemini 2.5 Flash', score: 0 }
    ],
    impossibleMode: [
        { name: 'Human Baseline', score: 100 },
        { name: 'Claude 4.6 Sonnet (with extended reasoning)', score: 0, releaseDate: '2026-02-21' },
        { name: 'Gemini 3.1 Pro Preview', score: 0, releaseDate: '2026-02-20' },
        { name: 'Gemini 3.0 Flash Preview (with code execution)', score: 0, releaseDate: '2026-02-06' },
        { name: 'Gemini 3.0 Flash Preview', score: 0 },
        { name: 'Gemini 3.0 Pro Preview', score: 0 },
        { name: 'Grok 4.20 (chat)', score: 0, releaseDate: '2026-02-18' },
        { name: 'Gemini 2.5 Pro', score: 0 },
        { name: 'Gemini 2.5 Flash', score: 0 }
    ]
};
