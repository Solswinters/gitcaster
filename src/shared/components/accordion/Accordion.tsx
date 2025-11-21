/**
 * Accordion Component - Collapsible content panels
 */

import React, { useState } from 'react'

export interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className = '',
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      if (!allowMultiple) {
        newOpenItems.clear()
      }
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className={`divide-y divide-gray-200 rounded-lg border border-gray-200 ${className}`}>
      {items.map((item) => (
        <div key={item.id}>
          <button
            onClick={() => toggleItem(item.id)}
            className="flex w-full items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="font-medium">{item.title}</span>
            <span className="text-gray-500">{openItems.has(item.id) ? '−' : '+'}</span>
          </button>
          {openItems.has(item.id) && (
            <div className="border-t border-gray-200 p-4 text-sm text-gray-600">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Accordion

