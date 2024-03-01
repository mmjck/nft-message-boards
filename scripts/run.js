const main = async () => {


    const waveContract = await hre.ethers.deployContract("WavePortal");
    await waveContract.waitForDeployment();
    
    console.log("Contract deployed to:", waveContract.target);

    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(parseInt(waveCount))

    let waveTxn = await waveContract.wave("Some message");
    await waveTxn.wait();


    const [_, randomPerson] = await hre.ethers.getSigners();
    waveTxn = await waveContract.connect(randomPerson).wave("Another message");
    await waveTxn.wait()

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);

}

main().catch((error) =>{
    console.log(error);
    process.exitCode = 1
})