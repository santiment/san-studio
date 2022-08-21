export declare enum Color {
    porcelain = "#e7eaf3",
    mystic = "#d2d6e6",
    casper = "#9faac4",
    waterloo = "#7a859e",
    mirage = "#181b2b",
    shark = "#15181f",
    rhino = "#2f354d",
    cloudBurst = "#222639",
    baliHai = "#8b93b6"
}
export declare const dayAxesColor = Color.porcelain;
export declare const nightAxesColor = Color.cloudBurst;
export declare const dayHoverLineColor = Color.casper;
export declare const nightHoverLineColor = Color.rhino;
export declare const dayTicksTheme: {
    color: Color;
    font: string;
};
export declare const nightTicksTheme: {
    color: Color;
    font: string;
};
export declare const dayBubblesTheme: {
    font: string;
    bgColor: Color;
    textColor: Color;
};
export declare const nightBubblesTheme: {
    font: string;
    bgColor: Color;
    textColor: Color;
};
export declare const dayTooltipTheme: {
    font: string;
    headerFill: Color;
    borderColor: Color;
    contentFill: string;
    headerColor: Color;
    valueColor: Color;
    labelColor: Color;
};
export declare const nightTooltipTheme: {
    font: string;
    headerFill: Color;
    borderColor: Color;
    contentFill: Color;
    headerColor: Color;
    valueColor: Color;
    labelColor: string;
};
export declare const dayBrushTheme: {
    bgColor: Color;
    fadeColor: Color;
    handleColor: Color;
};
export declare const nightBrushTheme: {
    bgColor: Color;
    fadeColor: Color;
    handleColor: Color;
};
export declare const dayDrawerTheme: {
    bgColor: Color;
    font: string;
    textColor: Color;
};
export declare const nightDrawerTheme: {
    bgColor: Color;
    font: string;
    textColor: Color;
};
export declare const themes: ({
    bg: string;
    text: Color;
    axes: Color;
    hoverLine: Color;
    ticks: {
        color: Color;
        font: string;
    };
    bubbles: {
        font: string;
        bgColor: Color;
        textColor: Color;
    };
    tooltip: {
        font: string;
        headerFill: Color;
        borderColor: Color;
        contentFill: string;
        headerColor: Color;
        valueColor: Color;
        labelColor: Color;
    };
    brush: {
        bgColor: Color;
        fadeColor: Color;
        handleColor: Color;
    };
    drawer: {
        bgColor: Color;
        font: string;
        textColor: Color;
    };
} | {
    bg: Color;
    text: string;
    axes: Color;
    hoverLine: Color;
    ticks: {
        color: Color;
        font: string;
    };
    bubbles: {
        font: string;
        bgColor: Color;
        textColor: Color;
    };
    tooltip: {
        font: string;
        headerFill: Color;
        borderColor: Color;
        contentFill: Color;
        headerColor: Color;
        valueColor: Color;
        labelColor: string;
    };
    brush: {
        bgColor: Color;
        fadeColor: Color;
        handleColor: Color;
    };
    drawer: {
        bgColor: Color;
        font: string;
        textColor: Color;
    };
})[];
