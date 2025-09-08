export type EventType = 'conference' | 'competition' | 'career' | 'marathon' | 'workshop' | 'seminar';

export interface AppEvent {
    id: string;
    title: string;
    tagline?: string;
    description?: string;
    dateISO: string; // ISO timestamp for event start
    endDateISO?: string; // optional end timestamp
    location: string;
    type: EventType;
    fee?: number;
    stats?: {
        registrants?: number;
        prizePoolUSD?: number;
    };
    heroImageUrl?: string; // background image for detail hero
    logoUrl?: string; // small logo in details panel
    organizer?: {
        name: string;
        logoUrl?: string;
    };
    capacity?: number;
    registeredUserAvatars?: string[];
}

// Temporary in-memory dataset. Replace with Supabase later.
export const EVENTS: AppEvent[] = [
    {
        id: '1',
        title: 'Tech Innovation Summit 2024',
        tagline: 'India\'s Biggest Innovation Conference',
        description: 'A day of talks on cutting-edge technology and innovation.',
        dateISO: '2025-10-15T09:00:00.000Z',
        endDateISO: '2025-10-15T17:00:00.000Z',
        location: 'Main Auditorium',
        type: 'conference',
        fee: 0,
        stats: { registrants: 2000, prizePoolUSD: 405000 },
        heroImageUrl: '/placeholder.svg',
        logoUrl: '/favicon.ico',
        organizer: { name: 'Tech University', logoUrl: '/favicon.ico' },
        capacity: 3000,
        registeredUserAvatars: ['/favicon.ico']
    },
    {
        id: '2',
        title: 'Hackathon: Sustainable Solutions',
        tagline: 'Build for a Greener Future',
        description: 'Build projects that drive sustainability.',
        dateISO: '2025-10-22T10:00:00.000Z',
        endDateISO: '2025-10-22T18:00:00.000Z',
        location: 'Computer Lab 2',
        type: 'competition',
        fee: 0,
        stats: { registrants: 350, prizePoolUSD: 1500 },
        heroImageUrl: '/placeholder.svg',
        logoUrl: '/favicon.ico',
        organizer: { name: 'Green Labs', logoUrl: '/favicon.ico' },
        capacity: 500,
        registeredUserAvatars: ['/favicon.ico']
    },
    {
        id: '3',
        title: 'Career Fair 2024',
        tagline: 'Hire your dream team',
        description: 'Meet top companies hiring across domains.',
        dateISO: '2025-10-28T11:00:00.000Z',
        endDateISO: '2025-10-28T16:00:00.000Z',
        location: 'Sports Complex',
        type: 'career',
        fee: 0,
        stats: { registrants: 1200, prizePoolUSD: 250000 },
        heroImageUrl: '/placeholder.svg',
        logoUrl: '/favicon.ico',
        organizer: { name: 'Placement Cell', logoUrl: '/favicon.ico' },
        capacity: 2000,
        registeredUserAvatars: ['/favicon.ico']
    }
];

export function findEventById(eventId: string | undefined): AppEvent | undefined {
    if (!eventId) return undefined;
    return EVENTS.find(e => e.id === eventId);
}

export function formatCurrencyINR(amount: number | undefined): string | undefined {
    if (amount === undefined) return undefined;
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}


