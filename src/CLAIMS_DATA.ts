// Definimos a "forma" dos nossos dados.
export interface Claim {
    date: string;
    claimer: string;
    thumbnailUrl: string;
    claim: string;
    link: string;
    status: string;
    claimType: string;
    notes?: string;
}

// A lista de dados COMPLETA.
export const CLAIMS_DATA: Claim[] = [
    {
        date: "2023-05-23",
        claimer: "CNBC Television",
        thumbnailUrl: "https://i.ytimg.com/vi/LDcfPDIobvw/mqdefault.jpg",
        claim: '"The AI bubble is already bursting, says Deepwater\'s Gene Munster"',
        link: "https://www.youtube.com/watch?v=LDcfPDIobvw",
        status: "Expired - Unproven",
        claimType: "Title Only",
        notes: "Claim made by guest Gene Munster. The market has since grown significantly."
    },
    {
        date: "2024-07-03",
        claimer: "Adam Conover",
        thumbnailUrl: "https://i.ytimg.com/vi/T8ByoAt5gCA/mqdefault.jpg",
        claim: '"The A.I. Bubble is Bursting with Ed Zitron"',
        link: "https://www.youtube.com/watch?v=T8ByoAt5gCA",
        status: "Expired - Unproven",
        claimType: "Title Only",
        notes: "Collaboration with Ed Zitron, a prominent critic of the AI industry."
    },
    {
        date: "2025-05-21",
        claimer: "Linus Tech Tips",
        thumbnailUrl: "https://i.ytimg.com/vi/fwD9EnCzujM/mqdefault.jpg",
        claim: '"YEAH... WE MIGHT BE IN A BUBBLE"',
        link: "https://www.youtube.com/watch?v=fwD9EnCzujM",
        status: "Ongoing",
        claimType: "Title Only"
    },
    {
        date: "2025-08-16",
        claimer: "Man Carrying Thing",
        thumbnailUrl: "https://i.ytimg.com/vi/kVaS1hnBOl4/mqdefault.jpg",
        claim: '"The US economy is being propped up by an AI tech bubble! Its implementation is overvalued!"',
        link: "https://www.youtube.com/watch?v=kVaS1hnBOl4",
        status: "Ongoing",
        claimType: "In-Video Claim"
    },
    {
        date: "2025-09-08",
        claimer: "Shade of Code",
        thumbnailUrl: "https://i.ytimg.com/vi/5os_nalLwvI/mqdefault.jpg",
        claim: '"The AI Bubble is BURSTING..."',
        link: "https://www.youtube.com/watch?v=5os_nalLwvI",
        status: "Ongoing",
        claimType: "Title Only"
    },
    {
        date: "2025-09-21",
        claimer: "OverEasy",
        thumbnailUrl: "https://i.ytimg.com/vi/37aUuoRyMhM/mqdefault.jpg",
        claim: '"The AI Bubble is about to burst"',
        link: "https://www.youtube.com/watch?v=37aUuoRyMhM",
        status: "Ongoing",
        claimType: "Title Only"
    },
    {
        date: "2025-10-10",
        claimer: "Georg Rockall-Schmidt",
        thumbnailUrl: "https://i.ytimg.com/vi/FcKYvzJbTko/mqdefault.jpg",
        claim: '"AI Bubble Go Pop"',
        link: "https://www.youtube.com/watch?v=FcKYvzJbTko",
        status: "Ongoing",
        claimType: "Title Only"
    },
    {
        date: "2025-10-17",
        claimer: "Adam Conover",
        thumbnailUrl: "https://i.ytimg.com/vi/55Z4cg5Fyu4/mqdefault.jpg",
        claim: '"The entire AI industry is a bubble prime to burst"',
        link: "https://www.youtube.com/watch?v=55Z4cg5Fyu4",
        status: "Ongoing",
        claimType: "In-Video Claim"
    },
    {
        date: "2025-10-18",
        claimer: "Man Carrying Thing",
        thumbnailUrl: "https://i.ytimg.com/vi/G3_nM2vD80U/mqdefault.jpg",
        claim: '"The AI Bubble will probably crash the economy... But not yet. In like, 3 to 5 years."',
        link: "https://www.youtube.com/watch?v=G3_nM2vD80U",
        status: "Pending (Target: 2028-2030)",
        claimType: "In-Video Claim"
    }
];