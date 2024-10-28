import { toNano } from '@ton/core';
import { NewToken } from '../wrappers/NewToken';
import { NetworkProvider } from '@ton/blueprint';
import {Address  } from "@ton/ton";

// export async function run(provider: NetworkProvider) {
//     const newToken = provider.open(await NewToken.fromInit(BigInt(0),'NewToken', 'NTT',BigInt(21000000)));
//     const counterAddress = Address.parse("EQC-obLjZZJDZYS6MYc8wSTm6jkX_SfxHayCqB51vqzo8dHX");

//     await newToken.send(
//         provider.sender(),
//         {
//             value: toNano('0.05'),
//         },
//         {
//             $$type: 'Deploy',
//             queryId: 0n,
//         }
//     );

//     await provider.waitForDeploy(newToken.address);
//     const counter = NewToken.fromAddress(newToken.address);
//     const counterContract = provider.open(counter);
//     const result5 =  await counterContract.send(provider.sender(),{value: toNano('0.05'), bounce: false}, {
//     $$type: 'Add',
//     queryId: 0n,
//     amount: 2n,
//    });
//    const result6 = await counterContract.getCounter();

//     console.log(result5, result6);
// }
export async function run(provider: NetworkProvider) {
    const newToken = provider.open(await NewToken.fromInit(BigInt(0),'NewToken', 'NTT',BigInt(21000000)));
    
        await newToken.send(
            provider.sender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );
    
        await provider.waitForDeploy(newToken.address);
}

