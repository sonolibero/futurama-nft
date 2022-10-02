import { ethers } from 'ethers';
import WalletBalance from './WalletBalance';

import { useEffect, useState } from 'react';
import Futurama from '../artifacts/contracts/mycontract.sol/Futurama.json';
import { getAccountPath } from 'ethers/lib/utils';

const contractAddress = '0xAe475941CAb5F2516f8B17d49811D6ec57010c95';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get end used
const signer = provider.getSigner();

// get smart contract
const contract = new ethers.Contract(contractAddress, Futurama.abi, signer);

function Home() {

    const [totalMinted, setTotalMinted] = useState(0);
    useEffect(() => {
        getCount();
    }, []);

    const getCount = async () => {
        const count = await contract.count();
        setTotalMinted(parseInt(count));
    }

    return (
        <div>
            <WalletBalance />

            <h1>Futurama NFT Collection</h1>
            {
                Array(totalMinted + 1)
                .fill(0)
                .map((_, i) => (
                    <div key={i}>
                        <NFTImage tokenId={i} getCount={getCount} />
                    </div>
                ))}
        </div>
    );
}

function NFTImage({ tokenId, getCount })
{
    const contentId = 'Qmcrn8Pd3nSqo33XR2RsJLzJEcyNL5NiGbcEArDpyB448Q';
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/${contentId}/${tokenId}.png`

    const [isMinted, setIsMinted] = useState(false);

    useEffect(() => {
        getMintedStatus();
    }, [isMinted]);

    const getMintedStatus = async () => {
        const result = await contract.isContentOwned(metadataURI);
        console.log(result)
        setIsMinted(result);
    }

    const mintToken = async () => {
        const connection = contract.connect(signer);
        const addr = connection.address;
        const result = await contract.payToMint(addr, metadataURI, {
            value: ethers.utils.parseEther('0.05'),
        });

        await result.wait();
        getMintedStatus();
        getCount();
    }

    async function getURI() {
        const uri = await contract.tokenURI(tokenId);
        alert(uri);
    }
    return (
        <div>
            <img src={isMinted ? imageURI : 'img/placeholder.png'}></img>
            <h5>ID #{tokenId}</h5>
            {!isMinted ? (
                <button onClick={mintToken}>Mint</button>
            ) : (
                <button onClick={getURI}>Taken! Show URI</button>
            )
        }
        </div>
    )
}

export default Home;