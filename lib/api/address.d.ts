export declare const queryNftCollection: (address: string, infrastructure: string) => Promise<{
    name: string;
}>;
export declare const checkIsNftAddress: (labels: {
    name: string;
}[]) => boolean;
export declare const queryAddressLabels: (address: string, infrastructure: string) => Promise<{
    name: string;
}[]>;
