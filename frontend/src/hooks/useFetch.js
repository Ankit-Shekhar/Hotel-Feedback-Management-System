import { useEffect, useState } from 'react'

function useFetch(fetcher) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const execute = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await fetcher()
        if (isMounted) {
          setData(result)
        }
      } catch (err) {
        if (isMounted) {
          setError(err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    execute()

    return () => {
      isMounted = false
    }
  }, [fetcher])

  return { data, loading, error }
}

export default useFetch
