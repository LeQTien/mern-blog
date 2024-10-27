import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CallToAction from '../components/CallToAction'
import PostCard from '../components/PostCard'

function Home() {
  const [posts, setPosts] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const postsPerPage = 2 * 3 // Số bài viết tối đa (2 cột * 3 hàng = 6 bài viết)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/v1/posts/getPosts')
        const data = await res.json()

        if (res.ok) {
          setPosts(data.posts)
        }
      } catch (error) {
        console.log(error)
      }
    }

    fetchPosts()
  }, [])

  // Tính toán số lượng trang
  const totalPages = Math.ceil(posts.length / postsPerPage)

  // Lấy bài viết cần hiển thị cho trang hiện tại
  const currentPosts = posts.slice(currentPage * postsPerPage, (currentPage + 1) * postsPerPage)

  return (
    <div>
      <div className='flex flex-col gap-6 lg:p-28 p-3 max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-500 text-sx sm:text-sm'>Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.</p>
        <Link to='/search' className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'>View all posts</Link>
      </div>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>
      <div className='max-w-8xl mx-auto p-80 flex flex-col gap-8 py-8'>
        {
          posts && posts.length > 0 &&
          <div className='flex flex-col gap-8'>
            <h2 className='text-4xl font-semibold text-center'>Recent Posts</h2>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6'>
              {
                currentPosts.map((post) => {
                  return <PostCard key={post._id} post={post} className="" />
                })
              }
            </div>
            <div className='flex justify-between mt-8'>
              <button 
                className={`text-lg text-teal-500 hover:underline ${currentPage === 0 ? 'disabled' : ''}`} 
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 0}
              >
                Prev
              </button>
              <span className='text-lg text-teal-500'>Page {currentPage + 1} of {totalPages}</span>
              <button 
                className={`text-lg text-teal-500 hover:underline ${currentPage === totalPages - 1 ? 'disabled' : ''}`} 
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </button>
            </div>
            <Link to='/search' className='text-lg text-teal-500 hover:underline text-center'>View all posts</Link>
          </div>
        }
      </div>
    </div>
  )
}

export default Home
