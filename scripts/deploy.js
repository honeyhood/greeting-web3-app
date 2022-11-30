const main = async () => {
  const greetingContractFactory = await hre.ethers.getContractFactory(
    'Greeting'
  );
  const greetingContract = await greetingContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.001'),
  });

  await greetingContract.deployed();

  console.log('GreetingContract address: ', greetingContract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
