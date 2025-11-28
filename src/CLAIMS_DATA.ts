// Defines the shape of our data.
export interface Claim {
    date: string;
    claimer: string;
    thumbnailUrl: string;
    claim: Record<string, string>;
    link: string;
    status: string;
    claimType: string;
    notes?: Record<string, string>;
    target?: string;
}

// The FULL data list.
export const CLAIMS_DATA: Claim[] = [
    {
        date: "2023-05-23",
        claimer: "CNBC Television",
        thumbnailUrl: "https://i.ytimg.com/vi/LDcfPDIobvw/mqdefault.jpg",
        claim: {
            en: '"The AI bubble is already bursting, says Deepwater\'s Gene Munster"',
            'pt-BR': '"A bolha da IA já está estourando, diz Gene Munster da Deepwater"',
            ja: '"ディープウォーターのジーン・マンスター氏によると、AIバブルはすでに崩壊している"',
            es: '"La burbuja de la IA ya está estallando, dice Gene Munster de Deepwater"',
            zh: '"深水公司的吉恩·蒙斯特表示，人工智能泡沫已经破裂"',
        },
        link: "https://www.youtube.com/watch?v=LDcfPDIobvw",
        status: "expired_unproven",
        claimType: "title_only",
        notes: {
            en: "Claim made by guest Gene Munster. The market has since grown significantly.",
            'pt-BR': "Alegação feita pelo convidado Gene Munster. O mercado cresceu significativamente desde então.",
            ja: "ゲストのジーン・マンスターによる主張。市場はその後大幅に成長しました。",
            es: "Afirmación hecha por el invitado Gene Munster. El mercado ha crecido significativamente desde entonces.",
            zh: "嘉宾吉恩·蒙斯特提出的主张。此后市场大幅增长。",
        }
    },
    {
        date: "2024-07-03",
        claimer: "Adam Conover",
        thumbnailUrl: "https://i.ytimg.com/vi/T8ByoAt5gCA/mqdefault.jpg",
        claim: {
            en: '"The A.I. Bubble is Bursting with Ed Zitron"',
            'pt-BR': '"A Bolha da I.A. está Estourando com Ed Zitron"',
            ja: '"エド・ジトロンと語るAIバブルの崩壊"',
            es: '"La burbuja de la I.A. está estallando con Ed Zitron"',
            zh: '"与埃德·齐特隆一起戳破人工智能泡沫"',
        },
        link: "https://www.youtube.com/watch?v=T8ByoAt5gCA",
        status: "expired_unproven",
        claimType: "title_only",
        notes: {
            en: "Collaboration with Ed Zitron, a prominent critic of the AI industry.",
            'pt-BR': "Colaboração com Ed Zitron, um proeminente crítico da indústria de IA.",
            ja: "AI業界の著名な批評家であるエド・ジトロンとのコラボレーション。",
            es: "Colaboración con Ed Zitron, un destacado crítico de la industria de la IA.",
            zh: "与著名的人工智能行业评论家埃德·齐特隆合作。",
        }
    },
    {
        date: "2025-05-21",
        claimer: "Linus Tech Tips",
        thumbnailUrl: "https://i.ytimg.com/vi/fwD9EnCzujM/mqdefault.jpg",
        claim: {
            en: '"YEAH... WE MIGHT BE IN A BUBBLE"',
            'pt-BR': '"É... PODEMOS ESTAR EM UMA BOLHA"',
            ja: '"うん... 我々はバブルの中にいるかもしれない"',
            es: '"SÍ... PODRÍAMOS ESTAR EN UNA BURBUJA"',
            zh: '"是的... 我们可能正处于泡沫之中"',
        },
        link: "https://www.youtube.com/watch?v=fwD9EnCzujM",
        status: "expired_unproven",
        claimType: "title_only"
    },
    {
        date: "2025-08-16",
        claimer: "Man Carrying Thing",
        thumbnailUrl: "https://i.ytimg.com/vi/kVaS1hnBOl4/mqdefault.jpg",
        claim: {
            en: '"The US economy is being propped up by an AI tech bubble! Its implementation is overvalued!"',
            'pt-BR': '"A economia dos EUA está sendo sustentada por uma bolha tecnológica de IA! Sua implementação está supervalorizada!"',
            ja: '"米国経済はAI技術バブルによって支えられている！その実装は過大評価されている！"',
            es: '"¡La economía de EE. UU. está siendo sostenida por una burbuja tecnológica de IA! ¡Su implementación está sobrevalorada!"',
            zh: '"美国经济正被人工智能技术泡沫支撑！其实施被高估了！"',
        },
        link: "https://www.youtube.com/watch?v=kVaS1hnBOl4",
        status: "expired_unproven",
        claimType: "in_video_claim"
    },
    {
        date: "2025-09-08",
        claimer: "Shade of Code",
        thumbnailUrl: "https://i.ytimg.com/vi/5os_nalLwvI/mqdefault.jpg",
        claim: {
            en: '"The AI Bubble is BURSTING..."',
            'pt-BR': '"A Bolha da IA está ESTOURANDO..."',
            ja: '"AIバブルは崩壊している..."',
            es: '"La burbuja de la IA está ESTALLANDO..."',
            zh: '"人工智能泡沫正在破灭..."',
        },
        link: "https://www.youtube.com/watch?v=5os_nalLwvI",
        status: "ongoing",
        claimType: "title_only"
    },
    {
        date: "2025-09-21",
        claimer: "OverEasy",
        thumbnailUrl: "https://i.ytimg.com/vi/37aUuoRyMhM/mqdefault.jpg",
        claim: {
            en: '"The AI Bubble is about to burst"',
            'pt-BR': '"A Bolha da IA está prestes a estourar"',
            ja: '"AIバブルはもうすぐ崩壊する"',
            es: '"La burbuja de la IA está a punto de estallar"',
            zh: '"人工智能泡沫即将破灭"',
        },
        link: "https://www.youtube.com/watch?v=37aUuoRyMhM",
        status: "ongoing",
        claimType: "title_only"
    },
    {
        date: "2025-10-10",
        claimer: "Georg Rockall-Schmidt",
        thumbnailUrl: "https://i.ytimg.com/vi/FcKYvzJbTko/mqdefault.jpg",
        claim: {
            en: '"AI Bubble Go Pop"',
            'pt-BR': '"Bolha da IA Vai Estourar"',
            ja: '"AIバブルが弾ける"',
            es: '"La burbuja de la IA va a estallar"',
            zh: '"人工智能泡沫破灭"',
        },
        link: "https://www.youtube.com/watch?v=FcKYvzJbTko",
        status: "ongoing",
        claimType: "title_only"
    },
    {
        date: "2025-10-17",
        claimer: "Adam Conover",
        thumbnailUrl: "https://i.ytimg.com/vi/55Z4cg5Fyu4/mqdefault.jpg",
        claim: {
            en: '"The entire AI industry is a bubble prime to burst"',
            'pt-BR': '"Toda a indústria de IA é uma bolha prestes a estourar"',
            ja: '"AI業界全体が崩壊寸前のバブルである"',
            es: '"Toda la industria de la IA es una burbuja a punto de estallar"',
            zh: '"整个AI行业就是一个即将破裂的泡沫"',
        },
        link: "https://www.youtube.com/watch?v=55Z4cg5Fyu4",
        status: "ongoing",
        claimType: "in_video_claim"
    },
    {
        date: "2025-10-18",
        claimer: "Man Carrying Thing",
        thumbnailUrl: "https://i.ytimg.com/vi/G3_nM2vD80U/mqdefault.jpg",
        claim: {
            en: '"The AI Bubble will probably crash the economy... But not yet. In like, 3 to 5 years."',
            'pt-BR': '"A Bolha da IA provavelmente vai quebrar a economia... Mas ainda não. Em uns 3 a 5 anos."',
            ja: '"AIバブルはおそらく経済を暴落させるだろう... しかし、まだだ。3年から5年後くらいに。"',
            es: '"La burbuja de la IA probablemente colapsará la economía... Pero todavía no. En unos 3 a 5 años."',
            zh: '"人工智能泡沫可能会摧毁经济......但现在还不是时候。大概在3到5年内。"',
        },
        link: "https://www.youtube.com/watch?v=G3_nM2vD80U",
        status: "pending",
        claimType: "in_video_claim",
        target: "2028-2030"
    },
    {
        date: "2025-11-27",
        claimer: "O Primo Rico",
        thumbnailUrl: "https://i.ytimg.com/vi/fczLMe5DOPI/mqdefault.jpg",
        claim: {
            en: '"The AI Bubble is Bursting! (And it\'s MUCH WORSE than you imagine)"',
            'pt-BR': '"A BOLHA DA I.A. ESTÁ ESTOURANDO! (E é BEM PIOR do que você imagina)"',
            ja: '"AIバブルは崩壊している！（そして、あなたが想像するよりもずっと悪い）"',
            es: '"¡La burbuja de la IA está estallando! (Y es MUCHO PEOR de lo que imaginas)"',
            zh: '"人工智能泡沫正在破裂！（而且比你想象的要糟糕得多）"',
        },
        link: "https://www.youtube.com/watch?v=fczLMe5DOPI",
        status: "ongoing",
        claimType: "title_only"
    }
];
