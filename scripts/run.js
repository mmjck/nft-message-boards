const main = async () => {

    const waveContract = await hre.ethers.deployContract("WavePortal", { value: hre.ethers.parseEther('0.1') });
    await waveContract.waitForDeployment();
    console.log("Contract deployed to:", waveContract.target);
    
    let contractBalance = await hre.ethers.provider.getBalance(
        waveContract.target
    );
    console.log(
        "Saldo do contrato:",
        hre.ethers.formatEther(contractBalance)
    );


        return;
    let waveCount;
    waveCount = await waveContract.getTotalWaves();
    console.log(parseInt(waveCount))

    let waveTxn = await waveContract.wave("Some message");
    await waveTxn.wait();

    contractBalance = await hre.ethers.provider.getBalance(waveContract.target);
    console.log(
        "Saldo do  contrato:",
        hre.ethers.formatEther(contractBalance)
    );

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);

}

main().catch((error) =>{
    console.log(error);
    process.exitCode = 1
})