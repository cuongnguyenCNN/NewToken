import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient, WalletContractV4, internal,fromNano, Address  } from "@ton/ton";
import { NewToken } from "./wrappers/NewToken";
import { NetworkProvider } from '@ton/blueprint';
import { Sender,toNano } from  '@ton/core';

 async function main() {
  // open wallet v4 (notice the correct wallet version here)
  const mnemonic = "uncle half chase good twist assault artwork rapid  cereal  exit unique web fiscal family divert type feature slender extend inch airport oven wreck swear"; // your 24 secret words (replace ... with the rest of the words)
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });

  // initialize ton rpc client on testnet
  const endpoint = await getHttpEndpoint({ network: "testnet" });
  const client = new TonClient({ endpoint });
  const walletContract = client.open(wallet);
  const walletSender = walletContract.sender(key.secretKey);
  const seqno = await walletContract.getSeqno();
    // open Counter instance by address
    const counterAddress = Address.parse("EQC-obLjZZJDZYS6MYc8wSTm6jkX_SfxHayCqB51vqzo8dHX"); // replace with your contract address 
    const counter = NewToken.fromAddress(counterAddress);
    const counterContract = client.open(counter);
    const result = await counterContract.getOwner();
    const result1 = await counterContract.getNameOfContract();
    const result2 = await counterContract.getSymbolOfContract();
    const result3 = await counterContract.getTotalSupply();
    //const result4 = await counterContract.getGetBalanceFromSender();
    // const result1 = await counterContract.getAddSeller(Address.parse("EQBIjt56wi7gjaA2gqdFNWY2n8zdBApoM1ocRotOgfQCqy6y"));
    // const result1 = await counterContract.getAddSeller(Address.parse("UQC1otD7AJpCpFV_DupFVBbpjwEm_f2tGBI9-XLyjuWWzOnL"));

   const result6 = await counterContract.getCounter();
   // const totalSupplyRemain = await counterContract.getTotalSupplyRemain();
   const AddNew = {
    $$type: 'Add',
    queryId: 0n,
    amount: 2n,
   };
    //const result2 = await counterContract.getRemoveSeller(Address.parse("EQBIjt56wi7gjaA2gqdFNWY2n8zdBApoM1ocRotOgfQCqy6y"));
    //const balancefromSender = await counterContract.getGetBalanceFromSender();
    //const balancefromAddress = await counterContract.getGetBalanceFromAddress(Address.parse("EQBIjt56wi7gjaA2gqdFNWY2n8zdBApoM1ocRotOgfQCqy6y"));
  //  const result5 =  await counterContract.send(walletSender,{value: toNano('0.05'), bounce: undefined}, {
  //   $$type: 'Add',
  //   queryId: 0n,
  //   amount: 2n,
  //  });
   const result7 = await counterContract.getCounter();
  //  const result7 = await counterContract.send(walletSender,{value: toNano('0.05')},{
  //   $$type:'AddSeller',
  //   address: Address.parse('UQC1otD7AJpCpFV_DupFVBbpjwEm_f2tGBI9-XLyjuWWzOnL'),
  //  })
    console.log( result, result1, result2, result3, result7);
  await walletContract.sendTransfer({
    secretKey: key.secretKey,
    seqno: seqno,
    messages: [
      internal({
        to: "EQC-obLjZZJDZYS6MYc8wSTm6jkX_SfxHayCqB51vqzo8dHX",
        value: "0.05", // 0.05 TON
        body: "Hello", // optional comment
        bounce: false,
      })
    ]
  });
//   // wait until confirmed
  let currentSeqno = seqno;
  while (currentSeqno == seqno) {
    console.log("waiting for transaction to confirm...");
    await sleep(1500);
    currentSeqno = await walletContract.getSeqno();
  }
  console.log("transaction confirmed!");
}

main();

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
