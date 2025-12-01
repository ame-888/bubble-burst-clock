export const benchmarks = {
    levels: [
        { id: 'lvl1', name: 'Level 1' },
        { id: 'lvl2', name: 'Level 2' },
        { id: 'lvl3', name: 'Level 3' }
    ],
    models: [
        {
            name: 'Gemini 2.5 Pro',
            scores: {
                'lvl1': 40,
                'lvl2': 32,
                'lvl3': 44
            }
        },
        {
            name: 'Gemini 3.0 Pro',
            scores: {
                'lvl1': 42,
                'lvl2': 50,
                'lvl3': 35
            }
        }
    ]
};
