import {  Contract, ethers } from "ethers";
import { BridgeType } from "../../common/enums/BridgeType";
import { LZ_VERSION } from "../constants";
import { DEFAULT_REFUEL_COST_USD } from "../../common/constants";
import { NetworkName } from "../../common/enums/NetworkName";

interface ChainToSend {
    id: number;
    name: string;
    network: string;
    lzChain: number | null;
    hyperlaneChain: number | null;
    token: string;
}

export const estimateFeeForHyperlane = async (contract: Contract, sender: string, chainToSend: ChainToSend, price: number | null) => {
    const _receiver = sender.replace('0x', '0x000000000000000000000000');

    const nativeFee = await contract.getHyperlaneMessageFee(
        chainToSend.hyperlaneChain,
        _receiver
    );

    const fee = nativeFee + await contract.bridgeFee()
    const formatted = ethers.formatEther(fee);

    return {
        network: chainToSend.network as NetworkName,
        price: (price! * parseFloat(formatted)).toFixed(2)
    }
}

const estimateFeeForLZ = async (
    contract: Contract, 
    sender: string, 
    chainToSend: ChainToSend, 
    refuel: boolean = false, 
    refuelCost: number, 
    price: number | null,
    tokenId: number,
) => {
    const _toAddress = ethers.solidityPacked(
        ["address"], [sender]
    );
   
    const MIN_DST_GAS = await contract.minDstGasLookup(chainToSend?.lzChain, LZ_VERSION);
    
    let adapterParams;

    if (refuel) {
        if (!price) {
            return null;
        }
        const REFUEL_AMOUNT = (refuelCost / price).toFixed(8);
        const refuelAmountEth = ethers.parseUnits(
            REFUEL_AMOUNT,
            18
        );
        adapterParams = ethers.solidityPacked(
            ["uint16", "uint256", "uint256", "address"],
            [2, MIN_DST_GAS, refuelAmountEth, sender]
        );
    } else {
        adapterParams = ethers.solidityPacked(
            ["uint16", "uint256"],
            [LZ_VERSION, MIN_DST_GAS]
        );
    }

    const { nativeFee } = await contract.estimateSendFee(
        chainToSend?.lzChain,
        _toAddress,
        tokenId,
        false,
        adapterParams
    );

    const formatted = ethers.formatEther(nativeFee);

    return {
        network: chainToSend.network as NetworkName,
        price: (price! * parseFloat(formatted)).toFixed(2)
    }
}

export const estimateFeeForBridge = (
    contract: Contract, 
    sender: string, 
    bridgeType: BridgeType, 
    refuel: boolean = false, 
    refuelCost: number = DEFAULT_REFUEL_COST_USD,
    price: number | null,
    tokenId: number,
    chainToSend: ChainToSend
) => {
    if (bridgeType === BridgeType.Hyperlane) {
        return estimateFeeForHyperlane(contract, sender, chainToSend, price)
    } else {
        return estimateFeeForLZ(contract, sender, chainToSend, refuel, refuelCost, price, tokenId)
    }
}