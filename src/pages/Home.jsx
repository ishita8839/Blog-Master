/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import appwriteService from "../appwrite/config";
import { Container, PostCard } from '../components';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import "./home.css";
import image2 from "../assets/Cover.png";

function Home() {
    const [posts, setPosts] = useState([]);
    const [loader, setLoader] = useState(true);
    const status = useSelector((state) => state.auth.status);
    const navigate = useNavigate();

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents);
                setLoader(false);
            }
        });
    }, []);

    if (!status) {
        return (
            <div className="w-[100%] text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                           <div className='relative inline-block'>
                                <img src={image2} alt="this is an blog website" />
                                <button className="absolute top-[400px]  left-[140px] bg-black text-white border px-4 py-2 rounded-lg  cursor-pointer text-lg hover:bg-gray-900" onClick={() => navigate('/login')}>
Get Started
      </button>
                                </div>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div className='w-full py-8'>
            <Container>
                <div className='flex  flex-wrap smallSize'>
                    {loader && <h1 className='text-4xl text-center'>Posts Loading..</h1>}
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default Home;
