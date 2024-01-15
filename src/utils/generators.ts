import NAMES from "../../NFT_Collection_NAME.json";
import DESCRIPTIONS from "../../NFT_Collection_Descriptions.json";

export const generateNftDescription = (): string => {
    const descriptionsArray = Object.values(DESCRIPTIONS);
    const index = Math.floor(Math.random() * descriptionsArray.length);
    return descriptionsArray[index];
};

export const generateNftName = (): string => {
    const index = Math.floor(Math.random() * NAMES.length);
    return NAMES[index];
};

export const generateIntNumber = (max: number) => {
    return Math.floor(Math.random() * max);
};

export const generateColor = () => {
    const R = generateIntNumber(255).toString(16);
    const G = generateIntNumber(255).toString(16);
    const B = generateIntNumber(255).toString(16);
    return `#${R}${G}${B}`;
};

export const generateGradient = (deg?: number) => {
    const rec = deg || 0;
    const startColor = generateColor();
    const endColor = generateColor();
    return `linear-gradient(${rec}deg, ${startColor} 0.52%, ${endColor} 100.52%)`;
};