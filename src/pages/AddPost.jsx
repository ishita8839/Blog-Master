/* eslint-disable no-unused-vars */
import React from 'react'
import { Container, PostForm } from '../components'
import "./addPost.css"

function AddPost() {
  return (
    <div className='py-8'>
        <Container>
            <PostForm />
        </Container>
    </div>
  )
}

export default AddPost