const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledTrackingFactory = require('../ethereum/build/TrackingFactory.json');
const compiledTracking = require('../ethereum/build/Tracking.json');

let accounts;
let factory;
let trackingAddress;
let tracking;

const item = 'dummyItem';
const fromWhom = 'dummyFromWhom';
const postalAddressRecipient = 'dummyPostalAddressRecipient';
let ethAddressRecipient;
const observations = 'dummyObservations';
let trackingStartingAt = 0;

before(async () => {
        console.log("Init test case");
        accounts = await web3.eth.getAccounts();
        ethAddressRecipient = accounts[9];
        console.log("Accounts:", accounts);
        console.log("ethAddressRecipient:", ethAddressRecipient);
    }

);

beforeEach(async () => {
    trackingFactoryInterface = new web3.eth.Contract(JSON.parse(compiledTrackingFactory.interface))
    console.log("Balance", await web3.eth.getBalance(accounts[0]));

    try {
        factory = await new web3.eth.Contract(JSON.parse(compiledTrackingFactory.interface))
            .deploy({
                data: compiledTrackingFactory.bytecode
            })
            .send({
                from: accounts[0],
                gas: '6000000'
            });
    } catch (error) {
        console.error("Error obtaining compiledTrackingFactory.interface", error);
    }


    try {
        await factory.methods.createTracking(item,
                fromWhom, postalAddressRecipient, ethAddressRecipient,
                observations)
            .send({
                from: accounts[0],
                gas: '1100000'
            });
    } catch (error) {
        console.error("Error createTracking ", error);
    }



    try {
        [trackingAddress] = await factory.methods.getDeployedTrackings().call();
        tracking = await new web3.eth.Contract(
            JSON.parse(compiledTracking.interface),
            trackingAddress
        );

        console.log(">>>>>>>>>>> tracking:", tracking);
    } catch (error) {
        console.error("Error getDeployedTrackings ", error);
    }



});

describe('Tracking', () => {
    it('deploys a factory and a tracking', () => {
        assert.ok(factory.options.address);
        assert.ok(tracking.options.address);
    });

    it('Checking init tracking parameters', async () => {
        await assertParameters(tracking, accounts[0], 'manager');
        await assertParameters(tracking, item, 'item');
        await assertParameters(tracking, fromWhom, 'fromWhom');
        await assertParameters(tracking, postalAddressRecipient, 'postalAddressRecipient');
        await assertParameters(tracking, ethAddressRecipient, 'ethAddressRecipient');
        await assertParameters(tracking, observations, 'observations');

        trackingStartingAt = await tracking.methods["when"]().call();
        assert.equal(true, trackingStartingAt > 0);

        const milestonesLength = await tracking.methods.getMilestoneLength().call();
        assert.equal(0, milestonesLength);

       // const summary = tracking.getSummary();

    });


    it('adding a milestone to the tracking', async () => {
        await assertAddingMilestoneCase('name0', 'location0', accounts[1], 1, false);
        await assertAddingMilestoneCase('name1', 'location1', accounts[2], 2, false);

        // // Recipient milestone case
        // await assertAddingMilestoneCase('name1', 'location1', ethAddressRecipient, 3, true);

        // try {
        //     await assertAddingMilestoneCase('name1', 'location1', ethAddressRecipient, 3, true);
        // } catch (error) {
        //     console.error("Trying to close tracking already closed:", error);
        //     assert.equal("revertss", error);
        // }
    });

    // it('allows people to contribute money and marks them as approvers', async () => {
    //   await tracking.methods.contribute().send({
    //     value: '200',
    //     from: accounts[1]
    //   });
    //   const isContributor = await tracking.methods.approvers(accounts[1]).call();
    //   assert(isContributor);
    // });

    // it('requires a minimum contribution', async () => {
    //   try {
    //     await tracking.methods.contribute().send({
    //       value: '5',
    //       from: accounts[1]
    //     });
    //     assert(false);
    //   } catch (err) {
    //     assert(err);
    //   }
    // });

    // it('allows a manager to make a payment request', async () => {
    //   await tracking.methods
    //     .createRequest('Buy batteries', '100', accounts[1])
    //     .send({
    //       from: accounts[0],
    //       gas: '1000000'
    //     });
    //   const request = await tracking.methods.requests(0).call();

    //   assert.equal('Buy batteries', request.description);
    // });

    // it('processes requests', async () => {
    //   await tracking.methods.contribute().send({
    //     from: accounts[0],
    //     value: web3.utils.toWei('10', 'ether')
    //   });

    //   await tracking.methods
    //     .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
    //     .send({ from: accounts[0], gas: '1000000' });

    //   await tracking.methods.approveRequest(0).send({
    //     from: accounts[0],
    //     gas: '1000000'
    //   });

    //   await tracking.methods.finalizeRequest(0).send({
    //     from: accounts[0],
    //     gas: '1000000'
    //   });

    //   let balance = await web3.eth.getBalance(accounts[1]);
    //   balance = web3.utils.fromWei(balance, 'ether');
    //   balance = parseFloat(balance);

    //   assert(balance > 104);
    // });
});

async function assertParameters(trackingSut, expectedValue, parameterToCheck) {
    const parameterValue = await trackingSut.methods[parameterToCheck]().call();
    assert.equal(expectedValue, parameterValue);
}

// async function assertParameters(trackingSut, expectedValue, parameterToCheck, index, field) {
//     console.log("HIIIIIIIIIIIxxxxx");
//         const parameterValue = await trackingSut.methods[parameterToCheck](index).call();
//         console.log("HIIIIIIIIIII");
//         assert.equal('xxx', parameterValue[field]);
//         assert.equal(1, 2);
// }

async function createMilestoneHelper(name0, location0, subjectAddress0) {
    try {
        let milestone = tracking.methods.createMilestone(name0, location0, subjectAddress0, "dummyObservations");
        await milestone
            .send({
                from: subjectAddress0,
                gas: '1000000'
            });
        return milestone;
    } catch (error) {
        console.error("Error calling createMilestone:", error);
    }
}

async function assertAddingMilestoneCase(name, location, subjectAddress, totalExpected, isCompleteExpected) {
    await createMilestoneHelper(name, location, subjectAddress);

    let milestonesLength = await tracking.methods.getMilestoneLength().call();
    assert.equal(totalExpected, milestonesLength);

    const milestone = await tracking.methods.milestones(milestonesLength - 1).call();

    assert.equal(name, milestone.name);
    assert.equal(location, milestone.location);
    assert.equal(subjectAddress, milestone.subjectAddress);
    assert.equal(true, milestone.when >= trackingStartingAt);

    const isComplete = await tracking.methods.complete().call();
    assert.equal(isCompleteExpected, isComplete);
}