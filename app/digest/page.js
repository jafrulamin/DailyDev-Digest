'use client'

import { useState, useEffect } from 'react'
import ArticleCard from '../../components/ArticleCard'
import EmptyState from '../../components/EmptyState'

export default function DigestPage() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // fetch top articles on mount
    useEffect(() => {
        const fetchDigest = async () => {
            setLoading(true)
            setError(null)

            try {
                const response = await fetch('/api/aggregate')
                const data = await response.json()

                if (response.headers.get('x-dd-error')) {
                    setError('Some sources failed to load. Please try again.')
                }

                // get top 10 by score, fallback to newest if no scores
                const sorted = (data.items || []).sort((a, b) => {
                    const scoreA = a.score || 0
                    const scoreB = b.score || 0
                    if (scoreA !== scoreB) {
                        return scoreB - scoreA
                    }
                    return b.createdAt - a.createdAt
                })

                setItems(sorted.slice(0, 10))
            } catch (error) {
                console.error('Error fetching digest:', error)
                setError('Failed to load digest. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchDigest()
    }, [])

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">Loading top articles...</div>
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
            <h1 className="text-3xl font-bold mb-6">Top 10 Developer Digest</h1>
            <p className="text-gray-600 mb-6">The most popular articles from all sources</p>

            {items.length === 0 ? (
                <EmptyState message="No articles available for digest." />
            ) : (
                <div>
                    {items.map((item, index) => (
                        <div key={item.id} className="mb-4">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl font-bold text-gray-300 mr-3">
                                    #{index + 1}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Score: {item.score || 'N/A'}
                                </span>
                            </div>
                            <ArticleCard
                                item={item}
                                onSaveToggle={() => { }} // no save functionality on digest page
                                saved={false}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
