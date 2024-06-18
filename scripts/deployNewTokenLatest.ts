import { toNano } from '@ton/core';
import { NewTokenLatest } from '../wrappers/NewTokenLatest';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const newTokenLatest = provider.open(
        NewTokenLatest.createFromConfig(
            {
                id: Math.floor(Math.random() * 10000),
                counter: 0,
            },
            await compile('NewTokenLatest')
        )
    );

    await newTokenLatest.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(newTokenLatest.address);

    console.log('ID', await newTokenLatest.getID());
}
