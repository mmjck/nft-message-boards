const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();


    const waveContract = await hre.ethers.deployContract("WavePortal");
    await waveContract.waitForDeployment();
    
    console.log("Contract deployed to:", waveContract.target);
    console.log("Contract deployed by:", owner.address);

    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    let waveTxn = await waveContract.wave();
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();
}

main().catch((error) =>{
    console.log(error);
    process.exitCode = 1
})