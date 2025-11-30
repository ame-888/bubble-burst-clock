export interface Claim {
    id: string;
    claim: { [key: string]: string };
    claimer: string;
    date: string;
    thumbnailUrl: string;
    link: string;
    status: string;
}

export const CLAIMS_DATA: Claim[] = [
    {
        id: 'G3_nM2vD80U',
        claim: {
            'en': 'The AI bubble will pop in 3 to 5 years',
            'pt-BR': 'A bolha de IA estourará em 3 a 5 anos',
            'ja': 'AIバブルは3〜5年ではじけるでしょう',
            'es': 'La burbuja de la IA estallará en 3 a 5 años',
            'zh': 'AI泡沫将在3到5年内破裂'
        },
        claimer: 'Man Carrying Thing',
        date: '2024-06-25', // Approximate based on search result context
        thumbnailUrl: 'https://img.youtube.com/vi/G3_nM2vD80U/maxresdefault.jpg',
        link: 'https://youtu.be/G3_nM2vD80U',
        status: 'ongoing'
    }
];
