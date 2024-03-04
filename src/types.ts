export type JobResponse = {
    title: string;
    description: string;
    url: string;
    location: string;
    companyName: string;
    openingDate: string;
    closingDate: string;
    specialisation: string;
    type: string;
    technologies: string[];
    id: number;
    isVerified: boolean;
    isBookmarked: boolean;
    isOwned: boolean;
    companyUrl: string;
}

export type JobForCreation = {
    title: string;
    description: string;
    url: string;
    location: string;
    companyName: string;
    openingDate: string;
    closingDate: string;
    specialisation: string;
    type: string;
    technologies: string[];
}

export type JobForBookmark = {
    id: number;
    isBookmarked: boolean;
}

export type JobForPatch = {
    job: JobForCreation;
    id: number;
}

export type UserDetails = {
    username: string;
    password: string;
}