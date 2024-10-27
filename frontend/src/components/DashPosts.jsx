import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { Table, Modal, Button } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'

function DashPosts() {
  const { currentUser } = useSelector((state) => state.user)
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [postIdToDelete, setPostIdToDelete] = useState('')

  const handleShowMore = async () => {
    const startIndex = userPosts.length

    try {
      const res = await fetch(`http://localhost:8000/api/v1/posts/getPosts?userId=${currentUser._id}&startIndex=${startIndex}`)

      const data = await res.json()

      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts])

        if (data.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeletePost = async () => {
    setShowModal(false)

    try {
      const res = await fetch(`http://localhost:8000/api/v1/posts/deletePost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await res.json()

      if (!res.ok) {
        console.log(data.message)
      } else {
        setUserPosts(userPosts.filter(post => post._id !== postIdToDelete))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/v1/posts/getPosts?userId=${currentUser._id}`)

        const data = await res.json()

        if (res.ok) {
          setUserPosts(data.posts)

          if (data.posts.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (currentUser.isAdmin) {
      fetchPosts()
    }
  }, [currentUser._id])

  return (
    <div className='w-full table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {
        currentUser.isAdmin && userPosts.length > 0 ?
          <>
            <Table hoverable className='shadow-md'>
              <Table.Head>
                <Table.HeadCell>Date udpated</Table.HeadCell>
                <Table.HeadCell>Post image</Table.HeadCell>
                <Table.HeadCell>Post title</Table.HeadCell>
                <Table.HeadCell>Category</Table.HeadCell>
                <Table.HeadCell>Delete</Table.HeadCell>
                <Table.HeadCell>
                  <span>Edit</span>
                </Table.HeadCell>
              </Table.Head>
              {
                userPosts.map((post) => {
                  return <Table.Body key={post._id} className='divide-y'>
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                      <Table.Cell>
                        <Link to={`/post/${post.slug}`}>
                          <img src={post.image} alt={post.title} className='w-20 h-20 object-cover bg-gray-500' />
                        </Link>
                      </Table.Cell>
                      <Table.Cell>
                        <Link className='font-medium text-gray-500 dark:text-white' to={`/post/${post.slug}`}>
                          {post.title}
                        </Link>
                      </Table.Cell>
                      <Table.Cell>{post.category}</Table.Cell>
                      <Table.Cell>
                        <span
                          onClick={() => {
                            setShowModal(true)
                            setPostIdToDelete(post._id)
                          }}
                          className='font-medium text-red-500 hover:underline cursor-pointer'
                        >
                          Delete
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <Link className='text-teal-500 hover:underline' to={`/update-post/${post._id}`}>
                          <span>Edit</span>
                        </Link>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                })
              }
            </Table>
            {
              showMore &&
              <button
                onClick={handleShowMore}
                className='w-full text-teal-500 self-center text-sm py-7'
              >
                Show more
              </button>
            }
          </>
          :
          <p>You have no posts yet!</p>
      }
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this post?</h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeletePost}>Yes, i'm sure</Button>
              <Button color='gray' onClick={() => setShowModal(false)}>No, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashPosts