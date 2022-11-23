export declare const CURRENT_USER_QUERY = "{\n  currentUser {\n    id\n    following {\n      users {\n        id\n      }\n    }\n  }\n}";
export declare type CurrentUser = {
    id: number;
    following: {
        users: {
            id: number;
        }[];
    };
} | null;
export declare const queryCurrentUser: () => Promise<CurrentUser>;
