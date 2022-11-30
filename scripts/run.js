const main = async () => {
  const greetingContractFactory = await hre.ethers.getContractFactory(
    'Greeting'
  );
  const greetingContract = await greetingContractFactory.deploy({
    value: hre.ethers.utils.parseEther('0.1'),
  });
  await greetingContract.deployed();
  console.log('Contract addy:', greetingContract.address);

  let contractBalance = await hre.ethers.provider.getBalance(
    greetingContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let postTxn = await greetingContract.post('A message!');
  await postTxn.wait();

  let postTxn2 = await greetingContract.post('hey');
  await postTxn2.wait();

  contractBalance = await hre.ethers.provider.getBalance(
    greetingContract.address
  );
  console.log(
    'Contract balance:',
    hre.ethers.utils.formatEther(contractBalance)
  );

  let allPosts = await greetingContract.getAllPosts();
  console.log(allPosts);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
