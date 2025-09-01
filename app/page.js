'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Filters from '../components/Filters'
import ArticleCard from '../components/ArticleCard'
import EmptyState from '../components/EmptyState'

export default function HomePage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [source, setSource] = useState('all')
    const [tag, setTag] = useState('')
    const [savedItems, setSavedItems] = useState({})

    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('search') || ''

    // load saved items from localStorage
    useEffect(() => {
        try {
            const saved = localStorage.getItem('dailydev:saved')
            if (saved) {
                const parsed = JSON.parse(saved)
                setSavedItems(parsed)
            }
        } catch (error) {
            console.error('Error loading saved items:', error)
        }
    }, [])

    // fetch articles when filters change
    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true)
            setError(null)

            try {
                const params = new URLSearchParams()
                if (searchQuery) params.append('query', searchQuery)
                if (source !== 'all') params.append('source', source)
                if (tag) params.append('tag', tag)

                const response = await fetch(`/api/aggregate?${params}`)
                const data = await response.json()

                if (response.headers.get('x-dd-error')) {
                    setError('Some sources failed to load. Please try again.')
                }

                setItems(data.items || [])
            } catch (error) {
                console.error('Error fetching articles:', error)
                setError('Failed to load articles. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchArticles()
    }, [searchQuery, source, tag])

    // handle save/unsave
    const handleSaveToggle = (item) => {
        const newSavedItems = { ...savedItems }

        if (newSavedItems[item.id]) {
            delete newSavedItems[item.id]
        } else {
            newSavedItems[item.id] = item
        }

        setSavedItems(newSavedItems)

        try {
            localStorage.setItem('dailydev:saved', JSON.stringify(newSavedItems))
        } catch (error) {
            console.error('Error saving to localStorage:', error)
        }
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">Loading articles...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 mb-4">{error}</div>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        )
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Developer News Feed</h1>

            <Filters
                source={source}
                onSourceChange={setSource}
                tag={tag}
                onTagChange={setTag}
            />

            {items.length === 0 ? (
                <EmptyState message="No articles found. Try adjusting your filters." />
            ) : (
                <div>
                    <p className="text-gray-600 mb-4">Found {items.length} articles</p>
                    {items.map((item) => (
                        <ArticleCard
                            key={item.id}
                            item={item}
                            onSaveToggle={handleSaveToggle}
                            saved={!!savedItems[item.id]}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
