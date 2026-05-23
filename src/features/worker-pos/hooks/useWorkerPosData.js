import { useEffect, useState } from 'react'
import { getCategoriesWithItems } from '../../../services/menuService'
import { getActiveWorkers } from '../../../services/workerService'

export function useWorkerPosData() {
  const [categories, setCategories] = useState([])
  const [workers, setWorkers] = useState([])
  const [source, setSource] = useState('local')
  const [status, setStatus] = useState('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [openCategoryIds, setOpenCategoryIds] = useState(new Set())

  useEffect(() => {
    let isCurrent = true

    async function loadInitialData() {
      try {
        const [categoryResult, workerResult] = await Promise.all([
          getCategoriesWithItems(),
          getActiveWorkers(),
        ])

        if (!isCurrent) return

        setCategories(categoryResult.data)
        setWorkers(workerResult.data)
        setSource(categoryResult.source)
        setOpenCategoryIds(
          new Set(categoryResult.data.slice(0, 3).map((category) => category.id)),
        )
        setStatus('ready')
      } catch (error) {
        if (!isCurrent) return

        setErrorMessage(error.message)
        setStatus('error')
      }
    }

    loadInitialData()

    return () => {
      isCurrent = false
    }
  }, [])

  return {
    categories,
    errorMessage,
    openCategoryIds,
    setOpenCategoryIds,
    source,
    status,
    workers,
  }
}
