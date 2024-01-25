import { ethers } from "ethers";
import { hexToNumber } from "web3-utils";
import axios, { AxiosResponse } from "axios";

import abi from "./abi.json";
import { NetworkName } from "../common/enums/NetworkName";
import { CONTRACT_ADDRESS, DEFAULT_REFUEL_COST_USD } from "../common/constants";
import { AccountDto } from "../common/dto/AccountDto";
import { wait } from "../utils/wait";
import { ChainDto } from "../common/dto/ChainDto";

interface ChainToSend {
    id: number;
    name: string;
    network: string;
    lzChain: number | null;
    token: string;
}

interface ControllerFunctionProps {
    account: AccountDto | null;
    accountAddress: string;
    contractAddress: string;
    chainToSend: ChainToSend;
}

interface ControllerFunctionResult {
    result: boolean;
    message: string;
    receipt?: any;
    transactionHash: string;
    blockId?: number;
}

const TRANSACTION_WAIT: number = 60000;
const LZ_VERSION = 1;

/**
 * Mint NFT Functionality
 * @param contractAddress Contract address for selected chain
 * @param chainToSend Current chain to send NFT
 * @param account User account
 */
export const mintNFT = async ({ contractAddress, chainToSend, account }: ControllerFunctionProps): Promise<ControllerFunctionResult> => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);

    const signer = await provider.getSigner();
    const sender = await signer.getAddress();

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const mintFee = await contract.mintFee();

    const userBalance = await provider.getBalance(sender);

    if (userBalance < mintFee) {
        return {
            result: false,
            message: 'Not enough funds to mint',
            transactionHash: ''
        };
    }

    let options: any = { value: BigInt(mintFee), gasLimit: BigInt(0) };
    let gasLimit, txResponse;

    if (account?.refferer) {
        gasLimit = await contract['mint(address)'].estimateGas(account.refferer, options);
        options.gasLimit = gasLimit;

        txResponse = await contract['mint(address)'](account.refferer, options);
    } else {
        gasLimit = await contract['mint()'].estimateGas(options);
        options.gasLimit = gasLimit;

        txResponse = await contract['mint()'](options);
    }

    await wait();

    // Magic for working functionality. Don't remove
    console.log("Minting..", { id: chainToSend.id, network: chainToSend.network, hash: txResponse?.hash });

    const receipt = await txResponse.wait(null, TRANSACTION_WAIT);

    const log = (receipt.logs as any[]).find(x => x.topics.length === 4);
    let blockId: number;

    if (chainToSend.network === NetworkName.Polygon) {
        blockId = parseInt(`${hexToNumber(receipt.logs[1].topics[3])}`);
    } else {
        blockId = parseInt(`${hexToNumber(log.topics[3])}`);
    }

    return {
        result: receipt?.status === 1,
        message: receipt?.status === 1 ? 'Successful send' : (receipt?.status == null ? 'Send not confirmed' : 'Send failed'),
        transactionHash: txResponse?.hash,
        receipt,
        blockId
    }
}

export interface EstimationBridge {
    network: NetworkName;
    price: string;
}

export type EstimationBridgeType = (EstimationBridge | null)[]

export const estimateBridge = async (
    chains: ChainDto[],
    token: string,
    { contractAddress }: ControllerFunctionProps,
    tokenId: number,
    refuel: boolean = false,
    refuelCost: number = DEFAULT_REFUEL_COST_USD
): Promise<EstimationBridgeType> => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);

    const signer = await provider.getSigner();
    const sender = await signer.getAddress();

    const price = await fetchPrice(token);

    async function estimate(chainToSend: ChainToSend) {
        const _toAddress = ethers.solidityPacked(
            ["address"], [sender]
        );

        const contract = new ethers.Contract(contractAddress, abi, signer);
        const _dstChainId = chainToSend?.lzChain;

        const MIN_DST_GAS = await contract.minDstGasLookup(_dstChainId, LZ_VERSION);

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
            _dstChainId,
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

    return Promise.all(chains.map(chain => {
        return estimate({
            id: chain.chainId,
            name: chain.name,
            network: chain.network,
            lzChain: chain.lzChain,
            token: chain.token
        })
    }))
};

