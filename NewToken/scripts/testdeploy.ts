import { toNano } from '@ton/core';
import { NewToken } from '../wrappers/NewToken';
import { NetworkProvider, sleep } from '@ton/blueprint';
import {Address  } from "@ton/ton";

export async function run(provider: NetworkProvider) {
    //change address of smartcontract that have just deployed
    const newToken = provider.open(await NewToken.fromAddress(Address.parse("EQCypbCcGwJ0p8UukSPluHHA85LQchxFDZ9cIADUiLALo7bl")));
    
        await newToken.send(
            provider.sender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'SellToAddress',
                amount: 10000n,
                address: Address.parse("0QC1otD7AJpCpFV_DupFVBbpjwEm_f2tGBI9-XLyjuWWzFJB"),
            }
        );
        await newToken.send( provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'AddSeller',
            address: Address.parse("0QC1otD7AJpCpFV_DupFVBbpjwEm_f2tGBI9-XLyjuWWzFJB"),
        });
        const owner = await newToken.getOwner();
        const tokensOfOwner = await newToken.getGetBalanceFromAddress(Address.parse("EQBNJXGXkUWX0RI2itAyT8wA5H6D7Lpgw4NSMHn9tkQfcgzS"));
        const userCanSell = await newToken.getIsSelledFromAddress(Address.parse("0QC1otD7AJpCpFV_DupFVBbpjwEm_f2tGBI9-XLyjuWWzFJB"));
        const result8 = await newToken.getGetBalanceFromAddress(Address.parse("0QC1otD7AJpCpFV_DupFVBbpjwEm_f2tGBI9-XLyjuWWzFJB"));
        let newValue = result8;
        // while(newValue === result8){
        //     console.log("Wait for process transaction....");
        //     await sleep(1000);
        //     newValue = await newToken.getGetBalanceFromAddress(Address.parse("0QC1otD7AJpCpFV_DupFVBbpjwEm_f2tGBI9-XLyjuWWzFJB"));
        // }
        console.log(result8, newValue, userCanSell, owner, tokensOfOwner);
       
}


