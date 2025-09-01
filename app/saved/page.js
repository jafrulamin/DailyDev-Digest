'use client'

import { useState, useEffect } from 'react'
import ArticleCard from '../../components/ArticleCard'
import EmptyState from '../../components/EmptyState'
import { toCSV } from '../../lib/csv'

export default function SavedPage() {
    const [savedItems, setSavedItems] = useState({})

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

    // handle remove item
    const handleRemove = (itemId) => {
        const newSavedItems = { ...savedItems }
        delete newSavedItems[itemId]
        setSavedItems(newSavedItems)

        try {
            localStorage.setItem('dailydev:saved', JSON.stringify(newSavedItems))
        } catch (error) {
            console.error('Error saving to localStorage:', error)
        }
    }

    // handle export to CSV
    const handleExport = () => {
        const items = Object.values(savedItems)
        if (items.length === 0) {
            alert('No saved items to export')
            return
        }

        const csv = toCSV(items)
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = url
        a.download = `dailydev-saved-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    const items = Object.values(savedItems)

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Saved Articles</h1>
                {items.length > 0 && (
                    <button
                        onClick={handleExport}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Export CSV
                    </button>
                )}
            </div>

            {items.length === 0 ? (
                <EmptyState message="No saved articles yet. Save some articles from the feed!" />
            ) : (
                <div>
                    <p className="text-gray-600 mb-4">You have {items.length} saved articles</p>
                    {items.map((item) => (
                        <div key={item.id} className="relative">
                            <ArticleCard
                                item={item}
                                onSaveToggle={() => handleRemove(item.id)}
                                saved={true}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
