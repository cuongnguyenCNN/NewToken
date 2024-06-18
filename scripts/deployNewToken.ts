import { toNano } from '@ton/core';
import { NewToken } from '../wrappers/NewToken';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const newToken = provider.open(await NewToken.fromInit(BigInt(Math.floor(Math.random() * 10000)), "NewToken", "NTT", BigInt(2100000)));

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

    console.log('ID', await newToken.getId());
}
