import { ethers } from "ethers";
import { hexToNumber } from "web3-utils";
import abi from "./abi.json";

interface ControllerFunctionProps {
    contractAddress: string;
    chainToSend?: {
        id: number;
        name: string;
        network: string;
        zlChain?: number;
    }
}

interface ControllerFunctionResult {
    result: boolean;
    message: string;
    receipt?: any;
    transactionHash?: string;
    blockId?: number;
}

const TRANSACTION_WAIT: number = 60000;

/**
 * Mint NFT Functionality
 * @param contractAddress Contract address for selected chain
 * @param chainToSend Current chain to send NFT
 */
export const mintNFT = async ({ contractAddress, chainToSend }: ControllerFunctionProps): Promise<ControllerFunctionResult> => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);

    const signer = await provider.getSigner();
    const sender = await signer.getAddress();

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const mintFee = await contract.mintFee();

    const userBalance = await provider.getBalance(sender);

    if (userBalance < mintFee) {
        return {
            result: false,
            message: 'Not enough funds to mint'
        };
    }

    let options: any = { value: BigInt(mintFee), gasLimit: BigInt(0) };
    options.gasLimit = await contract['mint()'].estimateGas(options);

    const txResponse = await contract['mint()'](options);

    // Magic for working functionality. Don't remove
    console.log("Minting..", { id: chainToSend?.id, name: chainToSend?.name, hash: txResponse?.hash });

    const receipt = await txResponse.wait(null, TRANSACTION_WAIT);
    const blockId = parseInt(`${hexToNumber(receipt.logs[0].topics[3])}`);

    return {
        result: receipt?.status === 1,
        message: receipt?.status === 1 ? 'Successful send' : (receipt?.status == null ? 'Send not confirmed' : 'Send failed'),
        transactionHash: txResponse?.hash,
        receipt,
        blockId
    }
}

/**
 * Bridge NFT Functionality
 * @param contractAddress Contract address for selected chain
 * @param chainToSend Current chain to send NFT
 * @param tokenId NFT token id for sending to another chain
 * @param refuel Refuel enabled
 *
 */
export const bridgeNFT = async (
    { contractAddress, chainToSend }: ControllerFunctionProps,
    tokenId: number,
    refuel: boolean = false
): Promise<ControllerFunctionResult> => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);

    const signer = await provider.getSigner();
    const sender = await signer.getAddress();

    const _toAddress = ethers.solidityPacked(
        ["address"], [sender]
    );

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const _dstChainId = chainToSend?.zlChain;

    const MIN_DST_GAS = await contract.minDstGasLookup(_dstChainId, 1);

    let adapterParams;
    adapterParams = ethers.solidityPacked(
        ["uint16", "uint256"],
        [1, MIN_DST_GAS]
    );

    const { nativeFee } = await contract.estimateSendFee(
        _dstChainId,
        _toAddress,
        tokenId,
        false,
        adapterParams
    );

    const userBalance = await provider.getBalance(sender);

    if (userBalance < nativeFee) {
        return {
            result: false,
            message: 'Not enough funds to send',
        }
    }

    const bridgeOptions = {
        value: nativeFee,
        gasLimit: BigInt(0)
    }

    bridgeOptions.gasLimit = await contract.sendFrom.estimateGas(
        sender,
        _dstChainId,
        _toAddress,
        tokenId,
        sender,
        ethers.ZeroAddress,
        adapterParams,
        bridgeOptions
    );

    const transaction = await contract.sendFrom(
        sender,
        _dstChainId,
        _toAddress,
        tokenId,
        sender,
        ethers.ZeroAddress,
        adapterParams,
        bridgeOptions
    );

    const receipt = await transaction.wait(null, TRANSACTION_WAIT)

    return {
        result: receipt?.status === 1,
        message: receipt?.status === 1 ? 'Successful send' : (receipt?.status == null ? 'Send not confirmed' : 'Send failed'),
        receipt,
        transactionHash: transaction?.hash
    };
};