/**
 * Bridge NFT Functionality
 * @param contractAddress Contract address for selected chain
 * @param chainToSend Current chain to send NFT
 * @param account User account
 * @param tokenId NFT token id for sending to another chain
 * @param refuel Refuel enabled
 * @param refuelCost Refuel cost in dollars
 *
 */
export const bridgeNFT = async (
    { contractAddress, chainToSend }: ControllerFunctionProps,
    tokenId: number,
    refuel: boolean = false,
    refuelCost: number = DEFAULT_REFUEL_COST_USD
): Promise<ControllerFunctionResult> => {
    const provider = new ethers.BrowserProvider((window as any).ethereum);

    const signer = await provider.getSigner();
    const sender = await signer.getAddress();

    const _toAddress = ethers.solidityPacked(
        ["address"], [sender]
    );

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const _dstChainId = chainToSend?.lzChain;

    const MIN_DST_GAS = await contract.minDstGasLookup(_dstChainId, LZ_VERSION);

    let adapterParams;
    if (refuel) {
        const price = await fetchPrice(chainToSend?.token);

        if (!price) {
            return {
                result: false,
                message: 'Something went wrong :(',
                transactionHash: ''
            }
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
            transactionHash: ''
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

    await wait();

    // Magic for working functionality. Don't remove
    console.log("Bridging..", { id: chainToSend?.id, name: chainToSend?.name, hash: transaction?.hash });

    const receipt = await transaction.wait(null, TRANSACTION_WAIT)

    return {
        result: receipt?.status === 1,
        message: receipt?.status === 1 ? 'Successful send' : (receipt?.status == null ? 'Send not confirmed' : 'Send failed'),
        receipt,
        transactionHash: transaction?.hash
    };
};

export async function claimReferralFee(chain: ChainDto) {
    try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);

        const signer = await provider.getSigner();

        const contract = new ethers.Contract(CONTRACT_ADDRESS[chain.network as NetworkName], abi, signer);

        const txResponse = await contract.claimReferrerEarnings();
        const receipt = await txResponse.wait(null, 60000);

        return {
            result: receipt.status === 1,
            message: receipt.status === 1
                ? 'Successful Claim'
                : (receipt.status == null ? 'Claim not confirmed' : 'Claim Failed'),
            receipt
        };
    } catch (e) {
        console.error(e);

        return {
            result: false,
            message: 'Something went wrong :(',
        }
    }
}

export async function getReffererEarnedInNetwork(chain: ChainDto, accountAddress: string) {
    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const contract = new ethers.Contract(CONTRACT_ADDRESS[chain.network as NetworkName], abi, provider);
    const earned = await contract.referrersEarnedAmount(accountAddress);
    return ethers.formatEther(earned);
}

export async function fetchPrice(symbol: string): Promise<number | null> {
    let fetchSymbol = ""
    if (symbol == "MNT") {
        fetchSymbol = "MANTLE"
    } else {
        fetchSymbol = symbol
    }

    const url: string = `https://min-api.cryptocompare.com/data/price?fsym=${fetchSymbol.toUpperCase()}&tsyms=USDT`

    try {
        const response: AxiosResponse = await axios.get(url, { timeout: 10000 })

        if (response.status === 200 && response.data) {
            return parseFloat(response.data.USDT) || 0
        } else {
            await new Promise(resolve => setTimeout(resolve, 1000))
            return fetchPrice(symbol)
        }
    } catch (error) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        return fetchPrice(symbol)
    }
}

export const convertAddress = (hexString: string): string => {
    try {
        if (hexString.startsWith('0x')) hexString = hexString.substring(2)

        const byteArray = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))

        let binaryString = ''
        byteArray.forEach(byte => binaryString += String.fromCharCode(byte))

        binaryString = btoa(binaryString)
        return binaryString.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    } catch (error) {
        return ''
    }
}

export const decodeAddress = (encodedString: string): string => {
    try {
        encodedString = encodedString.replace(/-/g, '+').replace(/_/g, '/')

        const binaryString = atob(encodedString)

        let hexString = ''
        for (let i = 0; i < binaryString.length; i++) {
            let hex = binaryString.charCodeAt(i).toString(16)
            hexString += (hex.length === 2 ? hex : '0' + hex)
        }

        hexString = '0x' + hexString

        return hexString
    } catch (error) {
        return ''
    }
}