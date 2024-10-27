import { Button, Select, TextInput } from 'flowbite-react'
import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'

function Search() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized'
  })
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1) // Thêm state cho trang hiện tại
  const postsPerPage = 4 // Số bài viết mỗi trang

  const handleChange = (e) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value })
    }

    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc'
      setSidebarData({ ...sidebarData, sort: order })
    }

    if (e.target.id === 'category') {
      const category = e.target.value || 'uncategorized'
      setSidebarData({ ...sidebarData, category })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', sidebarData.searchTerm)
    urlParams.set('sort', sidebarData.sort)
    urlParams.set('category', sidebarData.category)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
    setCurrentPage(1) // Reset trang về 1 khi thay đổi bộ lọc
  }

  const fetchPosts = async () => {
    const urlParams = new URLSearchParams(location.search)
    try {
      setLoading(true)
      const searchQuery = urlParams.toString()
      const res = await fetch(`http://localhost:8000/api/v1/posts/getPosts?${searchQuery}`)
      const data = await res.json()

      if (!res.ok) {
        console.log(data.message)
        setLoading(false)
        return
      }

      setPosts(data.posts)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [location.search])

  // Xác định các bài viết sẽ hiển thị trên trang hiện tại
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  const handleNextPage = () => {
    if (currentPage < Math.ceil(posts.length / postsPerPage)) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b md:border-r md:min-h-screen border-gray-500'>
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select onChange={handleChange} value={sidebarData.category} id='category'>
              <option value='uncategorized'>uncategorized</option>
              <option value='reactjs'>Reactjs</option>
              <option value='nextjs'>Nextjs</option>
              <option value='javascript'>Javascript</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>Apply Filters</Button>
        </form>
      </div>
      <div className='w-full'>
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts results</h1>
        <div className='p-7 flex flex-wrap gap-4'>
          {
            !loading && currentPosts.length === 0 &&
            <p className='text-xl text-gray-500'>No posts found.</p>
          }
          {
            loading &&
            <p className='text-xl text-gray-500'>Loading...</p>
          }
          {
            !loading && currentPosts.map(post => {
              return <PostCard key={post._id} post={post} />
            })
          }
        </div>
        <div className='flex justify-between items-center p-7'>
          <Button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className='text-white text-lg'
          >
            Prev
          </Button>
          <span className='text-lg'>
            Page {currentPage} of {Math.ceil(posts.length / postsPerPage)}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage === Math.ceil(posts.length / postsPerPage)}
            className='text-white text-lg'
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Search
