import { ethers } from "ethers";
import Contract from "./config/Contract.json";

const address = Contract.contractAddress;
const abi = Contract.abi;

export function getLessonContract(signer) {
  return new ethers.Contract(address, abi, signer);
}
