import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import abi from '../artifacts/contracts/Greeting.sol/Greeting.json';

const checkIfWalletIsConnected = async () => {
  try {
    const { ethereum } = window;

    if (!ethereum) {
      console.error('Make sure you have Metamask wallet installed!');
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log('Found an authorized account:', account);
      return account;
    } else {
      console.error('No authorized account found');
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [allPosts, setAllPosts] = useState([]);
  const [textValue, setTextValue] = useState('');
  const [loading, setLoading] = useState(false);

  const contractAddress = '0x4926C59a1A1594eb04d8fA128a5458BB2eb8417b';
  const contractABI = abi.abi;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTextValue(e.target.value);
  };

  useEffect(() => {
    const checkForAcc = async () => {
      const account = await checkIfWalletIsConnected();
      if (account !== null) {
        setCurrentAccount(account);
      }
      await getAllPosts();
    };
    checkForAcc();
    return () => {};
  }, [loading]);

  const connectWalletClick = async () => {
    try {
      if (!ethereum) {
        alert('Make sure you have Metamask wallet installed!');
        return;
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      console.log('Connected', accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const getAllPosts = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const greetingContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const posts = await greetingContract.getAllPosts();

        let postsCleaned = [];
        posts.forEach((post) => {
          postsCleaned.push({
            address: post.posted,
            timestamp: new Date(post.timestamp * 1000),
            message: post.message,
          });
        });
        setAllPosts(postsCleaned);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const post = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const greetingContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        if (textValue) {
          const postTxn = await greetingContract.post(textValue);
          console.log('Mining...', postTxn.hash);
          await setLoading(true);

          await postTxn.wait();
          console.log('Mined -- ', postTxn.hash);
          await setLoading(false);

          await setTextValue('');
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center w-full mt-16">
      <div className="flex flex-col justify-center m-w-[600px] items-center">
        <h1 className="text-3xl">🎧 Hey there!</h1>

        <div className="align-middle text-gray-300 mt-4">
          <p>Connect your Ethereum wallet and hit me up</p>
          <br />
          <textarea
            value={textValue}
            onChange={handleSubmit}
            className="p-4 rounded-xl resize-none outline-none"
            cols="50"
            rows="5"
            placeholder="Leave your message right here"
          />
        </div>

        {textValue && (
          <button
            className="rounded-lg hover:transition-all bg-[#1a1a1a] px-5 py-2 w-[20%] mt-3"
            onClick={post}
          >
            Send
          </button>
        )}

        {!currentAccount && (
          <button onClick={connectWalletClick}>Connect Wallet</button>
        )}

        <h1 className="text-2xl mt-5">All posts:</h1>
        {loading && <p>Processing your message on blockchain...</p>}
        {allPosts.length != 0 ? (
          [...allPosts].reverse().map((post, index) => {
            return (
              <div className="bg-[#1a1a1a] mt-4 p-4 rounded-xl" key={index}>
                <div>From {post.address}</div>
                <div>Time: {post.timestamp.toString()}</div>
                <div>{post.message}</div>
              </div>
            );
          })
        ) : (
          <p className="mt-3 text-lg">
            There is no messages yet. Submit a first one!
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
