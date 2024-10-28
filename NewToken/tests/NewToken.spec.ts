import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { NewToken } from '../wrappers/NewToken';
import '@ton/test-utils';
import {Address  } from "@ton/ton";

describe('NewToken', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let newToken: SandboxContract<NewToken>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        newToken = blockchain.openContract(await NewToken.fromInit(BigInt(0),'NewToken', 'NTT',BigInt(21000000)));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await newToken.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );
        const counter = NewToken.fromAddress(newToken.address);
        const counterContract = blockchain.openContract(counter);
        const result = await counterContract.getOwner();
        const result1 = await counterContract.getNameOfContract();
        const result2 = await counterContract.getSymbolOfContract();
        const result3 = await counterContract.getTotalSupply();
        const result5 =  await counterContract.send(deployer.getSender(),{value: toNano('0.05'), bounce: false}, {
            $$type: 'Add',
            queryId: 0n,
            amount: 2n,
           });
           
       const result11 = await counterContract.getCounter();
        await counterContract.send(deployer.getSender(),{value: toNano('0.05'), bounce: false}, {
            $$type: 'SellToAddress',
            address: Address.parse("UQC1otD7AJpCpFV_DupFVBbpjwEm_f2tGBI9-XLyjuWWzOnL"),
            amount:10000n
           });
           const result9 =  await counterContract.send(deployer.getSender(),{value: toNano('0.05'), bounce: false}, {
            $$type: 'AddSeller',
            address: Address.parse("UQC1otD7AJpCpFV_DupFVBbpjwEm_f2tGBI9-XLyjuWWzOnL"),
           });
        //    const result9 =  await counterContract.send(deployer.getSender(),{value: toNano('0.05'), bounce: false}, {
        //     $$type: 'AddSeller',
        //     address: Address.parse("UQC1otD7AJpCpFV_DupFVBbpjwEm_f2tGBI9-XLyjuWWzOnL"),
        //    });
           const result6 = await counterContract.getIsSelledFromAddress(Address.parse("UQC1otD7AJpCpFV_DupFVBbpjwEm_f2tGBI9-XLyjuWWzOnL"));
           const result13 = await counterContract.getIsSelledFromAddress(Address.parse("EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Sps_Xzx01x8G"));
        const result8 = await counterContract.getGetBalanceFromAddress(Address.parse("UQC1otD7AJpCpFV_DupFVBbpjwEm_f2tGBI9-XLyjuWWzOnL"));
        const result10 = await counterContract.getGetBalanceFromAddress(Address.parse("EQBGhqLAZseEqRXz4ByFPTGV7SVMlI4hrbs-Sps_Xzx01x8G"));
        const result12 = await counterContract.getGetBalanceFromAddress(Address.parse("0QBNJXGXkUWX0RI2itAyT8wA5H6D7Lpgw4NSMHn9tkQfcuqd"));
       // const result15 = await counterContract.getAddressOfSender();
      //const result14 = await counterContract.getGetBalanceFromSender();
        //const result10 =  await counterContract.getGetBalanceFromSender();
        // let resultOfNewAddress = result8;
        // while(resultOfNewAddress === result8){
        //     console.log("waiting for transaction to confirm...");
        //      await sleep(1000);
        //      resultOfNewAddress = await counterContract.getGetBalanceFromAddress(Address.parse("UQC1otD7AJpCpFV_DupFVBbpjwEm_f2tGBI9-XLyjuWWzOnL"));
        // }
        console.log( result, result1, result2, result3, result8, result6, result10, result12, result13);
        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: newToken.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and newToken are ready to use
    });
    it('SellToAddress',()=>{

    })
});
function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
describe('AddSeller',()=>{
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let newToken: SandboxContract<NewToken>;
});