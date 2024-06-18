import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { NewTokenLatest } from '../wrappers/NewTokenLatest';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('NewTokenLatest', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('NewTokenLatest');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let newTokenLatest: SandboxContract<NewTokenLatest>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        newTokenLatest = blockchain.openContract(
            NewTokenLatest.createFromConfig(
                {
                    id: 0,
                    counter: 0,
                },
                code
            )
        );

        deployer = await blockchain.treasury('deployer');

        const deployResult = await newTokenLatest.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: newTokenLatest.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and newTokenLatest are ready to use
    });

    it('should increase counter', async () => {
        const increaseTimes = 3;
        for (let i = 0; i < increaseTimes; i++) {
            console.log(`increase ${i + 1}/${increaseTimes}`);

            const increaser = await blockchain.treasury('increaser' + i);

            const counterBefore = await newTokenLatest.getCounter();

            console.log('counter before increasing', counterBefore);

            const increaseBy = Math.floor(Math.random() * 100);

            console.log('increasing by', increaseBy);

            const increaseResult = await newTokenLatest.sendIncrease(increaser.getSender(), {
                increaseBy,
                value: toNano('0.05'),
            });

            expect(increaseResult.transactions).toHaveTransaction({
                from: increaser.address,
                to: newTokenLatest.address,
                success: true,
            });

            const counterAfter = await newTokenLatest.getCounter();

            console.log('counter after increasing', counterAfter);

            expect(counterAfter).toBe(counterBefore + increaseBy);
        }
    });
});
