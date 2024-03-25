export declare function getViewOnSantimentLink(settings: any, widget: any): string;
export declare function IframeMessage<Data>(type: string): {
    listen<T extends (data: Data) => void>(clb: T): void;
    send(data: Data): void;
};
export declare const AssetMessage: {
    listen<T extends (data: {
        slug: string;
        ticker: string;
    }) => void>(clb: T): void;
    send(data: {
        slug: string;
        ticker: string;
    }): void;
};
export declare const DatesMessage: {
    listen<T extends (data: {
        from: string;
        to: string;
    }) => void>(clb: T): void;
    send(data: {
        from: string;
        to: string;
    }): void;
};
export declare const ThemeMessage: {
    listen<T extends (data: {
        dark: boolean;
    }) => void>(clb: T): void;
    send(data: {
        dark: boolean;
    }): void;
};
export declare const AdaptiveLayoutMessage: {
    listen<T extends (data: {
        minimized?: boolean | undefined;
        controls?: boolean | undefined;
    }) => void>(clb: T): void;
    send(data: {
        minimized?: boolean | undefined;
        controls?: boolean | undefined;
    }): void;
};
