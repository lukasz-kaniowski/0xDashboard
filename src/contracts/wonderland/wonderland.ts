import {BigNumber, ethers} from "ethers";

import LpBondContract from "./bonds/LpContract.json";
import WavaxBondContract from "./bonds/WavaxContract.json";
import StableContract from "./bonds/StableContract.json";

const mim = {
    name: "mim",
    displayName: "MIM",
    bondContractABI: StableContract.abi,
    bondAddress: "0x694738E0A438d90487b4a549b201142c1a97B556",
};

const wavax = {
    name: "wavax",
    displayName: "wAVAX",
    bondToken: "AVAX",
    bondContractABI: WavaxBondContract.abi,

    bondAddress: "0xE02B1AA2c4BE73093BE79d763fdFFC0E3cf67318",
    reserveAddress: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
};

const mimTime = {
    name: "mim_time_lp",
    displayName: "TIME-MIM LP",
    bondToken: "MIM",
    bondContractABI: LpBondContract.abi,

    bondAddress: "0xA184AE1A71EcAD20E822cB965b99c287590c4FFe",
    reserveAddress: "0x113f413371fc4cc4c9d6416cf1de9dfd7bf747df",
    lpUrl: "https://www.traderjoexyz.com/#/pool/0x130966628846BFd36ff31a822705796e8cb8C18D/0xb54f16fB19478766A268F172C9480f8da1a7c9C3",
};


const avaxTime = {
    name: "avax_time_lp",
    displayName: "TIME-AVAX LP",
    bondToken: "AVAX",
    bondContractABI: LpBondContract.abi,

    bondAddress: "0xc26850686ce755FFb8690EA156E5A6cf03DcBDE1",
    reserveAddress: "0xf64e1c5B6E17031f5504481Ac8145F4c3eab4917",
    lpUrl: "https://www.traderjoexyz.com/#/pool/AVAX/0xb54f16fB19478766A268F172C9480f8da1a7c9C3",
};

const bondContracts = [mim, wavax, mimTime, avaxTime]

export type BondResult = {
    name: string;
    displayName: string;
    payout: string;
}

const formatGwei = (amount: BigNumber) => ethers.utils.formatUnits(amount, "gwei")


export const fetchBonds = async (): Promise<BondResult[]> => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const address = await provider.getSigner().getAddress()

    return Promise.all(bondContracts
        .map(bondContract => new ethers.Contract(bondContract.bondAddress, bondContract.bondContractABI, provider))
        .map(contract => contract.pendingPayoutFor(address))
    ).then(results =>
        results.map(formatGwei)
            .map((payout, index) => ({
                name: bondContracts[index].name,
                displayName: bondContracts[index].displayName,
                payout
            }))
    )
}

export const redeemPendingPayout = async (name: string) => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = bondContracts.filter(it => it.name === name)[0];

    const address = await provider.getSigner().getAddress()
    await new ethers.Contract(contract.bondAddress, contract.bondContractABI, provider.getSigner())
        .redeem(address, true)
}
