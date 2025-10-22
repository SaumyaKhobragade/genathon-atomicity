import React from 'react'
import Chip from './Chip'
const data = [
    {label: "Work", emoji: "💼"},
    {label: "Personal", emoji: "🏠"},
    {label: "Ideas", emoji: "💡"},
    {label: "Travel", emoji: "✈️"},
    {label: "Shopping", emoji: "🛒"},
    {label: "Fitness", emoji: "🏋️‍♂️"},
    {label: "Books", emoji: "📚"},
    {label: "Movies", emoji: "🎬"},
];


const ChipsBar = () => {
  return (
    <div className='flex gap-5'>
        {data.map((item, index) => (
            <Chip key={index} label={item.label} emoji={item.emoji} />
        ))}
    </div>
  )
}

export default ChipsBar