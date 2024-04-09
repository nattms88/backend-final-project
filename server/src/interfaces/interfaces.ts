export interface IMovie {
    id: number;
    title: string;
    releaseDate: string;
    trailerLink: string;
    poster: string;
    genders: string[];
}

export interface IUser {
    id: number;
    username: string;
    email: string;
    password: string;
    role: UserRole;
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}