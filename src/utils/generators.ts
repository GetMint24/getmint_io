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